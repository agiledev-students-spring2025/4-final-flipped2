import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ToDo from "./ToDoPage/ToDo.js";

const SimpleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showToDo, setShowToDo] = useState(false);
  
  return (
    <div className="calendar-container">
      <div className="nav-bar">☰</div>
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
      <button className="floating-button" onClick={() => {
        window.location.href = '/todo';
      }}>+</button>
    </div>
  );
};

export default SimpleCalendar;
