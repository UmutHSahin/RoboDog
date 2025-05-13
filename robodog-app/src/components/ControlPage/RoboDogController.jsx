import React, { useState, useEffect, useRef } from 'react';   //useRef --- DOM elemanlarına veya Değişkenlere referans tutmak için kullanılıyor
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCog } from 'react-icons/fa';
import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { BsLightningFill, BsMic, BsExclamationTriangle, BsPower, BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { FaDog, FaPaw } from 'react-icons/fa';
import { GiSittingDog, GiDogHouse } from 'react-icons/gi';
import { GiDogBowl } from 'react-icons/gi';
import { GiHand } from 'react-icons/gi';
import { GiRobotGolem } from 'react-icons/gi';
import { GiMusicalNotes } from 'react-icons/gi';




import './RoboDogController.css';
import ExecLauncherButton from '../ControlPage/ExecLauncherButton ';
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
  const [lightLevel, setLightLevel] = useState(0);  // 0, 125, or 255

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

    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) { 

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {

        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        setListeningText(`Heard: ${transcript}`);
        
        const simulateButtonClick = (selector) => {
          const button = document.querySelector(selector);
          if (button && !button.disabled) {
            button.click();
          }
        };
        
        if (transcript.includes('moving walk')) {
          simulateButtonClick('.direction-btn.up-btn');
        } else if (transcript.includes('moving stop')) {
          simulateButtonClick('.direction-btn.down-btn');
        } else if (transcript.includes('light off')) {
          setLightLevel(0);
          fetch(`http://${espIP}/message?text=flash:0`);
        } else if (transcript.includes('light low') || transcript.includes('light dim')) {
          setLightLevel(125);
          fetch(`http://${espIP}/message?text=flash:125`);
        } else if (transcript.includes('light high') || transcript.includes('light bright')) {
          setLightLevel(255);
          fetch(`http://${espIP}/message?text=flash:255`);
        } else if (transcript.includes('light toggled') || transcript.includes('light')) {
          simulateButtonClick('.action-btn.lightning-btn');
        } else if (transcript.includes('bark triggered')) {
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
        }else if (transcript.includes('start sing') || transcript.includes('turn off microphone')) {
          simulateButtonClick('.sing-warning-btn');
        }else if (transcript.includes('walk auto') || transcript.includes('turn off microphone')) {
          simulateButtonClick('.direction-btn .auto-btn');
        }

        else if (transcript.includes('walk')) {
          simulateButtonClick('.direction-btn.up-btn');
        } else if (transcript.includes('stop')) {
          simulateButtonClick('.direction-btn.down-btn');
        } else if (transcript.includes('bark') || transcript.includes('alarm')) {
          simulateButtonClick('.warning-btn');
        } else if (transcript.includes('fast')) {
          simulateButtonClick('.speed-btn:nth-child(1)');
        } else if (transcript.includes('medium')) {
          simulateButtonClick('.speed-btn:nth-child(2)');
        } else if (transcript.includes('slow')) {
          simulateButtonClick('.speed-btn:nth-child(3)');
        } else if (transcript.includes('stand')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(1)');
        } else if (transcript.includes('sit')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(2)');
        } else if (transcript.includes('bend')) {
          simulateButtonClick('.warning-butttons .warning-btn:nth-child(3)');
        }else if (transcript.includes('sing')) {
          simulateButtonClick('.sing-warning-btn');
        }else if (transcript.includes('auto')) {
          simulateButtonClick('.direction-btn .auto-btn');
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

            setTimeout(() => {
              if (micActive) {
                recognitionRef.current.start();
              }
            }, 300);
          } catch (e) {
            console.log('Recognition already started');
            

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
    if (!espIP || !cameraEnabled) return;
    
    if (wsCamera.current) {
      wsCamera.current.close();
      wsCamera.current = null;
    }
    
    wsCamera.current = new WebSocket(`ws://${espIP}/Camera`);
    wsCamera.current.binaryType = 'blob';
    
    wsCamera.current.onopen = () => {
      console.log("Camera WebSocket connected");
      setCameraConnected(true);
    };

    wsCamera.current.onclose = (event) => {
      console.log("Camera WebSocket disconnected", event.code, event.reason);
      setCameraConnected(false);
      

    };
    
    wsCamera.current.onerror = (error) => {
      console.error("Camera WebSocket error:", error);
      // Don't attempt to reconnect on error - the onclose handler will handle that
    };
    
    let previousImageUrl = null;
    wsCamera.current.onmessage = (event) => {
      if (cameraImageRef.current && event.data instanceof Blob) {

        if (previousImageUrl) {
          URL.revokeObjectURL(previousImageUrl);
        }
        

        previousImageUrl = URL.createObjectURL(event.data);
        cameraImageRef.current.src = previousImageUrl;
        setCameraConnected(true);
      }
    };
  };
  
  if (powerOn && espIP && cameraEnabled) {
    connectWebSockets();
  }
  
  return () => {
    if (wsCamera.current) {
      console.log("Cleaning up camera WebSocket connection");
      wsCamera.current.close();
      wsCamera.current = null;
    }
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

    console.log("walk");
    
    fetch(`http://${espIP}/message?text=walk`)

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
    console.log("stop");
    
    fetch(`http://${espIP}/message?text=stop`)
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
    console.log("left");
    
    fetch(`http://${espIP}/message?text=left`)
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
  const handleAuto = () => {

    if (!powerOn || !espIP) return;
    console.log("auto");
    
    fetch(`http://${espIP}/message?text=auto`)
      .then(response => {

        if (response.ok) {

          console.log("Auto command sent successfully");
        } else {

          console.error("Failed to send auto command");
        }
      })
      .catch(error => {

        console.error("Error sending auto command:", error);
      });
  };

  const handleRight = () => {

    if (!powerOn || !espIP) return;
    console.log("right");
    
    fetch(`http://${espIP}/message?text=right`)
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
    console.log(`Delay set to ${speed}`);
    
    const speedValue = speed === 'slow' ? 1000 : speed === 'medium' ? 500 : 250;
    
    fetch(`http://${espIP}/message?text=delay:${speedValue}`)

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

      setLightLevel(0);

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
    
    // değer değişimi 0 -> 125 -> 255 -> 0
    const nextLightLevel = lightLevel === 0 ? 125 : lightLevel === 125 ? 255 : 0;
    setLightLevel(nextLightLevel);
    
    console.log(`Light level set to ${nextLightLevel}`);
    
    fetch(`http://${espIP}/message?text=led:${nextLightLevel}`)
      .then(response => {
        if (response.ok) {
          console.log(`Light level ${nextLightLevel} command sent successfully`);
        } else {
          console.error("Failed to send light level command");
        }
      })
      .catch(error => {
        console.error("Error sending light level command:", error);
      });
  };

  const handleWarningToggle = () => {
    if (!powerOn || !espIP) return;
    console.log("bark");
    
    fetch(`http://${espIP}/message?text=bark`)
      .then(response => {
        if (response.ok) {
          console.log("bark command sent successfully");
        } else {
          console.error("Failed to send bark command");
        }
      })
      .catch(error => {
        console.error("Error sending bark command:", error);
      });
  };


  const handleSit = () => {
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
  
  const handleStand = () => {
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


    
  const handleSing = () => {
    if (!powerOn || !espIP) return;
    console.log("Sending sing command");
  
    fetch(`http://${espIP}/message?text=sing`)
      .then(response => {
        if (response.ok) {
          console.log("Bend command sent successfully");
        } else {
          console.error("Failed to send sing command");
        }
      })
      .catch(error => {
        console.error("Error sending sing command:", error);
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

          try {
            recognitionRef.current.abort();
          } catch (e) {

          }
          

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

 const handleExecute = async () => {
  if (!powerOn) {
    return Promise.reject(new Error('Power is off or backend IP address is missing'));
  }

  const targetIP = '192.168.1.1'; // ← Buraya uygun IP'yi yaz
  console.log('Sending execute command to backend at:', targetIP);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout

  try {
    const response = await fetch(`https://localhost:44374/api/execute/cmd?ip=${encodeURIComponent(targetIP)}`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Command failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Execute command response:', result);

    return Promise.resolve(result);
  } catch (error) {
    console.error('Error sending execute command:', error);
    return Promise.reject(error);
  }
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
             
              >
                <RiArrowLeftSLine />
              </button>
              <button 
                onClick={handleAuto} 
                disabled={!powerOn}
                className="direction-btn auto-btn"
                
              >
                <GiRobotGolem />
              </button>
              <button 
                onClick={handleRight} 
                disabled={!powerOn}
                className="direction-btn right-btn"
                
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
            <div className="middle-top">
            <button 
              className={`action-btn lightning-btn ${lightLevel > 0 ? 'active' : ''}`}
              onClick={handleLightToggle} 
              disabled={!powerOn}
              style={{ opacity: lightLevel === 0 ? 0.6 : lightLevel === 125 ? 0.8 : 1 }}
            >
              <BsLightningFill />
            </button>
            <button 
              className="sing-warning-btn"
              onClick={handleSing} 
              disabled={!powerOn}
            >
              <GiMusicalNotes  />
            </button>
            </div>
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

              <ExecLauncherButton 
                disabled={!powerOn}
                onClick={handleExecute}
              />
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