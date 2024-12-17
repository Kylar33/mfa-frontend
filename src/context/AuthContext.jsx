import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('auth', JSON.stringify(userData));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);