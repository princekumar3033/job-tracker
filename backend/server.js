const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow CORS for easy frontend consumption
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Job Application Tracker API' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Database and Server Start Up Helper
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  let mongoUri = process.env.MONGO_URI;
  let mongoServer = null;

  try {
    // If no custom MONGO_URI is found, spin up MongoMemoryServer
    if (!mongoUri) {
      console.log('===================================================');
      console.log('No MONGO_URI found in .env.');
      console.log('Spinning up an in-memory MongoDB instance...');
      console.log('===================================================');
      
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      
      console.log(`In-memory MongoDB running at: ${mongoUri}`);
    } else {
      console.log('Connecting to user-provided MongoDB URI...');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Mongoose connected successfully to MongoDB.');

    // Listen on PORT
    const server = app.listen(PORT, () => {
      console.log(`Express Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log('Press Ctrl+C to terminate.');
    });

    // Graceful Shutdown
    const gracefulShutdown = async () => {
      console.log('\nShutting down server gracefully...');
      server.close(async () => {
        await mongoose.disconnect();
        if (mongoServer) {
          await mongoServer.stop();
          console.log('In-memory MongoDB server stopped.');
        }
        console.log('Server process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
