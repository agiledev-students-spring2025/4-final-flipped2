import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css'; // for Pomodorotimer.js
import useGyroscope from './useGyroscope'; // for gyroscope function
import Sidebar from './Sidebar';


const PomodoroTimer = () => {

  // Note: Need to change URL for .env for deployment 
  const BACKEND_URL = "http://localhost:5001"; // Define backend URL here

  // Default 30 minutes in seconds (30 * 60)
  const DEFAULT_TIME = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [reward, setReward] = useState(null); // for backend 
  const timerRef = useRef(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress calculation (for circle progress)
  const calculateProgress = () => {
    return ((DEFAULT_TIME - timeLeft) / DEFAULT_TIME) * 100;
  };

  // Start timer
  const startTimer = () => {

     // Log session start to backend
     fetch(`${BACKEND_URL}/api/start-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: "user1" })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Session start:', data);
      })
      .catch(err => console.error('Error starting session:', err));

    // set the timer to starts and stop showing the controls
    setIsRunning(true);
    setShowControls(false);

  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
    setShowControls(true);
  };

  // Reset timer
  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(DEFAULT_TIME);
    setIsBreak(false);
    endSession(); // Fetch reward from backend
  };

  // Fetch reward from backend when session ends
  const endSession = () => {
    fetch(`${BACKEND_URL}/api/end-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: "user1" })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Session ended:', data);
        setReward(data.reward); // Store the reward in state
      })
      .catch(err => console.error('Error ending session:', err));
  };


  useGyroscope(() => {
    // If timer is running, pause it; otherwise, start it.
    flipPhone();
  });
  // Pause timer button
  const flipPhone = () => {
    if (!isRunning) {
      startTimer();
    } else {
      pauseTimer();
    }
  };


  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setShowControls(true);
            
            // Handle completion
            if (!isBreak) {
              // Show tarot card or quote here (just a placeholder)
              alert('Focus session complete! Here\'s your reward!');
              endSession(); // Fetch and show the reward from backend
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isBreak]);

  // Calculate the circumference of the progress circle
  const circumference = 2 * Math.PI * 120; // 120 is the radius
  const strokeDashoffset = circumference - (calculateProgress() / 100) * circumference;

  return (
    <div className="pomodoro-container">
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
        ☰
      </button>
      {showSidebar && (
        <div className="sidebar-overlay">
          <Sidebar />
          <button className="close-sidebar-btn" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
      )}
      <div className="timer-wrapper">
        <div className="timer-circle-container">
          <svg className="timer-circle" viewBox="0 0 280 280">
            <circle 
              className="timer-circle-bg" 
              cx="140" 
              cy="140" 
              r="120" 
              strokeWidth="8"
              fill="none"
            />
            <circle 
              className="timer-circle-progress" 
              cx="140" 
              cy="140" 
              r="120" 
              strokeWidth="8"
              fill="none"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />
          </svg>
          <div className="timer-display">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="timer-label">{isBreak ? 'Break' : 'Focus'}</div>
          </div>
        </div>
        
        {showControls && (
          <div className="timer-controls">
            {isRunning ? (
              <button className="control-button pause" onClick={pauseTimer}>
                Pause
              </button>
            ) : (
              <button className="control-button start" onClick={startTimer}>
                Start
              </button>
            )}
            <button className="control-button reset" onClick={resetTimer}>
              Reset
            </button>
          </div>
        )}
        
        <div className="flip-instruction">
          <p>Flip your phone face down to start focusing</p>
          <button className="flip-button" onClick={flipPhone}>
            Pause Timer(Turn phone around to)
          </button>
        </div>
        {/* Display Reward Popup */}
        {reward && (
          <div className="reward-popup">
            <h3>Congratulations!</h3>
            {reward.imageUrl && (
              <img 
                src={reward.imageUrl} 
                alt={reward.name} 
                style={{ maxWidth: '150px', marginBottom: '1em' }}
              />
            )}
            <p>{reward.name ? `${reward.name}: ${reward.description}` : reward}</p>
            <button onClick={() => setReward(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;