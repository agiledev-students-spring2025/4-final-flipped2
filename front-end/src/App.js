import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import ToDo from "./ToDoPage/ToDo";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="page-links">
          <Link to="/">Home</Link>
          <Link to="/todo">To-Do List</Link>
        </div>
        <Routes>
          <Route path="/" element={<SimpleCalendar />} />
          <Route path="/todo" element={<ToDo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
