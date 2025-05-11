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
    batteryPercentage: 'Loading...',
    gpsLocation: 'Loading...',
    systemId: null,
  });

  const [showNamePopup, setShowNamePopup] = useState(false);
  const [isNewDog, setIsNewDog] = useState(false);
  
  const navigate = useNavigate();
  
  // Fetch sensor data from ESP32
  const fetchRobotData = async () => {
    const ipAddress = localStorage.getItem('espIP');
    
    if (!ipAddress) {
      return;
    }
    
    try {
      // Get sensor data from ESP32
      const response = await fetch(`http://${ipAddress}/sensor-data`);
      const data = await response.json();
      
      let gpsLocation = "Not available";
      if (data.latitude !== undefined && data.longitude !== undefined) {
        gpsLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude || 0
        };
        // Convert to JSON string for display
        gpsLocation = JSON.stringify(gpsLocation);
      }

      setRobotData({
        systemStatus: "Connected",
        batteryPercentage: data.batteryPercentage || 'Not available',
        gpsLocation: gpsLocation,
        systemId: data.ID || null, // Store the system ID (6064)
      });
      
      // If this is first time fetching data and we got the system ID
      if (data.ID && isNewDog === false && !dogInfo.id) {
        checkDogInDatabase(ipAddress, data.ID);
      }
    } catch (error) {
      console.error("Error fetching robot data:", error);
      setRobotData(prevData => ({
        ...prevData,
        systemStatus: 'Connection Error'
      }));
    }
  };
  
  // Check if the dog with this system ID exists in the database
  const checkDogInDatabase = async (ipAddress, systemId) => {
    try {
      setIsLoading(true);
      
      const response = await axios.get(`https://localhost:44374/api/Dog/GetDogByIp?ipAddress=${ipAddress}`);
      
      if (response.data.exists) {
        // Dog exists in database
        const dog = response.data.dog;
        setDogInfo({
          id: dog.Id,
          name: dog.Name,
          model: dog.Model,
          systemId: dog.DogSystemId
        });
      } else {
        // Dog with this system ID doesn't exist in database
        // Show name popup to register it
        setIsNewDog(true);
        setShowNamePopup(true);
      }
    } catch (err) {
      console.error('Error checking dog in database:', err);
      setError('Failed to fetch dog information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const ipAddress = localStorage.getItem('espIP');
    
    if (!ipAddress) {
      navigate('/connect');
      return;
    }
    
    fetchRobotData();
       
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
        // Add new dog with the system ID
        const response = await axios.post('https://localhost:44374/api/Dog/AddDog', {
          IpAddress: ipAddress,
          Name: newName,
          DogSystemId: robotData.systemId // Important: Include the system ID (6064)
        });
        
        const dog = response.data;
        setDogInfo({
          id: dog.Id,
          name: dog.Name,
          model: dog.Model,
          systemId: dog.DogSystemId
        });
      } else {
        // Update existing dog's name
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
      localStorage.removeItem('espIP');
      navigate('/connect');
    } else {
      setShowNamePopup(false);
    }
  };
  
const openGoogleMaps = () => {
  if (robotData.gpsLocation && robotData.gpsLocation !== 'Loading...' && robotData.gpsLocation !== 'Not available') {
    try {
      const locationObj = JSON.parse(robotData.gpsLocation);
      if (locationObj.latitude && locationObj.longitude) {
        const url = `https://www.google.com/maps?q=${locationObj.latitude},${locationObj.longitude}`;
        window.open(url, '_blank', 'noopener,noreferrer'); // Added security attributes
      } else {
        alert('Invalid GPS coordinates. Please try again later.');
      }
    } catch (e) {
      console.error('Error parsing location data:', e);
      alert('Unable to open Google Maps. Location data is invalid.');
    }
  } else {
    alert('GPS location is not available.');
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
          <div className="loading-spinner"></div>
        ) : (
          <>
            <div className="dog-profile">
              <div className="dog-image">
                <img src={DogImg} alt="RoboDog" />
              </div>
              <div className="dog-details">
                <h2>{dogInfo.name}</h2>
                <p>{dogInfo.model}</p>
                {robotData.systemId && (
                  <div className="system-id">ID: {robotData.systemId}</div>
                )}
              </div>
            </div>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-label">System Status: {robotData.systemStatus}</div>
                <div className="wifi-icon"><IoWifi /></div>
              </div>
              <div className="info-card">
                <div className="info-label">Battery: {robotData.batteryPercentage}</div>
                <div className="battery-icon"><IoIosBatteryFull /></div>
              </div>
              <div 
                className="info-card clickable-location" 
                onClick={openGoogleMaps}
                title="Click to open in Google Maps"
              >
                <div className="info-label">GPS Location: {
                  typeof robotData.gpsLocation === 'string' && 
                  robotData.gpsLocation !== 'Loading...' && 
                  robotData.gpsLocation !== 'Not available' ? 
                    'Available (Click to View)' : robotData.gpsLocation
                }</div>
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