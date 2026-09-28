import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medicash_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('medicash_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medicash_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medicash_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('medicash_token', token);
    } else {
      localStorage.removeItem('medicash_token');
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
