// Talks to the API Gateway (Week 3), not the individual services directly —
// auth-service, academic-service and finance-service have no port
// published to the host.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export function register({ name, email, password, role }) {
  return request('/auth/register', { method: 'POST', body: { name, email, password, role } });
}

export function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function fetchReports(token) {
  return request('/reports', { token });
}

export function fetchCourses(token) {
  return request('/courses', { token });
}

export function createEnrollment({ courseId }, token) {
  return request('/enrollments', { method: 'POST', body: { courseId }, token });
}

export function fetchInvoices(token) {
  return request('/finance/invoices', { token });
}
