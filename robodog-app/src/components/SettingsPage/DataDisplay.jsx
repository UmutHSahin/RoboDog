import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DataDisplay.css";
import NavBar from "../NavBar/navbar";
import axios from 'axios';

const DataDisplay = () => {
  const navigate = useNavigate();
  const [espIP, setEspIP] = useState("");
  const [showNoIPModal, setShowNoIPModal] = useState(false);
  const [sensorData, setSensorData] = useState({
    gpsLocation: "Loading...",
    battery: "Loading...",
    imu: "Loading...",
    pressure: "Loading...",
    temperature: "Loading...",
    systemStatus: "Connecting...",
  });

  // Handle back button
  const handleBack = () => {
    window.history.back();
  };

  const fetchRobotData = async () => {
    const ipAddress = localStorage.getItem("espIP");
    if (!ipAddress) {
      navigate('/connect');
      return;
    }

    try {
      const response = await axios.get(`http://${ipAddress}/sensor-data`);
      const data = response.data;

      setSensorData({
        systemStatus: "Connected",
        gpsLocation: data.gpsLocation || "Not available",
        battery: data.battery || "Not available",
        imu: data.imu || "Not available",
        pressure: data.pressure || "Not available",
        temperature: data.temperature || "Not available",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setSensorData(prev => ({
        ...prev,
        systemStatus: "Connection Error",
      }));
    }
  };

  useEffect(() => {
    const storedIP = localStorage.getItem("espIP");
    if (storedIP) {
      setEspIP(storedIP);
    } else {
      setShowNoIPModal(true);
    }
  }, []);

  useEffect(() => {
    if (espIP) {
      fetchRobotData(); // İlk veri çekme
      const interval = setInterval(fetchRobotData, 3000); // 3 saniyede bir çek
      return () => clearInterval(interval); // Unmount durumunda temizle
    }
  }, [espIP]);

  const handleNavigateToConnect = () => {
    setShowNoIPModal(false);
    navigate("/connect");
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
            <div className="data-single-item"><strong>System Status:</strong> {sensorData.systemStatus}</div>
            <div className="data-single-item"><strong>GPS Location:</strong> {sensorData.gpsLocation}</div>
            <div className="data-single-item"><strong>Battery:</strong> {sensorData.battery}</div>
            <div className="data-single-item"><strong>IMU:</strong> {sensorData.imu}</div>
            <div className="data-single-item"><strong>Pressure:</strong> {sensorData.pressure}</div>
            <div className="data-single-item"><strong>Temperature:</strong> {sensorData.temperature} °C</div>
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
