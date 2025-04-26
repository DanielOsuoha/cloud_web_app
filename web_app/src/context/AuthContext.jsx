import React, { createContext, useState, useEffect, useCallback } from 'react';

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
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuth({
          isLoggedIn: true,
          token: storedToken,
          user: parsedUser
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout(); 
      }
    }
  }, []);

  const login = useCallback((user, token) => {
    if (!user || !token) {
      console.error('Invalid login data:', { user, token });
      return;
    }

    setAuth(prevState => ({
      ...prevState,
      isLoggedIn: true,
      token: token,
      user: user
    }));

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log(localStorage.getItem('token'));
  }, []);

  const logout = useCallback(() => {
    setAuth(prevState => ({
      ...prevState,
      isLoggedIn: false,
      user: null,
      token: null
    }));
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const value = {
    ...auth,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};