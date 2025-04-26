import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const fetchEvents = () => {
    const userEmail = localStorage.getItem('userEmail');
    fetch(`http://localhost:5001/api/events?userEmail=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else setEvents([]);
      })
      .catch(() => setEvents([]));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="all-events-container">
      {/* Sidebar toggle button */}
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>☰</button>

      {showSidebar && (
        <div className="sidebar-overlay">
          <Sidebar />
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>
        </div>
      )}

      <h1 className="welcome-text">All Events & Tasks</h1>

      <div className="events-list-wrapper">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-title">📌 {event.title}</div>
              <div className="event-date">📅 {event.date}</div>
              <div className="event-time">🕒 {event.time}</div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>

      <Link to="/calendar">
        <button className="back-button">Back to Calendar</button>
      </Link>
    </div>
  );
};

export default AllEvents;
