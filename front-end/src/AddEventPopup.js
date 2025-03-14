import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEditPopup.css';

const AddEventPopup = ({ onSave }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  const handleSave = () => {
    const eventData = { title, date, time, duration };
    console.log('Saving event:', eventData);
    if (onSave) onSave(eventData);
    // Navigate to the SimpleCalendar
    navigate('/');
  };

  // Cancel button navigates back to SimpleCalendar
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="popup-overlay">
      <h2 className="popup-title">Add Event</h2>
      <div className="popup-content">
        <form>
          <label htmlFor="ename">Event :</label>
          <input
            type="text"
            id="ename"
            name="ename"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br /><br />
          <label htmlFor="date">Date :</label>
          <input
            type="text"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <br /><br />
          <label htmlFor="time">Time :</label>
          <input
            type="text"
            id="time"
            name="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <br /><br />
          <label htmlFor="duration">Duration :</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </form>
        <br /><br />
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddEventPopup;