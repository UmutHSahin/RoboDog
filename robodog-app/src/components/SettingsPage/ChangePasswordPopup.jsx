import { useState, HashRouter as Router, Route, Routes  } from 'react';
import axios from 'axios';
import './ChangePasswordPopup.css';
import NavBar from '../NavBar/navbar';


const ChangePasswordPopup = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const baseUrl = window.location.origin;

      const response = await axios.post('https://localhost:44374/api/Password/ForgotPassword', {
        email: email,
        baseUrl: baseUrl,
      });

      if (response.data.success) {
        setMessage('Reset instructions sent. Please check your email.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.Message) {
          setError(err.response.data.Message);
        } else if (err.response.data.ExceptionMessage) {
          setError(err.response.data.ExceptionMessage);
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setMessage('Forgot Password Link Sent To Your Mail Please Check Your Mail');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pwd-settings-content">
            <div className="robodog-settings-appname">
        <div className="robodog-header-container">
          <div className="robodog-back-button" onClick={onBack}></div>
          <h1 className="robodog-settings-appname-text">RoboDog</h1>
          <div className="robodog-placeholder"></div>
        </div>

        <div>
          <div className="robodog-back-button" onClick={onBack}>
            <span className="robodog-back-arrow-acc">‹</span>
          </div>
          <h2 className="robodog-settings-subtitle-acc">Change Password</h2>
        </div>
      </div>
 

      <div className="pwd-form-container">
        <form onSubmit={handleSubmit} className="pwd-form">
          <p className="pwd-instruction-text">
            Enter your email address below and we will send you a
            link to reset your password.
          </p>
          
          <div className="pwd-form-group">
            <label className="pwd-label" htmlFor="email">
              Email
            </label>
            <input
              className="pwd-input"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="pwd-error-message">{error}</div>
          )}
          {message && (
            <div className="pwd-success-message">{message}</div>
          )}

          <button
            type="submit"
            className="pwd-submit-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
      <NavBar currentPage="settings" />

    </div>
  );
};

export default ChangePasswordPopup;