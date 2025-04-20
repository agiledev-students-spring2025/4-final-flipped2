import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "./Sidebar"; 

const SimpleCalendar = ({ onEditEvent }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const formattedSelectedDate = formatDate(selectedDate);

  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Expected array but got:", data);
          setEvents([]);
        }
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setEvents([]);
      });
  }, [location]);

  const eventsForSelectedDate = events.filter(
    (event) => event.date === formattedSelectedDate
  );

  return (
    <div className="calendar-container">
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {showSidebar && (
        <div className="sidebar-overlay">
          <Sidebar />
          <button className="close-sidebar-btn" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
      )}

      <h1 className="welcome-text">Welcome To Flipped!</h1>
      <div className="calendar-wrapper">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          showNeighboringMonth={false}
          tileClassName={({ date, view }) =>
            view === "month" && formatDate(date) === formattedSelectedDate
              ? "selected-date"
              : ""
          }
        />
      </div>
      <div className="activities-wrapper">
        <h2>📅 Activities for {selectedDate.toDateString()}</h2>
        {eventsForSelectedDate.length > 0 ? (
          <div className="event-list">
            {eventsForSelectedDate.map((event) => (
              <div
                key={event._id}
                className="event-card"
                onClick={() => onEditEvent(event)}
              >
                <div className="event-title">{event.title}</div>
                <div className="event-time">🕒 {event.time}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No activities added yet.</p>
        )}
      </div>
      <Link to="/addevent">
        <button className="floating-button">+</button>
      </Link>
    </div>
  );
};

export default SimpleCalendar;
