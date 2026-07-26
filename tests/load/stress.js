import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// ── Environment Configuration & Validation ───────────────────────────────────
const API_URL = __ENV.API_URL || __ENV.BASE_URL || 'http://localhost:5050';

if (!API_URL) {
  throw new Error('❌ FATAL: API_URL / BASE_URL environment variable is not defined!');
}

const errorRate = new Rate('error_rate');

// ── Stress Test: Ramp from 10 → 200 → 500 users ──────────────────────────────
export const options = {
  stages: [
    { duration: '30s', target: 10  },   // Warm up
    { duration: '1m',  target: 100 },   // Normal load
    { duration: '30s', target: 200 },   // Increase to 200
    { duration: '1m',  target: 200 },   // Sustain 200 users
    { duration: '30s', target: 500 },   // Peak stress
    { duration: '30s', target: 0   },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],   // Under stress allow up to 5s
    http_req_failed: ['rate<0.15'],      // Max 15% errors under stress
    error_rate: ['rate<0.15'],
  },
};

export function setup() {
  console.log(`🚀 [k6 Stress Setup] Target API_URL: ${API_URL}`);
  return { apiUrl: API_URL };
}

export default function() {
  const healthUrl = `${API_URL}/api/health`;
  const healthRes = http.get(healthUrl);
  
  const healthOk = check(healthRes, { 
    'Health OK under stress': r => r.status === 200 
  });
  
  if (!healthOk && healthRes.status !== 200) {
    console.warn(`⚠️ [Stress GET] ${healthUrl} status ${healthRes.status}: ${healthRes.body}`);
  }

  errorRate.add(healthRes.status !== 200);
  sleep(Math.random() * 1 + 0.5);
}

export function teardown(data) {
  console.log(`✅ [k6 Stress Teardown] Stress load test completed for: ${data?.apiUrl || API_URL}`);
}
