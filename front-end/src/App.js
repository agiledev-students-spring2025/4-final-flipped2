import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SimpleCalendar from "./SimpleCalendar";
import Loginpage from "./LoginandSignup/Loginpage";
import Signuppage from "./LoginandSignup/Signuppage";
import ToDo from "./ToDoPage/ToDo";
import InProgress from "./ToDoPage/InProgress";
import Done from "./ToDoPage/Done";
import PomodoroTimer from "./PomodoroTimer";
import AddTaskPopup from "./AddTaskPopup";
import AddEventPopup from "./AddEventPopup";
import Sidebar from "./Sidebar";

import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = (eventData) => {
    fetch("http://localhost:5001/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    })
      .then(response => response.json())
      .then(data => {
        // Update local state with the event returned from the backend
        setEvents((prev) => [...prev, data]);
      })
      .catch(error => console.error("Error adding event:", error));
  };

  const handleEditEvent = (updatedEvent) => {
    fetch(`http://localhost:5001/api/events/${updatedEvent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent)
    })
      .then(response => response.json())
      .then(data => {
        setEvents((prev) =>
          prev.map(event => (event.id === data.id ? data : event))
        );
        setEditingEvent(null);
      })
      .catch(error => console.error("Error updating event:", error));
  };

  const handleDeleteEvent = (index) => {
    fetch(`http://localhost:5001/api/events/${eventId}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(() => {
        setEvents((prev) => prev.filter(event => event.id !== eventId));
        setEditingEvent(null);
      })
      .catch(error => console.error("Error deleting event:", error));
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route
            path="/calendar"
            element={
              <SimpleCalendar
                events={events}
                onEditEvent={(event, index) => setEditingEvent({ ...event, index })}
              />
            }
          />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/done" element={<Done />} />
          <Route path="/addtask" element={<AddTaskPopup />} />
          <Route path="/addevent" element={<AddEventPopup onSave={handleAddEvent} />} />
        </Routes>

        {editingEvent && (
          <AddEventPopup
            eventData={editingEvent}
            onSave={handleEditEvent}
            onDelete={() => handleDeleteEvent(editingEvent.index)}
            onClose={() => setEditingEvent(null)}
            isEditing
          />
        )}
      </div>
    </Router>
  );
}

export default App;
