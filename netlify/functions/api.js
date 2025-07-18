
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Connect to MongoDB
let mongoConnected = false;
const connectToMongo = async () => {
  if (mongoConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    mongoConnected = true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

// Routes
app.use('/auth', require('../../routes/auth'));
app.use('/users', require('../../routes/users'));
app.use('/events', require('../../routes/events'));
app.use('/todos', require('../../routes/todos'));
app.use('/meetings', require('../../routes/meetings'));
app.use('/notifications', require('../../routes/notifications'));
app.use('/calendar', require('../../routes/calendar'));
app.use('/contact', require('../../routes/contact'));

// Health check endpoint
app.get('/', async (req, res) => {
  await connectToMongo();
  
  let cloudinaryStatus = 'Not initialized';
  try {
    const { cloudinary } = require('../../config/cloudinary');
    cloudinaryStatus = cloudinary.config().cloud_name ? 'Configured' : 'Not configured';
  } catch (error) {
    cloudinaryStatus = `Error: ${error.message}`;
  }
  
  res.status(200).json({
    message: 'E-Cell API is running on Netlify Functions',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    cloudinary: cloudinaryStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to MongoDB on cold start
connectToMongo();

// Export the serverless function
exports.handler = serverless(app, {
  basePath: '/'
});
