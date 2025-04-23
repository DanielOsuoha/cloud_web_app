import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // On login, you would save the token (and user info) here.
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    token: null,
    user: null,
  });

  // Optionally, implement logic to check local storage for a stored token, etc.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setAuth({ isLoggedIn: true, token: storedToken, user: JSON.parse(storedUser) });
    }
  }, []);

  const login = (user, token) => {
    setAuth({ isLoggedIn: true, user, token });
    // Optionally save token and user into local storage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};