import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import connectDB from './db.js';
import Event from './events.js';
import User from './users.js';
import bcrypt from 'bcrypt';
import Task from './task.js';




connectDB();


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
  { id: 1, title: 'Learn React', status: 'todo', deadline: '2025-04-20' },
  { id: 2, title: 'Build a ToDo App', status: 'todo', deadline: '2025-04-21' },
  { id: 3, title: 'Develop Project', status: 'todo', deadline: '2025-04-22' },
  { id: 4, title: 'Fix UI Bugs', status: 'todo', deadline: '2025-04-29' },
  { id: 5, title: 'Add Unit Tests', status: 'todo', deadline: '2025-04-29' },
  { id: 6, title: 'Update Documentation', status: 'todo', deadline: '2025-04-29' },
  { id: 7, title: 'Present to Team', status: 'todo', deadline: '2025-04-26' },
  { id: 8, title: 'Learn Java', status: 'in-progress', deadline: '2025-04-22' },
  { id: 9, title: 'Build a timer App', status: 'in-progress', deadline: '2025-04-26' },
  { id: 10, title: 'Developing', status: 'in-progress', deadline: '2025-04-29' },
  { id: 11, title: 'Fix js Bugs', status: 'in-progress', deadline: '2025-04-23' },
  { id: 12, title: 'Learn python', status: 'done', deadline: '2025-04-25' },
  { id: 13, title: 'Build a add event App', status: 'done', deadline: '2025-05-01' },
  { id: 14, title: 'Fix UX Bugs', status: 'done', deadline: '2025-05-01' }
];

// migrate data
app.post('/api/migrate-tasks', async (req, res) => {
  try {
    // Clear existing tasks
    await Task.deleteMany({});

    // Convert mock data
    const tasksToMigrate = tasks.map(task => ({
      title: task.title,
      status: task.status,
      deadline: new Date(task.deadline)
    }));

    // Insert mock tasks
    const insertedTasks = await Task.insertMany(tasksToMigrate);

    console.log(`Migrated ${insertedTasks.length} tasks to MongoDB`);
    res.json({
      success: true,
      count: insertedTasks.length
    });

  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed',
      details: error.message
    });
  }
});

// Generate new ID
const generateId = () => {
  return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};

let mockUsers = []

app.get('/api/data', (req, res) => {
  res.json({ message: 'My check, does this work?', status: 'success' });
});


app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ status: 'success', message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }
    res.json({ status: 'success', message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get tasks by status
app.get('/api/tasks/:status', async (req, res) => {
  try {
    const status = req.params.status.toLowerCase();
    const tasks = await Task.find({ status })
      .sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a single task by ID
app.get('/api/task/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, status, deadline } = req.body;

    if (!title || !status || !deadline) {
      return res.status(400).json({ error: 'Title, status, and deadline are required' });
    }

    const newTask = new Task({ title, status, deadline });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Update task status
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get calendar data with tasks grouped by date
app.get('/api/calendar', async (req, res) => {
  try {
    const now = new Date();
    const days = [];

    // Get 7 days before today
    for (let i = 7; i > 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    // Add today
    days.push(new Date(now));

    // Add 14 days after today
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      days.push(date);
    }

    // Get all tasks from MongoDB
    const allTasks = await Task.find();

    // Group tasks by date
    const calendarTasks = {};
    days.forEach(date => {
      const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
      calendarTasks[dateKey] = allTasks.filter(task => {
        if (!task.deadline) return false;
        const taskDate = new Date(task.deadline);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      });
    });

    res.json({
      dates: days.map(date => `${date.getMonth() + 1}/${date.getDate()}`),
      tasks: calendarTasks
    });
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({ error: 'Failed to generate calendar' });
  }
});

// end of todo section

// Calendar event section (added for Huy's calendar app)

// get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// get events by date
app.get('/api/events/date/:date', async (req, res) => {
  try {
    const events = await Event.find({ date: req.params.date });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events by date' });
  }
});

// add new event
app.post('/api/events', async (req, res) => {
  const { title, date, time } = req.body;

  console.log("incoming request to create event:", req.body); //to debug DB integration 

  if (!title || !date || !time) {
    console.warn("missing values in event input:", req.body);
    return res.status(400).json({ error: 'title, date, and time all needed.' });
  }

  try {
    const newEvent = new Event({ title, date, time });
    const saved = await newEvent.save();
    console.log("Event saved to MongoDB:", saved); // debug to confirm event was saved to databsed
    res.status(201).json(saved);
  } catch (err) {
    console.error("error saving event:", err); //error with event
    res.status(500).json({ error: 'Failed to save event' });
  }
});


// Update an event
app.put('/api/events/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});


// Pomodoro section implementation

// In-memory store for tracking user sessions by userId and date.
// In production, use a proper database.
const userSessions = {};

// Sample tarot cards and motivational quotes.
const tarotCards = [
  { name: 'The Fool', description: 'A new beginning, having faith in the future.', imageUrl: "/torot-card-folder/The-fool-card.jpg" },
  { name: 'The Magician', description: 'Skill, logic, and intellect.', imageUrl: "/torot-card-folder/The-magician-card.jpg" },
  { name: 'The High Priestess', description: 'Intuition, mystery, and subconscious mind.', imageUrl: "/torot-card-folder/The-high-priesttess-card.jpg" },
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



export { app };
