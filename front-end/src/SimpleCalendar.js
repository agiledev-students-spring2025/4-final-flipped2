import React, { useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom"; // for the sidebar
import "react-calendar/dist/Calendar.css";





const SimpleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="calendar-container">
      <Link to="/sidebar" className="nav-bar">☰</Link>
      <h1 className="welcome-text">Welcome To Flipped!</h1>
      <div className="calendar-wrapper">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          showNeighboringMonth={false} //prevents other dates from showing in incorrect month
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
      <button className="floating-button">+</button>
    </div>
  );
};

export default SimpleCalendar;
