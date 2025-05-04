import { useState, useEffect } from 'react';
import './WebPage.css';
import roboDogImg from '../assets/dogg.png'; // You'll need to add this image to your assets folder
import appStoreImg from '../assets/pngegg.png'; // You'll need to add this image to your assets folder

function WebPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to section functions
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDownload = () => {
    const downloadSection = document.getElementById('download');
    downloadSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="robodog-container">
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">RoboDog</div>
        <div className="nav-links">
          <button onClick={scrollToAbout}>About</button>
          <button onClick={scrollToDownload}>Download</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <img src={roboDogImg} alt="RoboDog" className="hero-image" />
          <div className="hero-text">
            <h1>Get to know your new friend RoboDog more</h1>
            <button className="about-btn" onClick={scrollToAbout}>About RoboDog</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about"></section>
      <section  className="about-section">
        <div className="about-content">
          <div className="about-text">
          <h2>Meet the companion of the future!</h2>
          <p>
            RoboDog is equipped with advanced technology and intelligent AI features.
            RoboDog can walk, run, jump, and sit with precision. Understanding voice commands,
            it interacts with you seamlessly. With a built-in light on its head, it navigates even
            in the dark. Additionally, its location-tracking feature ensures you always know
            where it is.
          </p>
          <p>
            Whether as a loyal friend or a helpful assistant, this robotic dog brings together
            the perfect harmony of technology and companionship! 🐶
          </p>
          </div>
          <div className="about-image-container">
            <img src={roboDogImg} alt="RoboDog Features" className="about-image" />
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="download-section">
        <div className='download-text'>
        <h2>Download RoboDog App</h2>
        <p>And Enjoy the Fun!</p>
        </div>
        <div className="store-buttons">
          <a href="#" className="store-btn">
            <img src={appStoreImg} class="download-img" alt="Download on the App Store" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default WebPage;