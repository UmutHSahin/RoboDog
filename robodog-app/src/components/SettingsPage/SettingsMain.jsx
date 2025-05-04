import { useState } from 'react';
import './SettingsMain.css';
import AccountSettings from './AccountSettings';
import DogSettings from './DogSettings';
import NavBar from '../NavBar/navbar';

const SettingsMain = () => {
  const [currentView, setCurrentView] = useState('main');

  const handleAccountClick = () => {
    setCurrentView('account');
  };

  const handleDogClick = () => {
    setCurrentView('dog');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'account':
        return <AccountSettings onBack={handleBackToMain} />;
      case 'dog':
        return <DogSettings onBack={handleBackToMain} />;
      default:
        return (
          <div className="robodog-settings-content">
            <div className="robodog-settings-appname">
              <h1 className="robodog-settings-appname-text">RoboDog</h1>
            </div>
            
            <div
              onClick={handleAccountClick}
              className="robodog-settings-option"
            >
              <span className="robodog-settings-option-text">Account</span>
              <span className="robodog-settings-option-arrow">›</span>
            </div>
            
            <div
              onClick={handleDogClick}
              className="robodog-settings-option"
            >
              <span className="robodog-settings-option-text">Dog</span>
              <span className="robodog-settings-option-arrow">›</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="robodog-settings-container">
      
      {renderContent()}
      
      <NavBar currentPage="settings" />
    </div>
  );
};

export default SettingsMain;