import React, { useState } from 'react';
import './AddTaskPopup.css';

const AddTaskPopup = ({ onClose, onSave }) => {
  // Use "title" to match ToDo.js tasks
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = () => {
    const taskData = { title, deadline, status };
    console.log('Saving task:', taskData);
    if (onSave) onSave(taskData);
    if (onClose) onClose();
  };

  // Cancel closes popup
  const handleCancel = () => {
    if (onClose) onClose();
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
