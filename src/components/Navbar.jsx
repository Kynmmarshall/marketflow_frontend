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
    <header className="navbar">
      <span className="brand">SmartStock</span>
      {auth && (
        <div className="navbar-user">
          <span>
            {auth.user.name} <span className={`role-badge role-${auth.user.role}`}>{auth.user.role}</span>
          </span>
          <button type="button" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </header>
  );
}
