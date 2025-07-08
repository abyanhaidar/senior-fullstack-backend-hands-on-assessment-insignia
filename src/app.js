const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use('/api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
