import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        throw new Error('Failed to send reset token');
      }
      const data = await response.json();
      setMessage(data.message);
      setValidated(true);
    } catch (error) {
      setMessage('Error sending reset link');
    }
  };

  // Second form: Submit new password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch("hhttp://34.205.144.114api/users/reset-password", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error('Failed to reset password.');
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Password</h2>
      {!validated && (
        <form onSubmit={handleEmailSubmit} className="forgot-password-form">
          <input
            type="email"
            value={email}
            placeholder="Your Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-password-input"
          />
          <button type="submit" className="forgot-password-button">
            Reset Password
          </button>
        </form>
      )}
      {validated && (
        <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
          <input
            type="password"
            value={password}
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="forgot-password-input"
          />
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm New Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="forgot-password-input"
          />
          <button type="submit" className="forgot-password-button">
            Update Password
          </button>
        </form>
      )}
      {message && <p className="forgot-password-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;