import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Decode JWT without a library to check expiry
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds; Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat malformed token as expired
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tasknest_user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      if (isTokenExpired(token)) {
        // Token expired — clear stale session silently
        localStorage.removeItem('token');
        localStorage.removeItem('tasknest_user');
      } else {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('tasknest_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tasknest_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tasknest_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
