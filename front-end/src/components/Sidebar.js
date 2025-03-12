import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <h2>Navigation</h2>
      <ul>
        <li><Link to="/">Calendar</Link></li>
        <li><Link to="/pomodoro">Pomodoro Timer</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
