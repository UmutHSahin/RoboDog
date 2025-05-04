import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // E-posta yı tutar 
  const [password, setPassword] = useState(''); // şifreyi yı tutar 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Form gönderildiğinde butonu pasifleştirmeye yarar

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {

      //backend e gönderilecek veriler objeler yani
      const data = {

        Email: email,
        Password: password
      };
    

      const url = 'https://localhost:44374/api/Test/Registration';       //backendin kayıt için istek atılacak yer
      const result = await axios.post(url, data);                       // POST isteği gönder
       
      console.log('Registration successful for:', email);   // kayıt başarılı  olursa konsola yaz
      
      if (result.data === "data inserted") {        // Backend'den dönen yanıt başarılıysa login sayfasına yönlendiriyor

        navigate('/login');

      } else {

        setError('Registration failed: ' + result.data);
      }
      
    } catch (error) {
      setError('There is already an account with this email address.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-auth-content">
      <div className="register-header">
        <button className="register-back-button" onClick={() => navigate('/')}> &lt; </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="register-form-group">
          <h1 className="register-title">Register</h1>
          <label className="register-label" htmlFor="email">Email</label>
          <input
            className="register-input"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
        </div>
        
        <div className="register-form-group">
          <label className="register-label" htmlFor="password">Password</label>
          <div className="register-password-input">
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <button 
              type="button"
              className="register-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <div className="register-form-group">
          <label className="register-label" htmlFor="confirm-password">Confirm Password</label>
          <div className="register-password-input">
            <input
              className="register-input"
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
            <button 
              type="button"
              className="register-toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        {error && <div className="register-error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="register-submit-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="register-terms-text">
          By continuing, you agree to our <Link>Terms of Service</Link> and <Link>Privacy Policy</Link>.
        </div>
      </form>
    </div>
  );
};

export default Register;