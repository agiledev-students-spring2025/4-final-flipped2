import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import ToDo from "./ToDoPage/ToDo";
import InProgress from "./ToDoPage/InProgress";
import Done from "./ToDoPage/Done";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SimpleCalendar />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/done" element={<Done />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;