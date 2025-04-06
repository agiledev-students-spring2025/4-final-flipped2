import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEditPopup.css';

const AddEventPopup = ({ onSave, onDelete, onClose, eventData, isEditing = false }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || '');
      setDate(eventData.date || '');
      setTime(eventData.time || '');
    }
  }, [eventData]);

  const handleSave = () => {
    if (!title || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }

    const newEvent = { title, date, time };
    if (isEditing) {
      newEvent.index = eventData.index; // preserve index
      onSave(newEvent);
    } else {
      onSave(newEvent);
      navigate('/calendar'); // Redirect after adding
    }
  };

  return (
    <div className="popup-overlay">
      <h2 className="popup-title">{isEditing ? 'Edit Event' : 'Add Event'}</h2>
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
          <button type="button" className="cancel-button" onClick={onClose || (() => navigate('/calendar'))}>
            Cancel
          </button>
          {isEditing && (
            <button type="button" className="cancel-button" onClick={onDelete}>
              Delete
            </button>
          )}
          <button type="button" className="save-button" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventPopup;
