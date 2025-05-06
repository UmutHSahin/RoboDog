import React, { useState, useEffect } from 'react';
import './Popups.css';

const ChangeDogNamePopup = ({ onClose, onSubmit, isNewDog = false, isLoading = false }) => {
  
  const [dogName, setDogName] = useState('');  // dogName adında bir state tanımlanıyor, başlangıçta isim yok
  const [error, setError] = useState('');


  useEffect(() => {


  // dogName adında bir state tanımlanıyor, başlangıçta isim yok

    document.getElementById('dogNameInput')?.focus();

  }, []);

  const handleSubmit = () => {    // Form gönderim işlemi (butona basılınca çalışıyor)

    if (!dogName.trim()) {

      setError('Dog name cannot be empty');
      return;
    }

    onSubmit(dogName);//Eğer isim geçerliyse ismi atar
  };

  return (

    <div className="robodog-popup-overlay">
      <div className="robodog-popup">
        <h2 className="robodog-popup-title">
          {isNewDog ? 'Name Your New Dog' : 'Change Dog Name'}
        </h2>

        {error && <div className="robodog-popup-error">{error}</div>}

        <div className="robodog-popup-field">
          <label htmlFor="dogNameInput">
            {isNewDog ? 'Dog Name' : 'New Dog Name'}
          </label>
          <input
            id="dogNameInput"
            type="text"
            value={dogName}

            onChange={(e) => {        // Kullanıcı yazdıkça dogName güncelleniyor

              setDogName(e.target.value);
              setError('');
            }}
            placeholder={isNewDog ? "Enter dog name" : "Enter new dog name"}
            disabled={isLoading}
          />
        </div>

        <div className="robodog-popup-buttons">
          {!isNewDog && (
            <button 
              className="robodog-popup-cancel" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button 
            className="robodog-popup-confirm" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading 
              ? 'Saving...' 
              : (isNewDog ? 'Save Name' : 'Confirm')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDogNamePopup;