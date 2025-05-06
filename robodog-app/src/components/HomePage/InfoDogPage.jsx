import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/navbar';
import DogImg from "../../assets/dogg.png";
import './InfoDogPage.css';
import { IoWifi } from "react-icons/io5";
import { IoIosBatteryFull } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import ChangeDogNamePopup from '../SettingsPage/ChangeDogNamePopup';
import axios from 'axios';   /// Http istekleri için tanımladım

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

      const response = await fetch(`http://${ipAddress}/sensor-data`);  //Esp32 den verileri çekiyor
      const data = await response.json();
      
      let gpsLocation = "Not available";
      if (data.latitude !== undefined && data.longitude !== undefined ) {
        gpsLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude || 0
        };
        // JSON formatında gösterme (isteğe bağlı)
        gpsLocation = JSON.stringify(gpsLocation);
      }

      setRobotData({   //Burada bağlandıktan sorna hangi değerler göüksün o yazıyor eğer değere ulaşılamazsa not available yazacak

        systemStatus: "Connected" ,
        batteryPercentage: data.batteryPercentage || 'Not available',
        gpsLocation: gpsLocation,

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
                                   //köpeğin bilgileri api den alınır
        setIsLoading(true);
        
        const response = await axios.get(`https://localhost:44374/api/Dog/GetDogByIp?ipAddress=${ipAddress}`);
        
        if (response.data.exists) {

          const dog = response.data.dog;

          setDogInfo({

            name: dog.Name,
            model: dog.Model,

          });
        } else {

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
    

    const interval = setInterval(fetchRobotData, 3000);
    

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
      
      if (isNewDog) {    //eğerk köpek yeniyse daha önceden yoksa bu gelir

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

    if (robotData.gpsLocation && robotData.gpsLocation !== 'Loading...' && robotData.gpsLocation !== 'Not available') {  //burada konumu Googlemaps linki yapar

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
                <div className="info-label">Battery: {robotData.batteryPercentage}</div>
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