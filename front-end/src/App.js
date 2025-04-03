import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import Loginpage from "./LoginandSignup/Loginpage";
import Signuppage from "./LoginandSignup/Signuppage";
import ToDo from "./ToDoPage/ToDo";
import InProgress from "./ToDoPage/InProgress";
import Done from "./ToDoPage/Done";
import PomodoroTimer from "./PomodoroTimer"; // Import PomodoroTimer
import AddTaskPopup from "./AddTaskPopup";
import AddEventPopup from "./AddEventPopup";
import Sidebar from "./Sidebar"; // Import Sidebar
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
        <Route path="/" element={<Loginpage />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/calendar" element={<SimpleCalendar />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} /> 
  
          <Route path="/todo" element={<ToDo />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/done" element={<Done />} />
          <Route path="/addtask" element={<AddTaskPopup />} />
          <Route path="/addevent" element={<AddEventPopup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
