import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateNewPassword.css';

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();   // linkten reset tokenı almak için
  const [password, setPassword] = useState(''); // Yeni şifre
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);  // Token doğru mu yanlış mı


  useEffect(() => {    // Sayfa yüklendiğinde toke ı doğruluyor

    const validateToken = async () => {


      try {

        const response = await axios.post('https://localhost:44374/api/Password/ValidateToken', {
          token: token
        });

        if (!response.data.success) {  //Eğer api umazsa error verir ve 3 saniye sorna forgot password sayfsaına gder

          setError(response.data.message || 'Invalid or expired token. Please request a new password reset.');
          
          setTimeout(() => {
            navigate('/forgot-password');
          }, 3000);

        }

      } catch (err) {

        setError('Invalid or expired token. Please request a new password reset.');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);

      } finally {
        setValidatingToken(false);
      }
    };

    //Eğer linkde token varsa tokeni doğeulamaya çalışıyoruz
    if (token) {

      validateToken();

    } else {

      setError('No reset token found. Please request a new password reset.');
      setValidatingToken(false);
      setTimeout(() => {
        navigate('/forgot-password');
      }, 3000);
    }
  }, [token, navigate]);  // Bu da token ve nevagate deşitiyse çalışıyor demektir


  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {

      //şifreiy sıırlamak için apiye soruyor 
      setLoading(true);
      const response = await axios.post('https://localhost:44374/api/Password/ResetPassword', {
        token: token,
        newPassword: password
      });

    // Başarıyla sıfırlandıysa kullanıcıya mesaj veriyor ve login sayfasına yönlendiriyor
      if (response.data.success) {

        setMessage('Password updated successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {

        setError(response.data.message || 'Failed to update password. Please try again.');
      }
    } catch (err) {
      
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.Message) {
          setError(err.response.data.Message);
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  /*if (validatingToken) {
    return (
      <div className="cnp-app-container">
        <div className="cnp-auth-container">
          <div className="cnp-auth-card">
            <div className="cnp-auth-content">
              <h2 className="cnp-title">Verifying reset link...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }*/

  return (
    <div className="cnp-app-container">
      <div className="cnp-auth-container">
        <div className="cnp-auth-card">
          <div className="cnp-auth-content">


            <form onSubmit={handleSubmit} className="cnp-form">
              <div className="cnp-form-group">
                <h1 className="cnp-title">Create New Password</h1>

                <p className="cnp-instruction-text">
                  Please enter and confirm your new password.
                  You will need to login after your password is changed.
                </p>
                <label className="cnp-label" htmlFor="password">
                  Password
                </label>
                <div className="cnp-password-input">
                  <input
                    className="cnp-input"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="cnp-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="cnp-form-group">
                <label className="cnp-label" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="cnp-password-input">
                  <input
                    className="cnp-input"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="cnp-toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                
                {error && (
                  <div className="cnp-error-message">{error}</div>
                )}
                {message && (
                  <div className="cnp-success-message">{message}</div>
                )}

                <button 
                  type="submit" 
                  className="cnp-submit-button"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;