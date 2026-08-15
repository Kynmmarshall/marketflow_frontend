import { useEffect, useState } from 'react';
import { fetchReports, fetchCourses, createEnrollment, fetchInvoices } from '../api/client';
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

function useEnrollPanel() {
  const { auth } = useAuth();
  const [courseList, setCourseList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses(auth.token)
      .then((data) => {
        setCourseList(data.courses || []);
        if (data.courses?.length) setSelectedCourseId(String(data.courses[0].id));
      })
      .catch(() => {}); // silent — the "Load courses" panel above already surfaces fetch errors
  }, [auth.token]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await createEnrollment({ courseId: Number(selectedCourseId) }, auth.token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { courseList, selectedCourseId, setSelectedCourseId, result, error, loading, submit };
}

export function DashboardPage() {
  const { auth } = useAuth();
  const reports = useDemoRequest(fetchReports);
  const courses = useDemoRequest(fetchCourses);
  const enroll = useEnrollPanel();
  const invoices = useDemoRequest(fetchInvoices);

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

      <hr className="ticket-divider" />

      <div className="rbac-demo">
        <h2>POST /api/v1/enrollments <span className="route-target">→ academic-service</span></h2>
        <p className="tagline">
          Week 4: on success this publishes an <code>enrollment.created</code> event to
          RabbitMQ — finance-service picks it up and creates an invoice on its own, without
          this request waiting on it. Check the "My invoices" panel below afterward.
        </p>
        <form onSubmit={enroll.submit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label style={{ flex: 1, minWidth: 200 }}>
            Course
            <select
              value={enroll.selectedCourseId}
              onChange={(e) => enroll.setSelectedCourseId(e.target.value)}
              disabled={!enroll.courseList.length}
            >
              {enroll.courseList.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn-primary" disabled={enroll.loading || !enroll.selectedCourseId}>
            {enroll.loading ? 'Enrolling…' : 'Enroll'}
          </button>
        </form>

        {enroll.result && <pre className="terminal">{JSON.stringify(enroll.result, null, 2)}</pre>}
        {enroll.error && <p className="notice error" style={{ marginTop: 16 }}>{enroll.error}</p>}
        {!enroll.result && !enroll.error && !enroll.loading && (
          <p className="terminal-empty" style={{ marginTop: 16 }}>
            $ waiting for request…
          </p>
        )}
      </div>

      <hr className="ticket-divider" />

      <div className="rbac-demo">
        <h2>GET /api/v1/finance/invoices <span className="route-target">→ finance-service</span></h2>
        <p className="tagline">
          Nothing calls finance-service directly to create these — every row here was created
          by its RabbitMQ consumer reacting to an enrollment, independently and asynchronously.
        </p>
        <button type="button" className="btn-primary" onClick={invoices.run} disabled={invoices.loading}>
          {invoices.loading ? 'Loading…' : 'Load invoices'}
        </button>

        {invoices.result && <pre className="terminal">{JSON.stringify(invoices.result, null, 2)}</pre>}
        {invoices.error && <p className="notice error" style={{ marginTop: 16 }}>{invoices.error}</p>}
        {!invoices.result && !invoices.error && !invoices.loading && (
          <p className="terminal-empty" style={{ marginTop: 16 }}>
            $ waiting for request…
          </p>
        )}
      </div>
    </div>
  );
}
