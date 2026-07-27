import { useState } from 'react';
import { fetchReports } from '../api/client';
import { useAuth } from '../context/useAuth';

export function DashboardPage() {
  const { auth } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLoadReports() {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await fetchReports(auth.token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard ticket">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Shift summary</span>
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
        <h2>Role-gated resource: /api/reports</h2>
        <p className="tagline">This endpoint checks your role server-side before returning data.</p>
        <button type="button" className="btn-primary" onClick={handleLoadReports} disabled={loading}>
          {loading ? 'Loading…' : 'Load reports'}
        </button>

        {result && <pre className="terminal">{JSON.stringify(result, null, 2)}</pre>}
        {error && <p className="notice error" style={{ marginTop: 16 }}>{error}</p>}
        {!result && !error && !loading && (
          <p className="terminal-empty" style={{ marginTop: 16 }}>
            $ waiting for request…
          </p>
        )}
      </div>
    </div>
  );
}