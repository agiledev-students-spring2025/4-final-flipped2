import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(true);


  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {isOpen && <h2>Flipped App</h2>}
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/calendar">
            <span className="icon">🏠</span>
            {isOpen && <span className="link-text">Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/todo">
            <span className="icon">📝</span>
            {isOpen && <span className="link-text">To-Do List</span>}
          </Link>
        </li>
        <li>
          <Link to="/inprogress">
            <span className="icon">🔄</span>
            {isOpen && <span className="link-text">In Progress</span>}
          </Link>
        </li>
        <li>
          <Link to="/done">
            <span className="icon">✅</span>
            {isOpen && <span className="link-text">Done</span>}
          </Link>
        </li>
        <li>
          <Link to="/pomodoro">
            <span className="icon">⏱</span>
            {isOpen && <span className="link-text">Pomodoro Timer</span>}
          </Link>
        </li>
        <li>
          <Link to="/addevent">
            <span className="icon">📅</span>
            {isOpen && <span className="link-text">Add Event</span>}
          </Link>
        </li>
        <li>
          <Link to="/addtask">
            <span className="icon">➕</span>
            {isOpen && <span className="link-text">Add Task</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;