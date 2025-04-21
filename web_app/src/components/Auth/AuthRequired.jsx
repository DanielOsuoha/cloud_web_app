import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRequired = ({ message = "Please login to continue" }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-required">
      <p>{message}</p>
      <div className="auth-required-buttons">
        <button 
          className="auth-required-login"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="auth-required-signup"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthRequired;