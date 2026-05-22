require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/sequelize');
const errorHandler = require('./middlewares/errorHandler');

// Models
require('./models');

// Routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const voteRoutes = require('./routes/votes');
const userRoutes = require('./routes/users');
const tagRoutes = require('./routes/tags');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Uncomment to sync database (for development only)
    // await sequelize.sync({ alter: true });
    // console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
