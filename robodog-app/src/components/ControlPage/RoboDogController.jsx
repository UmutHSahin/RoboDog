import React, { useState, useEffect, useRef } from 'react';   //useRef --- DOM elemanlarına veya Değişkenlere referans tutmak için kullanılıyor
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCog } from 'react-icons/fa';
import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { BsLightningFill, BsMic, BsExclamationTriangle, BsPower, BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { FaDog, FaPaw } from 'react-icons/fa';
import { GiSittingDog, GiDogHouse } from 'react-icons/gi';
import { GiDogBowl } from 'react-icons/gi';


import './RoboDogController.css';
import NavBar from '../../components/NavBar/navbar'; 

const RoboDogController = () => {
  const navigate = useNavigate();
  const [cameraConnected, setCameraConnected] = useState(true); //Kamera bağlantı durumunu tutar
  const [cameraEnabled, setCameraEnabled] = useState(true); ///Kamera açık/kapalı durumunu tutar
  const [selectedSpeed, setSelectedSpeed] = useState('medium');  //Robotun huz sevyesini tutar
  const [powerOn, setPowerOn] = useState(true);// rOBOTTA güç varmı yokmu ona bakar
  const [espIP, setEspIP] = useState(""); //Robotun IP sini tutar
  const [showNoIPModal, setShowNoIPModal] = useState(false); //Ip girilmemişse gösterilecek olan şeyleri tutar
  const [micActive, setMicActive] = useState(false);   // mikdorofn açıkmı değilmi onu tutar
  const [listeningText, setListeningText] = useState(""); //mikrofon dinlerken dinlenilen textleri tutuar

  const wsCamera = useRef(null); //Kamera WebSocket bağlantısını tutar
  const cameraImageRef = useRef(null);
  const recognitionRef = useRef(null);  //Konuşma tanıma (SpeechRecognition) nesnesini tutar

  useEffect(() => {   //Sayfa yüklendiğinde Ip varmı oan bakar yoksa  setShowNoIPModal döndürür

    const storedIP = localStorage.getItem('espIP');
    
    if (storedIP) {

      setEspIP(storedIP);


    } else {

      setShowNoIPModal(true);
    }

    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {  // konuşma tanıma desteği ile alakalı ama şuan çalışmıyor sonra bakıcam

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {

        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        setListeningText(`Heard: ${transcript}`);
        
        // Function to simulate button click
        const simulateButtonClick = (selector) => {
          const button = document.querySelector(selector);
          if (button && !button.disabled) {
            button.click();
          }
        };
        
        // Match with console.log messages exactly
        if (transcript.includes('moving forward')) {
          simulateButtonClick('.direction-btn.up-btn');
        } else if (transcript.includes('moving backward')) {
          simulateButtonClick('.direction-btn.down-btn');
        } else if (transcript.includes('moving left')) {
          simulateButtonClick('.direction-btn.left-btn');
        } else if (transcript.includes('moving right')) {
          simulateButtonClick('.direction-btn.right-btn');
        } else if (transcript.includes('light toggled')) {
          simulateButtonClick('.action-btn.lightning-btn');
        } else if (transcript.includes('warning triggered')) {
          simulateButtonClick('.warning-btn');
        } else if (transcript.includes('speed set to fast')) {
          simulateButtonClick('.speed-btn:nth-child(1)');
        } else if (transcript.includes('speed set to medium')) {
          simulateButtonClick('.speed-btn:nth-child(2)');
        } else if (transcript.includes('speed set to slow')) {
          simulateButtonClick('.speed-btn:nth-child(3)');
        } else if (transcript.includes('power on') || transcript.includes('power off')) {
          simulateButtonClick('.power-btn');
        } else if (transcript.includes('sending sit command')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(1)');
        } else if (transcript.includes('sending stand command')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(2)');
        } else if (transcript.includes('sending bend command')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(3)');
        } else if (transcript.includes('camera off') || transcript.includes('turn off camera')) {
          if (cameraEnabled) simulateButtonClick('.camera-btn');
        } else if (transcript.includes('camera on') || transcript.includes('turn on camera')) {
          if (!cameraEnabled) simulateButtonClick('.camera-btn');
        } else if (transcript.includes('stop listening') || transcript.includes('turn off microphone')) {
          simulateButtonClick('.action-btn.mic-btn');
        }
        // Easier-to-say alternatives
        else if (transcript.includes('forward')) {
          simulateButtonClick('.direction-btn.up-btn');
        } else if (transcript.includes('backward') || transcript.includes('back')) {
          simulateButtonClick('.direction-btn.down-btn');
        } else if (transcript.includes('left')) {
          simulateButtonClick('.direction-btn.left-btn');
        } else if (transcript.includes('right')) {
          simulateButtonClick('.direction-btn.right-btn');
        } else if (transcript.includes('light')) {
          simulateButtonClick('.action-btn.lightning-btn');
        } else if (transcript.includes('warning') || transcript.includes('alarm')) {
          simulateButtonClick('.warning-btn');
        } else if (transcript.includes('fast')) {
          simulateButtonClick('.speed-btn:nth-child(1)');
        } else if (transcript.includes('medium')) {
          simulateButtonClick('.speed-btn:nth-child(2)');
        } else if (transcript.includes('slow')) {
          simulateButtonClick('.speed-btn:nth-child(3)');
        } else if (transcript.includes('sit')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(1)');
        } else if (transcript.includes('stand')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(2)');
        } else if (transcript.includes('bend')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(3)');
        }
        
        setTimeout(() => {
          setListeningText("");
        }, 3000);
      };

      recognitionRef.current.onerror = (event) => {

        console.error('Speech recognition error', event.error);

        if (event.error === 'no-speech' || event.error === 'aborted') {
          
          if (micActive && recognitionRef.current) {

            try {
              // Short delay before restarting to avoid immediate restart issues
              setTimeout(() => {
                if (micActive) {
                  recognitionRef.current.start();
                }
              }, 300);

            } catch (e) {

              console.log('Recognition already started');
            }
          }
        } else {

          setMicActive(false);
          setListeningText("Error: " + event.error);
          setTimeout(() => {
            setListeningText("");
          }, 3000);

        }
      };

      recognitionRef.current.onend = () => {
        
        if (micActive && recognitionRef.current) {
          try {
            // Small delay before restarting
            setTimeout(() => {
              if (micActive) {
                recognitionRef.current.start();
              }
            }, 300);
          } catch (e) {
            console.log('Recognition already started');
            
            // Try again after a longer delay if there was an error
            setTimeout(() => {
              if (micActive && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (err) {
                  console.log('Still could not restart recognition');
                }
              }
            }, 1000);
          }
        }
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);



  useEffect(() => {


    const connectWebSockets = () => {

      if (!espIP || !cameraEnabled) return; ///Kamera WebSocket bağlantısını kuruyor
      
      wsCamera.current = new WebSocket(`ws://${espIP}/Camera`);
      wsCamera.current.binaryType = 'blob';
      
      wsCamera.current.onopen = () => {

        console.log("Camera WebSocket connected");
        setCameraConnected(true);

      };

      wsCamera.current.onclose = () => {

        console.log("Camera WebSocket disconnected");
        setCameraConnected(false);

        if (cameraEnabled) {
          setTimeout(connectWebSockets, 2000);
        }
      };
      
      wsCamera.current.onmessage = (event) => {

        if (cameraImageRef.current && event.data instanceof Blob) {

          //WebSocket'ten gelen kamera görüntüsünü <img> elemanına yerleştirir.

          cameraImageRef.current.src = URL.createObjectURL(event.data);
          setCameraConnected(true);

        }
      };
    };
    
    if (powerOn && espIP && cameraEnabled) {

      connectWebSockets();

    }
    
    return () => {

      if (wsCamera.current) wsCamera.current.close();

    };
  }, [powerOn, espIP, cameraEnabled]);

  const handleDisconnect = () => {

    localStorage.removeItem('espIP');
    navigate('/connect');

  };

  const handleCameraToggle = () => {

    if (!powerOn) return;
    const newCameraState = !cameraEnabled;
    
    if (!newCameraState && wsCamera.current) {

      wsCamera.current.close();
      setCameraConnected(false);

    }
    
    setCameraEnabled(newCameraState);
    
    if (newCameraState && espIP) {

      setTimeout(() => {

        if (wsCamera.current) wsCamera.current.close();
        wsCamera.current = null;
        
        wsCamera.current = new WebSocket(`ws://${espIP}/Camera`);
        wsCamera.current.binaryType = 'blob';
        wsCamera.current.onopen = () => {

          console.log("Camera WebSocket reconnected");
          setCameraConnected(true);

        };
        wsCamera.current.onmessage = (event) => {

          if (cameraImageRef.current && event.data instanceof Blob) {

            cameraImageRef.current.src = URL.createObjectURL(event.data);
          }
        };
      }, 500);
    }
  };

  const handleForward = () => {

    if (!powerOn || !espIP) return;

    console.log("Moving forward");
    
    fetch(`http://${espIP}/forward`)

      .then(response => {

        if (response.ok) {

          console.log("Forward command sent successfully");

        } else {

          console.error("Failed to send forward command");
        }
      })
      .catch(error => {

        console.error("Error sending forward command:", error);
      });
  };
  
  const handleBack = () => {

    if (!powerOn || !espIP) return;
    console.log("Moving backward");
    
    fetch(`http://${espIP}/back`)
      .then(response => {

        if (response.ok) {

          console.log("Back command sent successfully");
        } else {

          console.error("Failed to send back command");
        }
      })
      .catch(error => {

        console.error("Error sending back command:", error);
      });
  };
  
  const handleLeft = () => {

    if (!powerOn || !espIP) return;
    console.log("Moving left");
    
    fetch(`http://${espIP}/left`)

      .then(response => {

        if (response.ok) {

          console.log("Left command sent successfully");
        } else {

          console.error("Failed to send left command");
        }
      })
      .catch(error => {

        console.error("Error sending left command:", error);
      });
  };
  
  const handleRight = () => {

    if (!powerOn || !espIP) return;
    console.log("Moving right");
    
    fetch(`http://${espIP}/right`)

      .then(response => {

        if (response.ok) {

          console.log("Right command sent successfully");
        } else {

          console.error("Failed to send right command");
        }
      })
      .catch(error => {

        console.error("Error sending right command:", error);
      });
  };

  const handleSpeedClick = (speed) => {

    if (!powerOn || !espIP) return;
    setSelectedSpeed(speed);
    console.log(`Speed set to ${speed}`);
    
    const speedValue = speed === 'slow' ? 50 : speed === 'medium' ? 150 : 255;
    
    fetch(`http://${espIP}/message?text=speed:${speedValue}`)

      .then(response => {

        if (response.ok) {

          console.log(`Speed ${speed} (${speedValue}) sent successfully`);
        } else {

          console.error("Failed to send speed command");
        }
      })
      .catch(error => {
        console.error("Error sending speed command:", error);
      });
  };

  const handlePowerToggle = () => {

    const newPowerState = !powerOn;  
    setPowerOn(newPowerState);
    console.log(`Power ${newPowerState ? 'on' : 'off'}`);
    
    if (!newPowerState) {

      if (wsCamera.current) wsCamera.current.close();
      setCameraConnected(false);
      
      
      if (micActive) {

        try {
          recognitionRef.current?.abort();
          setMicActive(false);
        } catch (e) {
          console.error("Error stopping speech recognition:", e);
        }
      }
    }
  };

  const handleLightToggle = () => {
    if (!powerOn || !espIP) return;
    console.log("Light toggled");
    
    fetch(`http://${espIP}/message?text=light:toggle`)
      .then(response => {
        if (response.ok) {
          console.log("Light toggle command sent successfully");
        } else {
          console.error("Failed to send light toggle command");
        }
      })
      .catch(error => {
        console.error("Error sending light toggle command:", error);
      });
  };

  const handleWarningToggle = () => {
    if (!powerOn || !espIP) return;
    console.log("Warning triggered");
    
    fetch(`http://${espIP}/message?text=warning:trigger`)
      .then(response => {
        if (response.ok) {
          console.log("Warning trigger command sent successfully");
        } else {
          console.error("Failed to send warning trigger command");
        }
      })
      .catch(error => {
        console.error("Error sending warning trigger command:", error);
      });
  };


  const handleSit = () => {
    if (!powerOn || !espIP) return;
    console.log("Sending sit command");
  
    fetch(`http://${espIP}/message?text=sit`)
      .then(response => {
        if (response.ok) {
          console.log("Sit command sent successfully");
        } else {
          console.error("Failed to send sit command");
        }
      })
      .catch(error => {
        console.error("Error sending sit command:", error);
      });
  };
  
  const handleStand = () => {
    if (!powerOn || !espIP) return;
    console.log("Sending stand command");
  
    fetch(`http://${espIP}/message?text=stand`)
      .then(response => {
        if (response.ok) {
          console.log("Stand command sent successfully");
        } else {
          console.error("Failed to send stand command");
        }
      })
      .catch(error => {
        console.error("Error sending stand command:", error);
      });
  };
  
  const handleBend = () => {
    if (!powerOn || !espIP) return;
    console.log("Sending bend command");
  
    fetch(`http://${espIP}/message?text=bend`)
      .then(response => {
        if (response.ok) {
          console.log("Bend command sent successfully");
        } else {
          console.error("Failed to send bend command");
        }
      })
      .catch(error => {
        console.error("Error sending bend command:", error);
      });
  };

  const handleMicToggle = () => {
    if (!powerOn || !espIP) return;
    
    const newMicState = !micActive;
    setMicActive(newMicState);
    console.log(`Microphone ${newMicState ? 'activated' : 'deactivated'}`);
    
    if (newMicState) {
      
      setListeningText("Listening for commands...");
      if (recognitionRef.current) {
        try {
          // Stop any existing recognition first
          try {
            recognitionRef.current.abort();
          } catch (e) {
            // Ignore abort errors
          }
          
          // Small delay before starting
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 200);
        } catch (e) {
          console.error("Error starting speech recognition:", e);
        }
      }
    } else {
      
      setListeningText("");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Error stopping speech recognition:", e);
        }
      }
    }
    
    
    fetch(`http://${espIP}/message?text=mic:toggle`)
      .then(response => {
        if (response.ok) {
          console.log("Mic toggle command sent successfully");
        } else {
          console.error("Failed to send mic toggle command");
        }
      })
      .catch(error => {
        console.error("Error sending mic toggle command:", error);
      });
  };

  const handleNavigateToConnect = () => {
    setShowNoIPModal(false);
    navigate('/connect');
  };

  return (
    <div className="robodog-app">
      <div className="contorol-page-header">
        <h1 className='control-title'>RoboDog</h1>
      </div>

      <main className="main-content">
        <div className="camera-feed" style={{   
          backgroundImage: cameraConnected && cameraEnabled ? 'url()' : 'none',
          backgroundColor: cameraConnected && cameraEnabled ? 'transparent' : 'white',
        }}>
          {espIP && cameraConnected && cameraEnabled ? (
            <>
              <img ref={cameraImageRef} alt="Robot Camera Feed" style={{ width: '100%', height: '100%' }} />
              <button className="disconnect-camera-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
              {micActive && (
                <div className="listening-indicator">
                  {listeningText || "Listening..."}
                </div>
              )}
            </>
          ) : (
            <div className="camera-error">
              {!espIP ? (
                <p>No IP address configured</p>
              ) : !cameraEnabled ? (
                <p>Camera is turned off</p>
              ) : (
                <p>Camera cannot be reached at the moment</p>
              )}
              {micActive && (
                <div className="listening-indicator">
                  {listeningText || "Listening..."}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="controls-overlay">
          <div className="direction-controls">
            <button 
              onClick={handleForward}  
              disabled={!powerOn}
              className="direction-btn up-btn"
            >
              <RiArrowUpSLine />
            </button>
            <div className="horizontal-controls">
              <button 
                onClick={handleLeft} 
                disabled={!powerOn}
                className="direction-btn left-btn"
                style={{ marginRight: "20px"}}
              >
                <RiArrowLeftSLine />
              </button>
              <button 
                onClick={handleRight} 
                disabled={!powerOn}
                className="direction-btn right-btn"
                style={{ marginLeft: "20px"}}
              >
                <RiArrowRightSLine />
              </button>
            </div>
            <button 
              onClick={handleBack} 
              disabled={!powerOn}
              className="direction-btn down-btn"
            >
              <RiArrowDownSLine />
            </button>
          </div>

          <div className="middle-controls">
            <button 
              className="action-btn lightning-btn"
              onClick={handleLightToggle} 
              disabled={!powerOn}
            >
              <BsLightningFill />
            </button>
            <button 
              className="warning-btn"
              onClick={handleWarningToggle} 
              disabled={!powerOn}
            >
              <BsExclamationTriangle />
            </button>
            <button 
              className={`action-btn mic-btn ${micActive ? 'active' : ''}`}
              onClick={handleMicToggle} 
              disabled={!powerOn}
            >
              <BsMic />
            </button>
          </div>

          <div className="right-controls">
            <div className="speed-controls">
              <button 
                className={`speed-btn ${selectedSpeed === 'fast' ? 'active' : ''}`}
                onClick={() => handleSpeedClick('fast')}
                disabled={!powerOn}
              >
                Fast
              </button>
              <button 
                className={`speed-btn ${selectedSpeed === 'medium' ? 'active' : ''}`}
                onClick={() => handleSpeedClick('medium')}
                disabled={!powerOn}
              >
                Medium
              </button>
              <button 
                className={`speed-btn ${selectedSpeed === 'slow' ? 'active' : ''}`}
                onClick={() => handleSpeedClick('slow')}
                disabled={!powerOn}
              >
                Slow
              </button>
                <div className='warning-butttons'>
                    <button 
                        className="warning-btn"
                        onClick={handleSit} 
                        disabled={!powerOn}
                      >
                      <FaDog />
                    </button>           
                    <button 
                        className="warning-btn"
                        onClick={handleStand} 
                        disabled={!powerOn}
                      >
                        <GiSittingDog />
                      </button>
                      <button 
                        className="warning-btn"
                        onClick={handleBend} 
                        disabled={!powerOn}
                      >
                        <GiDogBowl />
                      </button>
                </div>
            </div>
          </div>

          <div className="power-control">
            <button 
              className={`power-btn ${powerOn ? 'on' : 'off'}`}
              onClick={handlePowerToggle}
            >
              <BsPower />
            </button>
            <button 
                className="camera-btn"
                onClick={handleCameraToggle} 
                disabled={!powerOn}
              >
                {cameraEnabled ? <BsCameraVideo /> : <BsCameraVideoOff />}
              </button>
          </div>
        </div>
      </main>

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

      <NavBar currentPage="robodog" />
    </div>
  );
};

export default RoboDogController;