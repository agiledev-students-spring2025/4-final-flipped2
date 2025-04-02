// server.mjs
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// In-memory store for tracking user sessions by userId and date.
// In production, use a proper database.
const userSessions = {};
let mockUsers = [];

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

// Test endpoint.
app.get('/', (req, res) => {
  res.send('basic app route is running');
});
app.get('/pomodoro', (req, res) => {
  res.send('Flipped Pomodoro is running');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Check to see if it works', status: 'success' });
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

export default app; 

