import React, { useState, useEffect } from 'react';
import './AddEditPopup.css';
import { useNavigate, useLocation } from 'react-router-dom';

const AddTaskPopup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskData, isEditing } = location.state || { taskData: null, isEditing: false };

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (taskData) {
      setTitle(taskData.title || '');
      setDeadline(taskData.deadline || '');
      setStatus(taskData.status || '');
    }
  }, [taskData]);

  const handleSave = () => {
    if (!title || !deadline || !status) {
      alert("Please fill in all fields.");
      return;
    }
  
    const newTask = { title, deadline, status };
  
    if (isEditing) {
      newTask.id = taskData.id;
      fetch(`http://localhost:5001/api/tasks/${newTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Task updated:", data);
          navigate('/todo');
        })
        .catch(err => console.error("Error updating task:", err));
    } else {
      fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Task added:", data);
          navigate('/todo');
        })
        .catch(err => console.error("Error adding task:", err));
    }
  };

  const handleCancel = () => {
    navigate('/todo');
  };

  return (
    <div className="popup-overlay">
      <h2 className="popup-title">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
      <div className="popup-content">
        <div className="form-group">
          <label htmlFor="tname">Task:</label>
          <input
            type="text"
            id="tname"
            name="tname"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br /><br />
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="text"
            id="deadline"
            name="deadline"
            placeholder="YYYY-MM-DD"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="status-group">
          <div className="status-row">
            <span className="status-label">Status:</span>
            <span className="status-display">{status}</span>
          </div>
          <div className="status-buttons">
            <button type="button" onClick={() => setStatus('todo')}>
              To-do
            </button>
            <br />
            <button type="button" onClick={() => setStatus('in-progress')}>
              In-Process
            </button>
            <br />
            <button type="button" onClick={() => setStatus('done')}>
              Done
            </button>
            <br />
          </div>
        </div>
        <br />

        <div className="button-container">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="save-button" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;