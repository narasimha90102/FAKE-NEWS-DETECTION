import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Environment Configuration & Validation ───────────────────────────────────
const API_URL = __ENV.API_URL || __ENV.BASE_URL || 'http://localhost:5050';

if (!API_URL) {
  throw new Error('❌ FATAL: API_URL / BASE_URL environment variable is not defined!');
}

// ── Custom Metrics ───────────────────────────────────────────────────────────
const errorRate = new Rate('error_rate');
const healthCheckDuration = new Trend('health_check_duration', true);
const loginDuration = new Trend('login_duration', true);
const apiChecksDuration = new Trend('api_checks_duration', true);
const requestCount = new Counter('total_requests');

// ── Baseline Options: 100 users for 1 minute ─────────────────────────────────
export const options = {
  scenarios: {
    baseline_load: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      gracefulStop: '10s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<3000', 'avg<500'],
    http_req_failed: ['rate<0.05'],           // < 5% error rate
    error_rate: ['rate<0.05'],
    health_check_duration: ['p(95)<200'],
    login_duration: ['p(95)<1000'],
    api_checks_duration: ['p(95)<1500'],
  },
};

// ── Setup: Register Dedicated Load-Test Users in MongoDB ──────────────────────
export function setup() {
  console.log(`🚀 [k6 Setup] Target API_URL: ${API_URL}`);
  console.log(`📋 [k6 Setup] Initializing 5 test users for Baseline Load Test (100 VUs × 1m)`);

  const users = [];
  const testPassword = 'TestPassword@123';

  for (let i = 0; i < 5; i++) {
    const timestamp = Date.now();
    const username = `loaduser_${i}_${timestamp}`;
    const email = `loaduser_${i}_${timestamp}@test.com`;

    // Send required fields (username, email, password) matching backend auth route schema
    const registerPayload = JSON.stringify({
      username,
      email,
      password: testPassword
    });

    const regUrl = `${API_URL}/api/auth/register`;
    const res = http.post(regUrl, registerPayload, { headers: { 'Content-Type': 'application/json' } });

    if (res.status === 201 || res.status === 200) {
      console.log(`✅ [Setup] Created test user ${i + 1}/5 in MongoDB with email: ${email}`);
      users.push({ username, email, password: testPassword });
    } else if (res.status === 409) {
      console.log(`ℹ️ [Setup] User email already exists: ${email}`);
      users.push({ username, email, password: testPassword });
    } else {
      console.warn(`⚠️ [Setup] Failed to register user ${email} (status: ${res.status}): ${res.body}`);
    }
  }

  // Fallback: If DB setup failed, ensure dedicated fallback user exists
  if (users.length === 0) {
    const fallbackEmail = `fallback_user_${Date.now()}@test.com`;
    const fallbackUsername = `fallback_${Date.now()}`;
    http.post(`${API_URL}/api/auth/register`, JSON.stringify({
      username: fallbackUsername,
      email: fallbackEmail,
      password: testPassword
    }), { headers: { 'Content-Type': 'application/json' } });

    console.log(`ℹ️ [Setup] Created dedicated fallback user with email: ${fallbackEmail}`);
    users.push({ username: fallbackUsername, email: fallbackEmail, password: testPassword });
  }

  return { users, apiUrl: API_URL };
}

// ── Default VU Execution Loop ────────────────────────────────────────────────
export default function(data) {
  const usersList = (data && data.users && data.users.length > 0)
    ? data.users
    : [{ email: 'fallback_user@test.com', password: 'TestPassword@123' }];

  const user = usersList[Math.floor(Math.random() * usersList.length)];
  const headers = { 'Content-Type': 'application/json' };

  requestCount.add(1);

  // ── Test 1: Health Check GET /api/health ──────────────────────────────────
  const t0 = Date.now();
  const healthUrl = `${API_URL}/api/health`;
  const healthRes = http.get(healthUrl);
  healthCheckDuration.add(Date.now() - t0);

  const healthOk = check(healthRes, {
    'Health check status is 200': r => r.status === 200,
    'Health check returns ok': r => r.json('status') === 'ok',
    'Health check fast < 500ms': r => r.timings.duration < 500,
  });

  if (!healthOk && healthRes.status !== 200) {
    console.warn(`❌ [HTTP GET] ${healthUrl} failed with status ${healthRes.status}: ${healthRes.body}`);
  }
  errorRate.add(healthRes.status !== 200);
  sleep(0.1);

  // ── Test 2: User Login POST /api/auth/login ───────────────────────────────
  if (user && user.email) {
    const t1 = Date.now();
    const loginUrl = `${API_URL}/api/auth/login`;
    const loginPayload = JSON.stringify({ email: user.email, password: user.password });
    
    // Log target user email (never log passwords)
    if (__ITER % 50 === 0) {
      console.log(`🔐 [k6 VU Execution] Attempting HTTP POST login for email: ${user.email}`);
    }

    const loginRes = http.post(loginUrl, loginPayload, { headers });
    loginDuration.add(Date.now() - t1);

    const loginOk = check(loginRes, {
      'Login status is 200': r => r.status === 200,
      'Login returns user object': r => r.json('user') !== undefined || r.json('success') === true,
      'Login response time < 1s': r => r.timings.duration < 1000,
    });

    if (!loginOk && loginRes.status !== 200) {
      console.warn(`❌ [HTTP POST Login] ${loginUrl} failed for email ${user.email} with status ${loginRes.status}: ${loginRes.body}`);
    }
    errorRate.add(loginRes.status !== 200);
  }
  sleep(0.2);

  // ── Test 3: GET /api/checks ───────────────────────────────────────────────
  const t2 = Date.now();
  const checksUrl = `${API_URL}/api/checks`;
  const checksRes = http.get(checksUrl, { headers });
  apiChecksDuration.add(Date.now() - t2);

  const checksOk = check(checksRes, {
    'Checks API status is 200 or 401': r => [200, 401].includes(r.status),
    'Checks API response time < 1.5s': r => r.timings.duration < 1500,
  });

  if (!checksOk) {
    console.warn(`⚠️ [HTTP GET] ${checksUrl} returned status ${checksRes.status}`);
  }
  sleep(0.3);

  // ── Test 4: GET /api/checks/trending ─────────────────────────────────────
  const trendingUrl = `${API_URL}/api/checks/trending`;
  const trendingRes = http.get(trendingUrl, { headers });
  check(trendingRes, {
    'Trending API responds': r => [200, 401, 404].includes(r.status),
    'Trending fast < 2s': r => r.timings.duration < 2000,
  });
  sleep(0.2);

  // ── Test 5: Invalid Route 404 Verification ──────────────────────────────
  const invalidUrl = `${API_URL}/api/nonexistent`;
  const notFoundRes = http.get(invalidUrl);
  check(notFoundRes, {
    'Invalid route returns 404': r => r.status === 404,
  });
  sleep(0.1);

  // ── Test 6: Registration Load Attempt ────────────────────────────────────
  const regUrl = `${API_URL}/api/auth/register`;
  const regPayload = JSON.stringify({
    username: `unique_user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    email: `unique_${Date.now()}_${Math.floor(Math.random() * 10000)}@loadtest.com`,
    password: 'TestPassword@123'
  });
  const registerRes = http.post(regUrl, regPayload, { headers });
  check(registerRes, {
    'Register responds': r => [200, 201, 400, 409, 422].includes(r.status),
    'Register response time < 2s': r => r.timings.duration < 2000,
  });

  sleep(Math.random() * 0.5 + 0.1);
}

// ── Teardown ─────────────────────────────────────────────────────────────────
export function teardown(data) {
  console.log(`✅ [k6 Teardown] Baseline load test completed for API: ${data?.apiUrl || API_URL}`);
  console.log(`📊 [k6 Teardown] Total virtual users: 100 | Target duration: 1 minute`);
}
