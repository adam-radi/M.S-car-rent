import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          if (res.success) {
            setUser(res.user);
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
