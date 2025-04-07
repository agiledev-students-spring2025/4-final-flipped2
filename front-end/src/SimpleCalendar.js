import React, { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SimpleCalendar = ({ events, onEditEvent }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const formattedSelectedDate = formatDate(selectedDate);

  const eventsForSelectedDate = events
    .map((event, index) => ({ ...event, index }))
    .filter((event) => event.date === formattedSelectedDate);

  return (
    <div className="calendar-container">
      <Link to="/sidebar" className="nav-bar">☰</Link>
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
                key={event.index}
                className="event-card"
                onClick={() => onEditEvent(event, event.index)}
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
