import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-app-container">

      <div className="welcome-auth-content">

        <div className="welcome-content">
          
          <h1>Welcome to RoboDog</h1>
          
          <div className="welcome-auth-buttons">

            <button className="welcome-secondary-button" onClick={() => navigate('/register')}>Register</button>
            <button className="welcome-primary-button" onClick={() => navigate('/login')}>Login</button>

          </div>

        </div>

      </div>
      
    </div>
  );
};

export default Welcome;