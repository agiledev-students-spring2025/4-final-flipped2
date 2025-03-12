import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import PomodoroTimer from './components/PomodoroTimer';
import Sidebar from './components/Sidebar';
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SimpleCalendar />} /> {/* Main Calendar Page */}
          <Route path="/sidebar" element={<Sidebar />} /> {/* Sidebar Page */}
          <Route path="/pomodoro" element={<PomodoroTimer />} /> {/* Optional: Pomodoro Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
