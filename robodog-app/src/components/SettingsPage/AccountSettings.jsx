// AccountSettings.jsx
import { useState } from 'react';
import './AccountSettings.css';
import ChangePasswordPopup from './ChangePasswordPopup';
import NavBar from '../NavBar/navbar';

const AccountSettings = ({ onBack }) => {
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const handleChangePassword = () => {
    setShowPasswordPopup(true);
  };

  const handleLogout = () => {
    // Logout logic here
    window.location.href = '/';
  };

  const handlePasswordSubmit = (oldPassword, newPassword) => {
    // Submit password change to backend
    console.log('Changing password:', { oldPassword, newPassword });
    setShowPasswordPopup(false);
    // Add API call here
  };

  return (
    <div className="robodog-settings-content">
      <div className="robodog-settings-appname">
        <div className="robodog-header-container">
          <div className="robodog-back-button" onClick={onBack}>
          </div>
          
          <h1 className="robodog-settings-appname-text">RoboDog</h1>
          <div className="robodog-placeholder"></div>
        </div>
            <div>
                <div className="robodog-back-button" onClick={onBack}>
                    <span className="robodog-back-arrow-acc">‹</span>
                </div>
                <h2 className="robodog-settings-subtitle-acc">Account Settings</h2>
            </div>
      </div>
      
      <div
        onClick={handleChangePassword}
        className="robodog-settings-option"
      >
        <span className="robodog-settings-option-text">Change Password</span>
      </div>
      
      <div
        onClick={handleLogout}
        className="robodog-settings-option"
      >
        <span className="robodog-settings-option-text">Logout</span>
      </div>

      {showPasswordPopup && (
        <ChangePasswordPopup 
          onClose={() => setShowPasswordPopup(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
      
    </div>
  );
};

export default AccountSettings;