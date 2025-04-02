import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import ToDo from "./ToDoPage/ToDo";
import InProgress from "./ToDoPage/InProgress";
import Done from "./ToDoPage/Done";
import PomodoroTimer from "./components/PomodoroTimer"; // Import PomodoroTimer
import "./App.css";


function App() {
  return (
    <Router>
      <div className="app-container">
      {/*
      <div className="page-links">
          <Link to="/">Home</Link>
          <Link to="/todo">To-Do List</Link>
          <Link to="/pomodoro">Pomodoro Timer</Link>
      </div>
      */}
        <Routes>
          <Route path="/" element={<SimpleCalendar />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} /> {/* Add this route */}
          
          <Route path="/todo" element={<ToDo />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/done" element={<Done />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
