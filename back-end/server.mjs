import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies (if needed)
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('Express server is running using ES modules!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
