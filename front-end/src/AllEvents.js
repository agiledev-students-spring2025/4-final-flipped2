import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const fetchEvents = () => {
    const userEmail = localStorage.getItem('userEmail');
    fetch(`${process.env.REACT_APP_API_URL}/api/events?userEmail=${encodeURIComponent(userEmail)}`)
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

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="all-events-container">
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>☰</button>

      {showSidebar && (
        <div className="sidebar-overlay">
          <Sidebar />
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>
        </div>
      )}

      <h1 className={`welcome-text ${showSidebar ? "with-sidebar" : ""}`}>
       🗂️ All Events & Tasks
      </h1>


      <div className="events-list-wrapper">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-date-time">
                <span className="event-date">{event.date}</span> | <span className="event-time">{event.time}</span>
              </div>
              <div className="event-title">{event.title}</div>
            </div>
          ))
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>

      <Link to="/">
        <button className="back-button">⬅ Back to Calendar</button>
      </Link>
    </div>
  );
};

export default AllEvents;
