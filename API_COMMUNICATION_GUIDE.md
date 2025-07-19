# API Communication Architecture Guide

This document explains the architecture of API communication between the frontend (Netlify) and backend (Render) for the E-Cell website, including how Netlify Functions are used to proxy requests.

## Overview

The E-Cell website consists of:
- **Frontend**: React application hosted on Netlify
- **Backend**: Express.js API hosted on Render
- **API Proxy**: Netlify Functions to handle cross-origin communication

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                 │     │                  │     │                  │
│  React Frontend ├────►│  Netlify Function├────►│   Express.js     │
│  (Netlify)      │     │  (API Proxy)     │     │   Backend (Render)│
│                 │     │                  │     │                  │
└─────────────────┘     └──────────────────┘     └──────────────────┘
        ▲                                                │
        │                                                │
        └────────────────────────────────────────────────┘
                        (Direct API requests when in local development)
```

## Frontend API Client

The frontend uses an axios-based API client to make requests to the backend. In production, requests are sent to the Netlify Functions proxy, which forwards them to the Render backend.

### API Client Configuration (`frontend/src/services/api.js`)

```javascript
import axios from 'axios';

// API base URL is loaded from environment variables
// In development: http://localhost:5001
// In production: /api (which gets redirected to the Netlify Function)
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors, etc.
    return Promise.reject(error);
  }
);

export default api;
```

### API Endpoints Configuration (`frontend/src/config/api.config.js`)

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  events: {
    getAll: `${API_BASE_URL}/events`,
    getById: (id) => `${API_BASE_URL}/events/${id}`,
    create: `${API_BASE_URL}/events`,
    update: (id) => `${API_BASE_URL}/events/${id}`,
    delete: (id) => `${API_BASE_URL}/events/${id}`,
  },
  // Other endpoints...
};
```

## Netlify Function API Proxy

The Netlify Function acts as a proxy to forward requests from the frontend to the backend. This approach solves CORS issues and allows for additional processing of requests if needed.

### API Proxy Function (`frontend/netlify/functions/api-proxy.js`)

```javascript
const axios = require('axios');

// Backend URL is loaded from environment variables
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5001';

// CORS headers for cross-origin requests
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }

  try {
    // Get the request path (after /api/)
    const path = event.path.replace('/.netlify/functions/api-proxy', '');
    
    // Handle different path patterns for different types of requests
    let url;
    
    // For auth endpoints
    if (path.includes('/auth')) {
      url = `${BACKEND_URL}/api${path}`;
    } else {
      // Normal case - adjust path to avoid duplicate /api
      const adjustedPath = path.replace(/^\/api/, '');
      url = `${BACKEND_URL}/api${adjustedPath}`;
    }

    // Forward the request to the backend API with the same method, headers, and body
    const response = await axios({
      method: event.httpMethod,
      url: url,
      headers: {
        ...event.headers,
        host: new URL(BACKEND_URL).host // Replace the host header
      },
      data: event.body ? JSON.parse(event.body) : null
    });

    // Return the response from the backend API
    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': response.headers['content-type']
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    // Handle errors
    console.log('API Proxy Error:', error);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        message: error.response?.data?.message || 'Internal Server Error',
        error: error.message
      })
    };
  }
};
```

### Netlify Configuration (`frontend/netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api-proxy/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Backend API Structure

The backend API is structured with routes organized by feature. Routes are mounted with the `/api` prefix.

### Backend API Routes (`backend/src/routes/index.js`)

```javascript
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const eventRoutes = require('./event.routes');
// Other route imports...

// Mount routes with prefixes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
// Other routes...

module.exports = router;
```

### Server Configuration (`backend/src/server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Mount API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
```

## Path Handling and URL Structure

Understanding path handling is crucial for proper API communication:

1. **Frontend API Request**: 
   - In development: `http://localhost:5001/auth/login`
   - In production: `/api/auth/login` (redirected to Netlify Function)

2. **Netlify Function Path Handling**:
   - Receives: `/api/auth/login`
   - Forwards to backend: `https://kcecell-backend-api.onrender.com/api/auth/login`
   - Note: Path handling logic adjusts paths to avoid duplicate `/api` prefixes

3. **Backend Route Handling**:
   - Routes defined without `/api` prefix: `/auth/login`
   - Routes mounted with `/api` prefix: `app.use('/api', routes);`
   - Final backend path: `/api/auth/login`

## Authentication Flow

The API communication includes authentication flow:

1. **Login Request**:
   - Frontend sends credentials to `/api/auth/login`
   - Netlify Function forwards to backend
   - Backend validates and returns JWT token

2. **Authenticated Requests**:
   - Frontend stores JWT token in localStorage
   - API client adds token to Authorization header
   - Netlify Function forwards the header to backend
   - Backend validates token and processes request

## Environment Variables

Environment variables control the API communication:

### Frontend Environment Variables:

- `.env.development`: 
  ```
  VITE_API_URL=http://localhost:5001
  ```

- `.env.production`:
  ```
  VITE_API_URL=/api
  ```

### Netlify Environment Variables:

- `BACKEND_API_URL=https://kcecell-backend-api.onrender.com`

### Backend Environment Variables:

- `PORT=5001`
- `FRONTEND_URL=https://kcecell001.netlify.app`
- `JWT_SECRET=your_jwt_secret`
- Other variables (MongoDB, Cloudinary, etc.)

## Debugging API Communication

To debug API communication issues:

1. Use the API tester tool (`/api-tester.html`)
2. Check network requests in browser developer tools
3. Run the backend health check script (`check-backend-health.sh`)
4. Test direct communication with backend to verify CORS
5. Check logs in Netlify and Render dashboards

## Local Development

For local development:

1. Frontend runs at `http://localhost:3000`
2. Backend runs at `http://localhost:5001`
3. Frontend makes direct requests to backend
4. CORS is configured to allow requests from localhost
5. Use the `run-local.sh` script to start both servers

---

This architecture provides a secure and efficient way to handle API communication between the frontend and backend, even when they are hosted on different platforms.
