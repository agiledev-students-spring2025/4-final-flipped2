import React, { useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom"; // Import Link for navigation
import "react-calendar/dist/Calendar.css";

const SimpleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <div className="calendar-container">
      {/* Wrap the navbar icon with Link */}
      <Link to="/sidebar" className="nav-bar">☰</Link> {/* This will link to the sidebar */}

      <h1 className="welcome-text">Welcome To Flipped!</h1>
      <div className="calendar-wrapper">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          showNeighboringMonth={false} // prevents other dates from showing in incorrect month
          tileClassName={({ date, view }) =>
            view === "month" && date.toDateString() === selectedDate.toDateString()
              ? "selected-date"
              : ""
          }
        />
      </div>
      <div className="activities-wrapper">
        <h2>📅 Activities for {selectedDate.toDateString()}</h2>
        <p>No activities added yet.</p>
      </div>
      <Link to="/add-event">
        <button className="floating-button">+</button>
      </Link>
    </div>
  );
};

export default SimpleCalendar;
