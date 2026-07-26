import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const API_URL = __ENV.API_URL || 'http://localhost:5000';
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

export default function() {
  const healthRes = http.get(`${API_URL}/api/health`);
  check(healthRes, { 'Health OK under stress': r => r.status === 200 });
  errorRate.add(healthRes.status !== 200);
  sleep(Math.random() * 1 + 0.5);
}
