import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');   // Kullanıcının girdiği email adresini tutmak için kullanılıyor
  const [message, setMessage] = useState('');   // Başarılı mesajı göstermek için kullanılıyor
  const [error, setError] = useState('');   // Hata mesajını göstermek için kullanılıyor
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) { 

      setError('Please enter your email address');      // Email boşsa kullanıcıyı uyarılıyor

      return;
    }

    try {
      setLoading(true);
      const baseUrl = window.location.origin;

      const response = await axios.post('https://localhost:44374/api/Password/ForgotPassword', {       // API'ye POST isteği gönderilüyor, email ve baseUrl ile

        email: email,
        baseUrl: baseUrl,

      });


            // API'den dönen cevaba göre işlem yapıylıyor eğer başarılı ise mesaj gösterilir ve login sayfasına yollanır,
            // başarısız ise error verir 
      if (response.data.success) {

        setMessage('Reset instructions sent. Please check your email.');

        setTimeout(() => {

          navigate('/login');

        }, 3000);

      } else {

        setError(response.data.message || 'Something went wrong. Please try again.');
      }

    } catch (err) {

      if (err.response && err.response.data) {

        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.Message) {
          setError(err.response.data.Message);
        } else if (err.response.data.ExceptionMessage) {
          setError(err.response.data.ExceptionMessage);
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setMessage('Forgot Password Link Sent To Your Mail Please Check Your Mail');
      }
    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="forgot-app-container">

      <div className="forgot-auth-container">

        <div className="forgot-auth-card">
          <div className="forgot-auth-content">
            <div className="forgot-header">
              <button
                className="forgot-back-button"
                onClick={() => navigate('/login')}
              >
                &lt;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="forgot-form-group">
                <h1 className="forgot-title">Forgot Password</h1>
                <p className="forgot-instruction-text">
                  No worries! Enter your email address below and we will send you a
                  link to reset your password.
                </p>
                <label className="forgot-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="forgot-input"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {error && (
                  <div className="forgot-error-message">{error}</div>
                )}
                {message && (
                  <div className="forgot-success-message">{message}</div>
                )}

                <button
                  type="submit"
                  className="forgot-submit-button"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;