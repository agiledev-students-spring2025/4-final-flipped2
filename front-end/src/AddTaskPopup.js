import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEditPopup.css';

const AddTaskPopup = ({ onSave }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = () => {
    const taskData = { title, deadline, status };
    console.log('Saving task:', taskData);
    if (onSave) onSave(taskData);
    
    // navigate based on status
    if (status === 'todo') {
      navigate('/todo');
    } else if (status === 'in-progress') {
      navigate('/inprogress');
    } else if (status === 'done') {
      navigate('/done');
    } else {
      navigate('/todo');
    }
  };

  // Cancel navigate to To-Do
  const handleCancel = () => {
    navigate('/todo');
  };

  return (
    <div className="popup-overlay">
      <h2 className="popup-title">Add Task</h2>
      <div className="popup-content">
        <form>
          <div className="form-group">
            <label htmlFor="tname">Task :</label>
            <input
              type="text"
              id="tname"
              name="tname"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br /><br />
            <label htmlFor="deadline">Deadline :</label>
            <input
              type="text"
              id="date"
              name="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>  
        </form>
        <div className="status-group">
          <div className="status-row">
            <span className="status-label">Status:</span>
            <span className="status-display">{status}</span>
          </div>
            <div className="status-buttons">
              <button type="button" onClick={() => setStatus('todo')}>
                To-do
              </button><br />
              <button type="button" onClick={() => setStatus('in-progress')}>
                In-Process
              </button><br />
              <button type="button" onClick={() => setStatus('done')}>
                Done
              </button><br />
            </div>
          </div><br />
        <div className="button-container">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;