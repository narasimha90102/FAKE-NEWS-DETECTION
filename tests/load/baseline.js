import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Environment Configuration & Validation ───────────────────────────────────
const API_URL = __ENV.API_URL || __ENV.BASE_URL || 'http://localhost:5000';

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

// ── Setup: Initialize Test Users & Validate Endpoint Connectivity ────────────
export function setup() {
  console.log(`🚀 [k6 Setup] Target API_URL: ${API_URL}`);
  console.log(`📋 [k6 Setup] Running Baseline Load Test (100 VUs × 1m)`);

  const users = [];
  for (let i = 0; i < 5; i++) {
    const email = `loaduser_${i}_${Date.now()}@test.com`;
    const payload = JSON.stringify({
      name: `Load User ${i}`,
      email,
      password: 'Test@1234'
    });
    const url = `${API_URL}/api/auth/register`;
    const res = http.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
    
    if (res.status === 201 || res.status === 200) {
      const token = res.json('token');
      users.push({ email, password: 'Test@1234', token });
      console.log(`✅ [Setup] User registered: ${email} (status: ${res.status})`);
    } else {
      console.log(`⚠️ [Setup] Register returned status ${res.status} for ${url}: ${res.body}`);
    }
  }

  // Ensure users list is never empty to prevent execution stalls
  if (users.length === 0) {
    console.log(`ℹ️ [Setup] Using fallback test user identity for VU executions.`);
    users.push({ email: 'loaduser_fallback@test.com', password: 'Test@1234', token: null });
  }

  return { users, apiUrl: API_URL };
}

// ── Default VU Execution Loop ────────────────────────────────────────────────
export default function(data) {
  const usersList = (data && data.users && data.users.length > 0)
    ? data.users
    : [{ email: 'loaduser_fallback@test.com', password: 'Test@1234', token: null }];

  const user = usersList[Math.floor(Math.random() * usersList.length)];
  const headers = { 'Content-Type': 'application/json' };
  if (user?.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

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
    const loginRes = http.post(loginUrl, loginPayload, { headers });
    loginDuration.add(Date.now() - t1);

    const loginOk = check(loginRes, {
      'Login status is 200': r => r.status === 200,
      'Login returns token': r => r.json('token') !== undefined,
      'Login response time < 1s': r => r.timings.duration < 1000,
    });

    if (!loginOk && loginRes.status !== 200) {
      console.warn(`❌ [HTTP POST] ${loginUrl} failed with status ${loginRes.status}: ${loginRes.body}`);
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
    name: 'Load Test User',
    email: `unique_${Date.now()}_${Math.random()}@loadtest.com`,
    password: 'Test@1234'
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
