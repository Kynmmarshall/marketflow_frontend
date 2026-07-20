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
    <div className="dashboard">
      <h1>Welcome, {auth.user.name}</h1>
      <p>
        You are signed in as <span className={`role-badge role-${auth.user.role}`}>{auth.user.role}</span>.
        This is proven by the JWT issued at login — every request below sends it in the
        <code>Authorization</code> header so the server can verify who you are and what you're allowed to do.
      </p>

      <div className="rbac-demo">
        <h2>Role-gated resource: /api/reports</h2>
        <p>This endpoint checks your role server-side before returning data.</p>
        <button type="button" onClick={handleLoadReports} disabled={loading}>
          {loading ? 'Loading…' : 'Load reports'}
        </button>
        {result && <pre className="notice success">{JSON.stringify(result, null, 2)}</pre>}
        {error && <p className="notice error">{error}</p>}
      </div>
    </div>
  );
}
