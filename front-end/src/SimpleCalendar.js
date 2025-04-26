import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import Sidebar from "./Sidebar";
import "react-calendar/dist/Calendar.css";

const SimpleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
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
  }, [location]);

  const eventsForSelectedDate = events.filter(
    (event) => event.date === formattedSelectedDate
  );

  const handleUpdate = () => {
    const userEmail = localStorage.getItem('userEmail');
    fetch(`http://localhost:5001/api/events/date/${editingEvent.date}?userEmail=${encodeURIComponent(userEmail)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingEvent),
    })
      .then(() => {
        setEditingEvent(null);
        fetchEvents();
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const handleDelete = () => {
    fetch(`http://localhost:5001/api/events/${editingEvent._id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEditingEvent(null);
        fetchEvents();
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div className="calendar-container">
      {/* Sidebar toggle button */}
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>☰</button>

      {showSidebar && (
        <div className="sidebar-overlay">
          <Sidebar />
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>
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
                onClick={() => setEditingEvent({ ...event })}
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

      {editingEvent && (
        <div className="popup-overlay">
          <h2 className="popup-title">Edit Event</h2>
          <div className="popup-content">
            <div className="form-group">
              <label>Event:</label>
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
              />
              <br /><br />
              <label>Date:</label>
              <input
                type="date"
                value={editingEvent.date}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, date: e.target.value })
                }
              />
              <br /><br />
              <label>Time:</label>
              <input
                type="time"
                value={editingEvent.time}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, time: e.target.value })
                }
              />
            </div>
            <div className="button-container">
              <button
                className="cancel-button"
                onClick={() => setEditingEvent(null)}
              >
                Cancel
              </button>
              <button className="cancel-button" onClick={handleDelete}>
                Delete
              </button>
              <button className="save-button" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCalendar;
