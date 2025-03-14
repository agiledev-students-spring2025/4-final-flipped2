import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTaskPopup.css';

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
        </form>
        <p>Status: {status}</p>
        <br /><br />
        <button type="button" onClick={() => setStatus('todo')}>
          To-do
        </button>
        <br /><br />
        <button type="button" onClick={() => setStatus('in-progress')}>
          In-Process
        </button>
        <br /><br />
        <button type="button" onClick={() => setStatus('done')}>
          Done
        </button>
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

export default AddTaskPopup;