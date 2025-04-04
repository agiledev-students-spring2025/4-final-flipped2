import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

// Middleware to parse JSON bodies (if needed)
app.use(express.json());

// Todo API start

// Mock database
let tasks = [
  { id: 1, title: 'Learn React', status: 'todo', deadline: '2025-03-18' },
  { id: 2, title: 'Build a ToDo App', status: 'todo', deadline: '2025-03-19' },
  { id: 3, title: 'Develop Project', status: 'todo', deadline: '2025-03-19' },
  { id: 4, title: 'Fix UI Bugs', status: 'todo', deadline: '2025-03-20' },
  { id: 5, title: 'Add Unit Tests', status: 'todo', deadline: '2025-03-20' },
  { id: 6, title: 'Update Documentation', status: 'todo', deadline: '2025-03-21' },
  { id: 7, title: 'Present to Team', status: 'todo', deadline: '2025-03-21' },
  { id: 8, title: 'Learn Java', status: 'in-progress', deadline: '2025-03-18' },
  { id: 9, title: 'Build a timer App', status: 'in-progress', deadline: '2025-03-19' },
  { id: 10, title: 'Developing', status: 'in-progress', deadline: '2025-03-19' },
  { id: 11, title: 'Fix js Bugs', status: 'in-progress', deadline: '2025-03-20' },
  { id: 12, title: 'Learn python', status: 'done', deadline: '2025-03-18' },
  { id: 13, title: 'Build a add event App', status: 'done', deadline: '2025-03-19' },
  { id: 14, title: 'Fix UX Bugs', status: 'done', deadline: '2025-03-20' }
];

// Generate new ID
const generateId = () => {
  return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get tasks by status
app.get('/api/tasks/:status', (req, res) => {
  const status = req.params.status;
  const filteredTasks = tasks.filter(task => task.status === status)
                            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  res.json(filteredTasks);
});

// Get a single task by ID
app.get('/api/task/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
      res.json(task);
  } else {
      res.status(404).json({ error: 'Task not found' });
  }
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, status, deadline } = req.body;
  
  if (!title || !status || !deadline) {
      return res.status(400).json({ error: 'Title, status, and deadline are required' });
  }
  
  const newTask = {
      id: generateId(),
      title,
      status,
      deadline
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, status, deadline } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      status: status || tasks[taskIndex].status,
      deadline: deadline || tasks[taskIndex].deadline
  };
  
  res.json(tasks[taskIndex]);
});

// Update task status
app.patch('/api/tasks/:id/status', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { status } = req.body;
  
  if (!status) {
      return res.status(400).json({ error: 'Status is required' });
  }
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex].status = status;
  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);
});

// Get calendar data with tasks grouped by date
app.get('/api/calendar', (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Generate calendar dates (similar to front-end logic)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const numDaysInMonth = lastDayOfMonth.getDate();
  
  const days = [];
  for (let i = 1; i <= numDaysInMonth; i++) {
      days.push(new Date(year, month, i));
  }
  
  for (let i = 0; i < startDay; i++) {
      days.unshift(new Date(year, month, -i));
  }
  
  const endDay = lastDayOfMonth.getDay();
  for (let i = 1; i <= 6 - endDay; i++) {
      days.push(new Date(year, month + 1, i));
  }
  
  // Group tasks by date
  const calendarTasks = {};
  days.forEach(date => {
      const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
      calendarTasks[dateKey] = tasks.filter(task => {
          const [year, month, day] = task.deadline.split('-').map(Number);
          const taskDate = new Date(year, month - 1, day);
          const taskKey = `${taskDate.getMonth() + 1}/${taskDate.getDate()}`;
          return taskKey === dateKey;
      });
  });
  
  res.json({
      dates: days.map(date => `${date.getMonth() + 1}/${date.getDate()}`),
      tasks: calendarTasks
  });
});

// end of todo section

// Pomodoro section implementation

// In-memory store for tracking user sessions by userId and date.
// In production, use a proper database.
const userSessions = {};

// Sample tarot cards and motivational quotes.
const tarotCards = [
  { name: 'The Fool', description: 'A new beginning, having faith in the future.' },
  { name: 'The Magician', description: 'Skill, logic, and intellect.' },
  { name: 'The High Priestess', description: 'Intuition, mystery, and subconscious mind.' },
];

const motivationalQuotes = [
  'Believe in yourself!',
  'Keep pushing forward!',
  'Every step is progress!',
];

// Helper function to check if it’s the user’s first session today.
const isFirstSessionToday = (userId) => {
  const today = new Date().toDateString();
  return !userSessions[userId] || userSessions[userId] !== today;
};

// Endpoint to start a session.
app.post('/api/start-session', (req, res) => {
  const { userId } = req.body;
  // Here you might log the session start time and perform any other logic.
  res.json({ message: 'Session started successfully.' });
});

// Endpoint to end a session and return a reward.
app.post('/api/end-session', (req, res) => {
  const { userId } = req.body;
  const today = new Date().toDateString();
  let reward;

  if (isFirstSessionToday(userId)) {
    // Mark that the user has completed a session today.
    userSessions[userId] = today;
    // Reward with a random tarot card.
    reward = tarotCards[Math.floor(Math.random() * tarotCards.length)];
  } else {
    // Reward with a motivational quote.
    reward = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }
  
  res.json({ message: 'Session ended successfully.', reward });
});

// Common routes
app.get('/', (req, res) => {
  res.send('basic app route is running');
});
app.get('/pomodoro', (req, res) => {
  res.send('Flipped Pomodoro is running');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {app};