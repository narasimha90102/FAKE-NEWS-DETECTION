import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const API_URL = __ENV.API_URL || 'http://localhost:5000';

// Custom metrics
const errorRate = new Rate('error_rate');
const healthCheckDuration = new Trend('health_check_duration', true);
const loginDuration = new Trend('login_duration', true);
const apiChecksDuration = new Trend('api_checks_duration', true);
const requestCount = new Counter('total_requests');

// ── Baseline: 100 users for 1 minute ─────────────────────────────────────────
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

// Setup: Create test users
export function setup() {
  const users = [];
  for (let i = 0; i < 5; i++) {
    const email = `loaduser_${i}_${Date.now()}@test.com`;
    const res = http.post(`${API_URL}/api/auth/register`, JSON.stringify({
      name: `Load User ${i}`,
      email,
      password: 'Test@1234'
    }), { headers: { 'Content-Type': 'application/json' } });
    if (res.status === 201) {
      users.push({ email, password: 'Test@1234', token: res.json('token') });
    }
  }
  return { users };
}

export default function(data) {
  const user = data.users[Math.floor(Math.random() * data.users.length)];
  const headers = { 'Content-Type': 'application/json' };
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

  requestCount.add(1);

  // ── Test 1: Health Check ──────────────────────────────────────────────────
  const t0 = Date.now();
  const healthRes = http.get(`${API_URL}/api/health`);
  healthCheckDuration.add(Date.now() - t0);
  check(healthRes, {
    'Health check status is 200': r => r.status === 200,
    'Health check returns ok': r => r.json('status') === 'ok',
    'Health check fast < 500ms': r => r.timings.duration < 500,
  });
  errorRate.add(healthRes.status !== 200);
  sleep(0.1);

  // ── Test 2: Login ─────────────────────────────────────────────────────────
  if (user) {
    const t1 = Date.now();
    const loginRes = http.post(`${API_URL}/api/auth/login`, JSON.stringify({
      email: user.email, password: user.password
    }), { headers });
    loginDuration.add(Date.now() - t1);
    check(loginRes, {
      'Login status is 200': r => r.status === 200,
      'Login returns token': r => r.json('token') !== undefined,
      'Login response time < 1s': r => r.timings.duration < 1000,
    });
    errorRate.add(loginRes.status !== 200);
  }
  sleep(0.2);

  // ── Test 3: GET /api/checks ───────────────────────────────────────────────
  const t2 = Date.now();
  const checksRes = http.get(`${API_URL}/api/checks`, { headers });
  apiChecksDuration.add(Date.now() - t2);
  check(checksRes, {
    'Checks API status is 200 or 401': r => [200, 401].includes(r.status),
    'Checks API response time < 1.5s': r => r.timings.duration < 1500,
  });
  sleep(0.3);

  // ── Test 4: GET /api/checks/trending ─────────────────────────────────────
  const trendingRes = http.get(`${API_URL}/api/checks/trending`, { headers });
  check(trendingRes, {
    'Trending API responds': r => [200, 401, 404].includes(r.status),
    'Trending fast < 2s': r => r.timings.duration < 2000,
  });
  sleep(0.2);

  // ── Test 5: Invalid route returns 404 ────────────────────────────────────
  const notFoundRes = http.get(`${API_URL}/api/nonexistent`);
  check(notFoundRes, {
    'Invalid route returns 404': r => r.status === 404,
  });
  sleep(0.1);

  // ── Test 6: Register attempt (will fail with duplicate) ───────────────────
  const registerRes = http.post(`${API_URL}/api/auth/register`, JSON.stringify({
    name: 'Load Test User',
    email: `unique_${Date.now()}_${Math.random()}@loadtest.com`,
    password: 'Test@1234'
  }), { headers });
  check(registerRes, {
    'Register responds': r => [200, 201, 400, 409, 422].includes(r.status),
    'Register response time < 2s': r => r.timings.duration < 2000,
  });

  sleep(Math.random() * 0.5 + 0.1);
}

export function teardown(data) {
  console.log(`✅ Baseline load test complete`);
  console.log(`📊 Total virtual users: 100 | Duration: 1 minute`);
}
