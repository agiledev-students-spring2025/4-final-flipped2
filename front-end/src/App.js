import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import ToDo from "./ToDoPage/ToDo";
<<<<<<< HEAD
import PomodoroTimer from "./components/PomodoroTimer"; // Import PomodoroTimer
=======
>>>>>>> origin/master
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="page-links">
          <Link to="/">Home</Link>
          <Link to="/todo">To-Do List</Link>
<<<<<<< HEAD
          <Link to="/pomodoro">Pomodoro Timer</Link> {/* Add this link for Pomodoro */}
=======
>>>>>>> origin/master
        </div>
        <Routes>
          <Route path="/" element={<SimpleCalendar />} />
          <Route path="/todo" element={<ToDo />} />
<<<<<<< HEAD
          <Route path="/pomodoro" element={<PomodoroTimer />} /> {/* Add this route */}
=======
>>>>>>> origin/master
        </Routes>
      </div>
    </Router>
  );
}

export default App;
