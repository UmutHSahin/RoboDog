import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import './navbar.css';
import NavDogImg from "../../assets/Adsız_tasarım-removebg-preview.png";

const NavBar = ({ currentPage }) => { //Buradaki currentPage hangi butona tıklayınca hangi sayfa aktif hale gelecek onu belirlemeye yarıyor 
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    if (page === 'home') {
      navigate('/connect');
    } else if (page === 'robodog') {
      navigate('/robotControl');
    } else if (page === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div 
          className={`navbar-item ${currentPage === 'home' ? 'active' : ''}`} 
          onClick={() => handleNavigation('home')}  //Burada handleNavigation fonksiyonunu çağırıp kullanıcıyı home sayfasına gönderir
        >
          <div className="navbar-icon">
            <Home strokeWidth={2} />  {/* İconun kalınlığı belitiyorum */}
          </div>
          <span className="navbar-label">Home</span>
        </div>
        
        <div 
          className={`navbar-item ${currentPage === 'robodog' ? 'active' : ''}`} 
          onClick={() => handleNavigation('robodog')}   //Burada handleNavigation fonksiyonunu çağırıp kullanıcıyı robot kontrol sayfası olan robodog sayfasına gönderir
        >
          <div className="navbar-dog-container">
            <div className="navbar-dog-icon">
              <img src={NavDogImg} alt="" className="dog-image" />
            </div>
          </div>
          <span className="navbar-label">RoboDog</span>
        </div>
        
        <div 
          className={`navbar-item ${currentPage === 'settings' ? 'active' : ''}`} 
          onClick={() => handleNavigation('settings')}   //Burada handleNavigation fonksiyonunu çağırıp kullanıcıyı settings sayfasına gönderir
        >
          <div className="navbar-icon">
            <Settings strokeWidth={2} />  {/* İconun kalınlığı belitiyorum */}
          </div>
          <span className="navbar-label">Settings</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;