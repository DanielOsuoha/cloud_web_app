import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/verify-email',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setEmailVerified(true);
      setMessage('Email verified. You can now update your password.');
    } catch (error) {
      setError(error.response?.data?.error || 'Email verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/password',
        {
          email,
          currentPassword,
          newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessage('Password updated successfully!');
      
      // Redirect after successful password update
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="update-password-page">
      <div className="update-password-container">
        <h2>Update Your Password</h2>
        
        {!emailVerified ? (
          <form onSubmit={handleVerifyEmail} className="update-password-form">
            <div className="form-group">
              <label>Your Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="email-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="verify-button" 
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              
              <button 
                type="button"
                className="cancel-button"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="update-password-form">
            <div className="form-group">
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="password-input"
              />
            </div>
            
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                className="password-input"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="password-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="update-button" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              
              <button 
                type="button"
                className="cancel-button"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;