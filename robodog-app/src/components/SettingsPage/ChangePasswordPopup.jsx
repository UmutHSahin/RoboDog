import { useState } from 'react';
import './Popups.css';

const ChangePasswordPopup = ({ onClose, userEmail }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('https://localhost:44374/api/Password/ChangePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          oldPassword: oldPassword,
          newPassword: newPassword
        }),
        credentials: 'include' 
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        try {
          const errorData = responseText ? JSON.parse(responseText) : {};
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (e) {
          throw new Error(responseText || `HTTP error! status: ${response.status}`);
        }
      }
      
      const data = responseText ? JSON.parse(responseText) : {};
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="robodog-popup-overlay">
      <div className="robodog-popup">
        <h2 className="robodog-popup-title">Change Password</h2>
        
        {success ? (
          <div className="robodog-popup-success">
            Password changed successfully!
          </div>
        ) : (
          <>
            {error && <div className="robodog-popup-error">{error}</div>}
            
            <div className="robodog-popup-field">
              <label>Current Password</label>
              <div className="password-input-container">
                <input 
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <span 
                  className="password-toggle-icon" 
                  onClick={toggleOldPasswordVisibility}
                >
                  {showOldPassword ? "Show" : "Hide"}
                </span>
              </div>
            </div>
            
            <div className="robodog-popup-field">
              <label>New Password</label>
              <div className="password-input-container">
                <input 
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <span 
                  className="password-toggle-icon" 
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? "Show" : "Hide"}
                </span>
              </div>
            </div>
            
            <div className="robodog-popup-field">
              <label>Confirm New Password</label>
              <div className="password-input-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <span 
                  className="password-toggle-icon" 
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "Show" : "Hide"}
                </span>
              </div>
            </div>
            
            <div className="robodog-popup-buttons">
              <button 
                className="robodog-popup-cancel" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="robodog-popup-confirm" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordPopup;