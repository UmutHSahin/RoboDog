import { useState } from 'react';
import { Hand } from 'lucide-react';

const ExecLauncherButton = ({ disabled, onClick }) => {
  const [status, setStatus] = useState('idle'); // idle, launching, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleLaunch = async () => {
    if (disabled) return;
    
    setStatus('launching');
    
    try {
      // Call the original handleExecute function
      await onClick();
      
      // Set success status
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error("Execution error:", error);
      setStatus('error');
      setErrorMessage('Command failed to execute');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };
  
  return (
    <button
      className={`
        hand-btn
        flex items-center justify-center
        rounded-full
        transition-all duration-300
        ${status === 'launching' ? 'bg-yellow-500' : ''}
        ${status === 'success' ? 'bg-green-500' : ''}
        ${status === 'error' ? 'bg-red-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handleLaunch}
      disabled={disabled || status === 'launching'}
      style={{
        padding: '10px',
        fontSize: '24px',
        position: 'relative'
      }}
    >
      {status === 'launching' ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <Hand size={24} className={status === 'success' ? 'text-white' : ''} />
      )}
      
      {status === 'error' && (
        <div 
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontSize: '10px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '2px 4px',
            borderRadius: '3px',
            color: '#e53e3e'
          }}
        >
          {errorMessage}
        </div>
      )}
    </button>
  );
};

export default ExecLauncherButton;