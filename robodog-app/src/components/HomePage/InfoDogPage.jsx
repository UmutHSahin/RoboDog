import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/navbar';
import DogImg from "../../assets/dogg.png";
import './InfoDogPage.css';
import { IoWifi } from "react-icons/io5";
import { IoIosBatteryFull } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import ChangeDogNamePopup from '../SettingsPage/ChangeDogNamePopup';
import axios from 'axios';

const InfoDogPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dogInfo, setDogInfo] = useState({
    name: 'Loading...',
    model: 'RoboDog-U001',
  });
  const [robotData, setRobotData] = useState({
    systemStatus: 'Loading...',
    battery: 'Loading...',
    gpsLocation: 'Loading...',
  });
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [isNewDog, setIsNewDog] = useState(false);
  
  const navigate = useNavigate();
  
  const fetchRobotData = async () => {
    const ipAddress = localStorage.getItem('espIP');
    
    if (!ipAddress) {
      return;
    }
    
    try {
      // Replace with your ESP32-CAM IP address format
      const response = await fetch(`http://${ipAddress}/sensor-data`);
      const data = await response.json();
      
      setRobotData({
        systemStatus: data.systemStatus || 'Not available',
        battery: data.battery || 'Not available',
        gpsLocation: data.gpsLocation || 'Not available',
      });
    } catch (error) {
      console.error("Error fetching robot data:", error);
      setRobotData(prevData => ({
        ...prevData,
        systemStatus: 'Connection Error'
      }));
    }
  };
  
  useEffect(() => {
    const fetchDogInfo = async () => {
      const ipAddress = localStorage.getItem('espIP');
      
      if (!ipAddress) {
        navigate('/connect');
        return;
      }
      
      try {
        setIsLoading(true);
        
        const response = await axios.get(`https://localhost:44374/api/Dog/GetDogByIp?ipAddress=${ipAddress}`);
        
        if (response.data.exists) {
          // Dog exists in database, use the info
          const dog = response.data.dog;
          setDogInfo({
            name: dog.Name,
            model: dog.Model,
          });
        } else {
          // Dog doesn't exist, show popup to add new dog
          setIsNewDog(true);
          setShowNamePopup(true);
        }
      } catch (err) {
        console.error('Error fetching dog info:', err);
        setError('Failed to fetch dog information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDogInfo();
    fetchRobotData();
    
    // Set interval to refresh robot data every 3 seconds
    const interval = setInterval(fetchRobotData, 3000);
    
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [navigate]);
  
  const handleNameSubmit = async (newName) => {
    const ipAddress = localStorage.getItem('espIP');
    
    if (!ipAddress) {
      navigate('/connect');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isNewDog) {
        // Add new dog
        const response = await axios.post('https://localhost:44374/api/Dog/AddDog', {
          IpAddress: ipAddress,
          Name: newName
        });
        
        const dog = response.data;
        setDogInfo({
          name: dog.Name,
          model: dog.Model,
        });
      } else {
        // Update existing dog name
        const response = await axios.put('https://localhost:44374/api/Dog/UpdateDogName', {
          IpAddress: ipAddress,
          Name: newName
        });
        
        const dog = response.data;
        setDogInfo(prevInfo => ({
          ...prevInfo,
          name: dog.Name
        }));
      }
      
      setShowNamePopup(false);
    } catch (err) {
      console.error('Error updating dog name:', err);
      setError('Failed to update dog name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClosePopup = () => {
    if (isNewDog) {
      // If it's a new dog and user cancels, go back to connect page
      localStorage.removeItem('espIP');
      navigate('/connect');
    } else {
      // Just close the popup for existing dogs
      setShowNamePopup(false);
    }
  };
  
  const openGoogleMaps = () => {
    // Only open if we have actual coordinates
    if (robotData.gpsLocation && robotData.gpsLocation !== 'Loading...' && robotData.gpsLocation !== 'Not available') {
      // Assuming gpsLocation is in format "latitude,longitude"
      window.open(`https://www.google.com/maps?q=${robotData.gpsLocation}`, '_blank');
    }
  };
  
  if (error) {
    return (
      <div className="info_data_container">
        <div className="info-page-header">
          <h1>RoboDog</h1>
        </div>
        <div className="info-content error-content">
          <p>{error}</p>
          <button onClick={() => navigate('/connect')} className="connect-button">
            Back to Connect
          </button>
        </div>
        <NavBar currentPage="home" />
      </div>
    );
  }

  return (
    <div className="info_data_container">
      <div className="info-page-header">
        <h1>RoboDog</h1>
      </div>
      
      <div className="info-content">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <div className="dog-profile">
              <div className="dog-image">
                <img src={DogImg} alt="RoboDog" />
              </div>
              <div className="dog-details">
                <h2>{dogInfo.name}</h2>
                <p>{dogInfo.model}</p>
              </div>
            </div>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-label">System Status: {robotData.systemStatus}</div>
                <div className="wifi-icon"><IoWifi /></div>
              </div>
              <div className="info-card">
                <div className="info-label">Battery: {robotData.battery}</div>
                <div className="battery-icon"><IoIosBatteryFull /></div>
              </div>
              <div 
                className="info-card clickable-location" 
                onClick={openGoogleMaps}
                title="Click to open in Google Maps"
              >
                <div className="info-label">GPS Location: {robotData.gpsLocation}</div>
                <div className="location-icon"><IoLocationSharp /></div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {showNamePopup && (
        <ChangeDogNamePopup 
          onClose={handleClosePopup}
          onSubmit={handleNameSubmit}
          isNewDog={isNewDog}
        />
      )}
      
      <NavBar currentPage="home" />
    </div>
  );
};

export default InfoDogPage;