import { useState } from 'react';
import { fetchReports, fetchCourses } from '../api/client';
import { useAuth } from '../context/useAuth';

function useDemoRequest(fetcher) {
  const { auth } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await fetcher(auth.token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, error, loading, run };
}

export function DashboardPage() {
  const { auth } = useAuth();
  const reports = useDemoRequest(fetchReports);
  const courses = useDemoRequest(fetchCourses);

  return (
    <div className="dashboard ticket">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Welcome, {auth.user.name}</h1>
          <p>
            Signed in as <span className={`role-badge role-${auth.user.role}`}>{auth.user.role}</span>.
            Every request below sends the JWT issued at login in the <code>Authorization</code>{' '}
            header, so the server can verify who you are and what you're allowed to do.
          </p>
        </div>
      </div>

      <hr className="ticket-divider" />

      <div className="rbac-demo">
        <h2>GET /api/v1/reports <span className="route-target">→ auth-service</span></h2>
        <p className="tagline">
          Routed through the Gateway to auth-service. Role-gated server-side —
          try tightening it to Admin-only live and re-run as Teacher.
        </p>
        <button type="button" className="btn-primary" onClick={reports.run} disabled={reports.loading}>
          {reports.loading ? 'Loading…' : 'Load reports'}
        </button>

        {reports.result && <pre className="terminal">{JSON.stringify(reports.result, null, 2)}</pre>}
        {reports.error && <p className="notice error" style={{ marginTop: 16 }}>{reports.error}</p>}
        {!reports.result && !reports.error && !reports.loading && (
          <p className="terminal-empty" style={{ marginTop: 16 }}>
            $ waiting for request…
          </p>
        )}
      </div>

      <hr className="ticket-divider" />

      <div className="rbac-demo">
        <h2>GET /api/v1/courses <span className="route-target">→ academic-service</span></h2>
        <p className="tagline">
          Same Gateway, same JWT, different backend — the Gateway picks the
          service by URL prefix, not by who's asking.
        </p>
        <button type="button" className="btn-primary" onClick={courses.run} disabled={courses.loading}>
          {courses.loading ? 'Loading…' : 'Load courses'}
        </button>

        {courses.result && <pre className="terminal">{JSON.stringify(courses.result, null, 2)}</pre>}
        {courses.error && <p className="notice error" style={{ marginTop: 16 }}>{courses.error}</p>}
        {!courses.result && !courses.error && !courses.loading && (
          <p className="terminal-empty" style={{ marginTop: 16 }}>
            $ waiting for request…
          </p>
        )}
      </div>
    </div>
  );
}
