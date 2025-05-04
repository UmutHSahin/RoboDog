import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);

    try {
      const data = {
        Email: email,
        Password: password
      };
      
      const url = 'https://localhost:44374/api/Test/Login';
      const result = await axios.post(url, data);
      
      console.log('Login response:', result.data);
      
      if (result.data === "Login Success") {
        setIsLoggedIn(true);
        navigate('/connect');
      } else {
        setError('Login failed: ' + result.data);
      }
    } catch (error) {
      setError('Login error: ' + (error.response?.data || error.message));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-auth-container">
      <div className="login-auth-card">
        <button className="login-back-button" onClick={() => navigate('/')}>
          &lt;
        </button>
        <div className="login-auth-content">
          <div className="login-status-bar">
          </div>
          
          <div className="login-header">
            <h1 className="login-title">Login</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-label" htmlFor="email">Email</label>
              <input
                className="login-input"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </div>
            
            <div className="login-form-group">
              <label className="login-label" htmlFor="password">Password</label>
              <div className="login-password-input">
                <input
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                <button 
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
               <div className="login-forgot-link">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </div>
            
            {error && <div className="login-error-message">{error}</div>}
            
            <button type="submit" className="login-submit-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;