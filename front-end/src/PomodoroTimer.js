import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css'; // for Pomodorotimer.js
import { Link } from "react-router-dom"; // for navbar

const PomodoroTimer = () => {
  // Default 30 minutes in seconds (30 * 60)
  const DEFAULT_TIME = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef(null);

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
  };

  // Flip phone function (would be triggered by gyroscope in real app)
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
      <Link to="/sidebar" className="nav-bar">☰</Link> 
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
            Simulate Flip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;