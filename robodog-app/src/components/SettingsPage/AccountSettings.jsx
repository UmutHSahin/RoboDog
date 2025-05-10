// AccountSettings.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AccountSettings.css';
import ChangePasswordPopup from './ChangePasswordPopup';
import NavBar from '../NavBar/navbar';

const AccountSettings = ({ onBack }) => {
  const navigate = useNavigate();

  // Removed showPasswordPopup state since we'll navigate instead

  const handleChangePassword = () => {

    navigate('/changePassword');


  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="robodog-settings-content">
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
      
      {/* Removed the popup component from here */}
    </div>
    
  );
  return (
    <div className="robodog-settings-container">
      
      {renderContent()}
      
      <NavBar currentPage="settings" />
    </div>
  );
};

export default AccountSettings;