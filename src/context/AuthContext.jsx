import { useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/client';
import { AuthContext } from './auth-context';

const STORAGE_KEY = 'smartstock.auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  async function login(credentials) {
    const { token, user } = await apiLogin(credentials);
    setAuth({ token, user });
  }

  async function register(details) {
    await apiRegister(details);
  }

  function logout() {
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
