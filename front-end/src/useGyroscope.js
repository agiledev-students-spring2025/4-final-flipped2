// useGyroscope.js
import { useEffect } from 'react';

const useGyroscope = (onFlip) => {
  useEffect(() => {
    const handleOrientation = (event) => {
      // below -160 degrees count as flip face down
      // Adjust the degree as needed for testing 
      if (event.beta !== null && event.beta < -160) {
        onFlip && onFlip();
      }
    };

    // Listen for device orientation events.
    window.addEventListener('deviceorientation', handleOrientation);

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [onFlip]);
};

export default useGyroscope;
