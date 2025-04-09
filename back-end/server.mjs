import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware to parse JSON bodies (if needed)
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front-end/public')));
app.use(express.static(path.join(__dirname, '../front-end/src')));

// Todo API start

// Mock database
let tasks = [
  { id: 1, title: 'Learn React', status: 'todo', deadline: '2025-03-30' },
  { id: 2, title: 'Build a ToDo App', status: 'todo', deadline: '2025-03-31' },
  { id: 3, title: 'Develop Project', status: 'todo', deadline: '2025-03-31' },
  { id: 4, title: 'Fix UI Bugs', status: 'todo', deadline: '2025-03-31' },
  { id: 5, title: 'Add Unit Tests', status: 'todo', deadline: '2025-03-31' },
  { id: 6, title: 'Update Documentation', status: 'todo', deadline: '2025-04-01' },
  { id: 7, title: 'Present to Team', status: 'todo', deadline: '2025-04-01' },
  { id: 8, title: 'Learn Java', status: 'in-progress', deadline: '2025-04-01' },
  { id: 9, title: 'Build a timer App', status: 'in-progress', deadline: '2025-04-02' },
  { id: 10, title: 'Developing', status: 'in-progress', deadline: '2025-04-03' },
  { id: 11, title: 'Fix js Bugs', status: 'in-progress', deadline: '2025-04-05' },
  { id: 12, title: 'Learn python', status: 'done', deadline: '2025-04-06' },
  { id: 13, title: 'Build a add event App', status: 'done', deadline: '2025-04-07' },
  { id: 14, title: 'Fix UX Bugs', status: 'done', deadline: '2025-04-08' }
];

// Generate new ID
const generateId = () => {
  return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};

let mockUsers = []

app.get('/api/data', (req, res) => {
  res.json({ message: 'My check, does this work?', status: 'success' });
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  const userExists = mockUsers.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ status: 'fail', message: 'User already exists' });
  }
  mockUsers.push({ email, password });
  res.json({ status: 'success', message: 'User registered' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(user => user.email === email && user.password === password);
  if (user) {
    res.json({ status: 'success', message: 'Login successful' });
  } else {
    res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
  }
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get tasks by status
app.get('/api/tasks/:status', (req, res) => {
  const status = req.params.status.toLowerCase();
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

// Calendar event section (added for Huy's calendar app)

let events = [
  { id: 1, title: "Doctor Appointment", date: "2025-04-08", time: "14:00" },
  { id: 2, title: "Meeting with Team", date: "2025-04-09", time: "10:00" }
];

const generateEventId = () => {
  return events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
};

// Get all events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// Get events by date
app.get('/api/events/date/:date', (req, res) => {
  const { date } = req.params;
  const result = events.filter(event => event.date === date);
  res.json(result);
});

// Add new event
app.post('/api/events', (req, res) => {
  const { title, date, time } = req.body;
  
  if (!title || !date || !time) {
    return res.status(400).json({ error: 'Title, date, and time are required.' });
  }

  const newEvent = {
    id: generateEventId(),
    title,
    date,
    time
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, date, time } = req.body;
  const index = events.findIndex(e => e.id === eventId);

  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  events[index] = {
    ...events[index],
    title: title || events[index].title,
    date: date || events[index].date,
    time: time || events[index].time
  };

  res.json(events[index]);
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === eventId);

  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const deleted = events.splice(index, 1);
  res.json(deleted[0]);
});

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

// Static Files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front-end/public/index.js'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



export {app};
