import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setAuth({ isLoggedIn: true, token: storedToken, user: JSON.parse(storedUser) });
    }
  }, []);

  const login = (user, token) => {
    setAuth({ isLoggedIn: true, user, token });
    localStorage.setItem('token', token);
    console.log(token)
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