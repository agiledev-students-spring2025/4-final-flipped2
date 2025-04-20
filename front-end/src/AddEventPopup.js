import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddEditPopup.css';

const AddEventPopup = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    if (!title || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }

    const newEvent = { title, date, time };

    fetch("http://localhost:5001/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then(res => res.json())
      .then(() => navigate('/calendar'))
      .catch(err => console.error("Error saving event:", err));
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>☰</button>
      {showSidebar && (
        <div className="sidebar-overlay">
          <Sidebar />
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>
        </div>
      )}

      <div className="popup-overlay">
        <h2 className="popup-title">Add Event</h2>
        <div className="popup-content">
          <div className="form-group">
            <label htmlFor="ename">Event: </label>
            <input
              type="text"
              id="ename"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br /><br />
            <label htmlFor="date">Date: </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <br /><br />
            <label htmlFor="time">Time: </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="button-container">
            <button type="button" className="cancel-button" onClick={() => navigate('/calendar')}>
              Cancel
            </button>
            <button type="button" className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEventPopup;
