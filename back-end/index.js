import app from './server.js';

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
