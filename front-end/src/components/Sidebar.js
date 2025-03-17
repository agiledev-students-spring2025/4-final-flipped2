import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/calendar">Home</Link></li>
        <li><Link to="/todo">To-Do List</Link></li>
        <li><Link to="/inprogress">In Progress</Link></li>
        <li><Link to="/done">Done</Link></li>
        <li><Link to="/pomodoro">Pomodoro Timer</Link></li>
        <li><Link to="/addevent">Add Event</Link></li>
        <li><Link to="/addtask">Add Task</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;