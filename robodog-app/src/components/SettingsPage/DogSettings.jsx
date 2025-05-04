import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DogSettings.css';
import ChangeDogNamePopup from './ChangeDogNamePopup';
import NavBar from '../NavBar/navbar';
import axios from 'axios';

const DogSettings = ({ onBack }) => {
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChangeName = () => {
    setShowNamePopup(true);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('espIP');
    navigate('/connect');
  };

  const handleViewRobotData = () => {
    navigate('/robotData');
  };

  const handleNameSubmit = async (newName) => {
    const ipAddress = localStorage.getItem('espIP');
    
    if (!ipAddress) {
      navigate('/connect');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the API to update the dog name
      const response = await axios.put('https://localhost:44374/api/Dog/UpdateDogName', {
        IpAddress: ipAddress,
        Name: newName
      });
      
      setShowNamePopup(false);
      
      // Navigate back to info page to see the updated name
      navigate('/info');
    } catch (err) {
      console.error('Error updating dog name:', err);
      setError('Failed to update dog name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="robodog-settings-content">
      <div className="robodog-settings-appname">
        <div className="robodog-header-container">
          <div className="robodog-back-button" onClick={onBack}>
            <span className="robodog-back-arrow-dog">‹</span>
          </div>
          <h1 className="robodog-settings-appname-text">RoboDog</h1>
          <div className="robodog-placeholder"></div>
        </div>
        <h2 className="robodog-settings-subtitle-dog">Dog Settings</h2>
      </div>
      
      <div
        onClick={handleChangeName}
        className="robodog-settings-option"
      >
        <span className="robodog-settings-option-text">Change Dog Name</span>
      </div>
      
      <div
        onClick={handleDisconnect}
        className="robodog-settings-option"
      >
        <span className="robodog-settings-option-text">Disconnect</span>
      </div>

      <div
        onClick={handleViewRobotData}
        className="robodog-settings-option"
      >
        <span className="robodog-settings-option-text">Robot's Data</span>
      </div>

      {showNamePopup && (
        <ChangeDogNamePopup 
          onClose={() => setShowNamePopup(false)}
          onSubmit={handleNameSubmit}
          isLoading={isLoading}
        />
      )}
      
      {error && <div className="robodog-error-message">{error}</div>}
    </div>
  );
};

export default DogSettings;