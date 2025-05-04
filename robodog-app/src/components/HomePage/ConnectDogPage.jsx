import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/navbar';
import './ConnectDogPage.css';

const ConnectDogPage = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please enter an IP address');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedIP = localStorage.getItem('espIP');
    
    if (storedIP) {
      navigate('/info');
    }
  }, [navigate]);
  
  const isValidIP = (ip) => {
    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(regex);
    
    if (!match) return false;
    
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i], 10);
      if (octet < 0 || octet > 255) return false;
    }
    
    return true;
  };

  const handleConnect = async () => {
    if (ipAddress.trim() === '') {
      setErrorMessage('Please enter an IP address');
      setShowError(true);
      return;
    }
    
    if (!isValidIP(ipAddress)) {
      setErrorMessage('Invalid IP address format. Please enter a valid IP (e.g., 192.168.1.1)');
      setShowError(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Store the IP in localStorage for future use
      localStorage.setItem('espIP', ipAddress);
      
      // Navigate to the info page
      navigate('/info');
    } catch (error) {
      console.error('Error connecting to dog:', error);
      setErrorMessage('Error connecting to dog. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="connect_data_container">
      <div className="connect-page-header">
        <h1>RoboDog</h1>
      </div>
      
      <div className="connect-content">
        <h2>Connect Your Dog</h2>
        
        <div className="ip-input-container">
          <input
            type="text"
            placeholder="Enter ESP32 IP address"
            value={ipAddress}
            onChange={(e) => {
              setIpAddress(e.target.value);
              setShowError(false);
            }}
            className="ip-input"
          />
          {showError && <p className="error-message">{errorMessage}</p>}
        </div>
        
        <button 
          onClick={handleConnect} 
          className="connect-button"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Go to Connect'}
        </button>
      </div>
      
      <NavBar currentPage="home" />
    </div>
  );
};

export default ConnectDogPage;