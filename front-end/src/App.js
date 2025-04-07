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
    setEvents((prev) => [...prev, eventData]);
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event, idx) => (idx === updatedEvent.index ? updatedEvent : event))
    );
    setEditingEvent(null);
  };

  const handleDeleteEvent = (index) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
    setEditingEvent(null);
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