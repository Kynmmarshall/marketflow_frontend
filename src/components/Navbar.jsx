import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header className="navbar">
        <div className="brand">
          <span className="brand-mark">
            Smart<span>School</span>
          </span>
        </div>
        {auth && (
          <div className="navbar-user">
            <span className="session-tag">
              <span className="led" aria-hidden="true" />
              {auth.user.name}
            </span>
            <span className={`role-badge role-${auth.user.role}`}>{auth.user.role}</span>
            <button type="button" className="btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </header>
      <div className="barcode" aria-hidden="true" />
    </>
  );
}