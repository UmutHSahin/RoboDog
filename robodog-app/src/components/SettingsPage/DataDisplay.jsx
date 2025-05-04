import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./DataDisplay.css";
import NavBar from '../NavBar/navbar';

const DataDisplay = () => {
  const navigate = useNavigate();
  const [espIP, setEspIP] = useState("");
  const [showNoIPModal, setShowNoIPModal] = useState(false);
  const [robotData, setRobotData] = useState({
    "GPS Location": "Loading...",
    "Battery": "Loading...",
    "IMU": "Loading...",
    "Pressure": "Loading...",
    "Temperature": "Loading...",
  });

  const handleBack = () => {
    window.history.back();
  };

  const fetchRobotData = async () => {
    if (!espIP) return;
    
    try {

      const response = await fetch(`http://${espIP}/sensor-data`);
      const data = await response.json();
      setRobotData({
        "GPS Location": data.gpsLocation || "Not available",
        "Battery": data.battery || "Not available",
        "IMU": data.imu || "Not available",
        "Pressure": data.pressure || "Not available",
        "Temperature": data.temperature || "Not available",
      });
    } catch (error) {
      console.error("Error fetching data:", error);

      setRobotData(prevData => ({
        ...prevData,
        "System Status": "Connection Error"
      }));
    }
  };

  useEffect(() => {
    const storedIP = localStorage.getItem('espIP');
    
    if (storedIP) {
      setEspIP(storedIP);
    } else {
      setShowNoIPModal(true);
    }
  }, []);

  useEffect(() => {
    if (espIP) {
      fetchRobotData();
      const interval = setInterval(fetchRobotData, 3000);
      return () => clearInterval(interval);
    }
  }, [espIP]);

  const handleNavigateToConnect = () => {
    setShowNoIPModal(false);
    navigate('/connect');
  };

  return (
    <div className="data-page-wrapper">
      <div className="data-content-wrapper">
        <div className="data-main-container">
          <div className="robodog-settings-appname">
            <div className="robodog-header-container">
              <div className="robodog-back-button" onClick={handleBack}></div>
              <h1 className="robodog-settings-appname-text">RoboDog</h1>
              <div className="robodog-placeholder"></div>
            </div>
            <div>
              <div className="robodog-back-button" onClick={handleBack}>
                <span className="robodog-back-arrow-data">‹</span>
              </div>
              <h2 className="robodog-settings-subtitle-data">Robot Data</h2>
            </div>
          </div>
          
          <div className="data-items-container">
            {Object.entries(robotData).map(([key, value]) => (
              <div className="data-single-item" key={key}>
                <span className="data-item-label">{key}</span>
                <span className="data-item-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNoIPModal && (
        <div className="robot-not-found-popup">
          <div className="popup-content">
            <h3>Robot Not Connected</h3>
            <p>You need to configure the robot's IP address to use all features.</p>
            <ul>
              <li>Make sure your RoboDog is powered on</li>
              <li>Connect to the same WiFi network as your RoboDog</li>
              <li>Enter the robot's IP address on the connect page</li>
            </ul>
            <button className="popup-close-button" onClick={handleNavigateToConnect}>
              Go to Connect Page
            </button>
          </div>
        </div>
      )}

      <NavBar currentPage="settings" />
    </div>
  );
};

export default DataDisplay;