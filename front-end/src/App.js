import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ToDo from './ToDoPage/ToDo';
import InProgress from './ToDoPage/InProgress';
import Done from './ToDoPage/Done';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/todo" element={<ToDo />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/done" element={<Done />} />
          <Route path="/" element={<TodoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Todo page
function TodoPage() {
  return (
    <div>
      <h1>Home</h1>
      <a href="/todo">
        <button>Todo Page</button>
      </a>
      <a href="/inprogress">
        <button>In Progress Page</button>
      </a>
      <a href="/done">
        <button>Done Page</button>
      </a>
    </div>
  );
}

export default App;