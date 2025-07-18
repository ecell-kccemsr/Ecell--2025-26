// setup-netlify-functions.js
const fs = require('fs-extra');
const path = require('path');

// Paths
const backendDir = path.join(__dirname, 'backend');
const netlifyFunctionsDir = path.join(__dirname, 'netlify', 'functions');

// Create netlify/functions directory if it doesn't exist
fs.ensureDirSync(netlifyFunctionsDir);

// Copy shared backend code
const sharedDirs = ['config', 'models', 'middleware', 'services', 'utils'];
for (const dir of sharedDirs) {
  if (fs.existsSync(path.join(backendDir, dir))) {
    fs.copySync(
      path.join(backendDir, dir),
      path.join(__dirname, 'netlify', dir)
    );
    console.log(`✅ Copied ${dir} directory to netlify/`);
  }
}

// Create the API function (main entry point)
const apiFunction = `
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
    cloudinaryStatus = \`Error: \${error.message}\`;
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
`;

// Write the API function
fs.writeFileSync(
  path.join(netlifyFunctionsDir, 'api.js'),
  apiFunction
);
console.log('✅ Created API function at netlify/functions/api.js');

// Create individual endpoint functions for specific routes
// Create package.json for functions
const functionsPackageJson = {
  "name": "ecell-netlify-functions",
  "version": "1.0.0",
  "description": "E-Cell API as Netlify Functions",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.3",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "serverless-http": "^3.2.0"
  }
};

fs.writeFileSync(
  path.join(netlifyFunctionsDir, 'package.json'),
  JSON.stringify(functionsPackageJson, null, 2)
);
console.log('✅ Created package.json for functions');

console.log('✅ Netlify Functions setup complete!');
