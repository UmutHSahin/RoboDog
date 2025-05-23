import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

//Burada sayfaları dahil ediyoruz
import Welcome from './components/LoginSignupPage/Welcome';
import Login from './components/LoginSignupPage/Login';
import Register from './components/LoginSignupPage/Register';
import ForgotPassword from './components/LoginSignupPage/ForgotPassword';
import CreateNewPassword from './components/LoginSignupPage/CreateNewPassword';
import SplashScreen from './components/StartAppPage/SplashScreen';
import ConnectDogPage from './components/HomePage/ConnectDogPage';
import InfoDogPage from './components/HomePage/InfoDogPage';
import ControlPage from './components/ControlPage/RoboDogController';
import SettingsPage from './components/SettingsPage/SettingsMain';
import RobotData from './components/SettingsPage/DataDisplay';
import ChangePasswordPopup from './components/SettingsPage/ChangePasswordPopup';

//import ResetPassword from './components/LoginSignupPage/ResetPassword';


import './App.css';

axios.defaults.baseURL = 'https://localhost:44374';

const ProtectedRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

function App() {
  const [loading, setLoading] = useState(true);  //Açılış ekranının gösterip gösterilmeyeceğini belirler, ture ise görünür.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // kullanıcı giriş yaptı mı yapmadı mı ona bakıyor

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  //Bu bölüm açılış ekranını 3 saniye sonra false yaparak görünmez kılmaya sağlıyor
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer); // Burada ise timeri temizliyor
  }, []);

  if (loading) {
    return <SplashScreen />;  // Açılış ekranı görünüyor burada 
  }

  return (
    <Router>
      <div className="app-container">
        <div className="data_container">
          <Routes>
            <Route path="/" element={<Welcome />} />  {/* Bu / olduğunda Welcome sayfasına gönderir*/}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> {/*  Bu /login olduğunda login sayfasına gönderir*/}
            <Route path="/register" element={<Register />} /> {/*  Bu /register olduğunda register sayfasına gönderir*/}
            <Route path="/forgot-password" element={<ForgotPassword />} /> {/*  Bu /forgot-password olduğunda ForgotPassword sayfasına gönderir*/}
            <Route path="/create-new-password/:token" element={<CreateNewPassword />} /> {/*  Bu /create-new-password olduğunda CreateNewPassword sayfasına gönderir*/}
            {/*<Route path="/reset-password" element={<ResetPassword />} />*/}

            {/*Bu /connect olduğunda ConnectDogPage sayfasına gönderir*/}
            <Route                          
              path="/connect" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<ConnectDogPage />} />} 
            />          

            {/*Bu /info olduğunda InfoDogPage sayfasına gönderir*/}                              
            <Route 
              path="/info" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<InfoDogPage />} />} 
            />

            {/*Bu /robotControl olduğunda ControlPage sayfasına gönderir*/}
            <Route 
              path="/robotControl" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<ControlPage />} />} 
            />
            
            {/*Bu /settings olduğunda SettingsPage sayfasına gönderir*/}
            <Route 
              path="/settings" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<SettingsPage />} />} 
            />
              
            {/*Bu /robotData olduğunda RobotData sayfasına gönderir*/}
            <Route 
              path="/robotData" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<RobotData />} />} 
            />

            <Route 
              path="/changePassword" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<ChangePasswordPopup onBack={() => window.history.back()} />} />} 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;