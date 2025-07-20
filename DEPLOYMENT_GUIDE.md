# Deployment Guide for E-Cell Website

This guide provides comprehensive instructions for deploying both the frontend and backend components of the E-Cell website, along with troubleshooting steps for common issues.

## Table of Contents

1. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Environment Configuration](#environment-configuration)
4. [API Integration](#api-integration)
5. [CORS Configuration](#cors-configuration)
6. [Debugging Tools](#debugging-tools)
7. [Troubleshooting](#troubleshooting)

## Frontend Deployment (Netlify)

### Prerequisites

- GitHub repository with your frontend code
- Netlify account
- Node.js and npm/yarn installed locally

### Deployment Steps

1. **Prepare your frontend code for production:**

   Update your `.env` files to use the correct API URLs:

   ```
   # .env.production
   VITE_API_URL=/api

   # .env.development
   VITE_API_URL=http://localhost:5001
   ```

2. **Configure Netlify Functions:**

   Make sure the `netlify.toml` file is in your project root:

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

3. **Deploy to Netlify:**

   - Connect your GitHub repository to Netlify
   - Configure the build settings:
     - Build command: `npm run build` or `yarn build`
     - Publish directory: `dist`
   - Add the following environment variables:
     - `BACKEND_API_URL`: `https://kcecell-backend-api.onrender.com`

4. **Verify the deployment:**
   - Check if the site is accessible
   - Test API connections using the provided API tester tool (`/api-tester.html`)

## Backend Deployment (Render)

### Prerequisites

- GitHub repository with your backend code
- Render account
- MongoDB Atlas account (for database)
- Cloudinary account (for image hosting)

### Deployment Steps

1. **Prepare your backend code for production:**

   Create a `.env` file with the following variables:

   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=https://kcecell001.netlify.app
   ```

2. **Set up Render Web Service:**

   - Connect your GitHub repository
   - Configure the service:
     - Name: `kcecell-backend-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start` or `node server.js`
   - Add all the environment variables from your `.env` file

3. **Configure CORS:**

   Make sure your backend has proper CORS configuration:

   ```javascript
   app.use(
     cors({
       origin: process.env.FRONTEND_URL || "http://localhost:3000",
       credentials: true,
     })
   );
   ```

4. **Verify the deployment:**
   - Test the health endpoint: `https://kcecell-backend-api.onrender.com/health`
   - Test API endpoints using the provided backend health check script

## Environment Configuration

### Frontend Environment Variables

- `VITE_API_URL`: URL for API requests (development: `http://localhost:5001`, production: `/api`)

### Backend Environment Variables

- `PORT`: Server port (default: 5001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `FRONTEND_URL`: URL of the frontend application (for CORS)

## API Integration

### Frontend API Configuration

The frontend uses axios to make API requests. The configuration is in:

- `src/services/api.js` - API client setup
- `src/config/api.config.js` - API endpoints configuration

When making requests, ensure:

1. Base URL is correctly set
2. Authentication headers are included if needed
3. Error handling is implemented

### Backend API Structure

The backend API follows a RESTful structure:

- `GET /health` - Check server health
- `POST /api/auth/login` - User login
- `GET /api/events` - Get events
- ... (other endpoints)

## CORS Configuration

CORS (Cross-Origin Resource Sharing) is critical for communication between frontend and backend when they are on different domains.

### Backend CORS Configuration

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### Netlify Functions CORS

For Netlify functions, add the following headers:

```javascript
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// For OPTIONS requests
if (event.httpMethod === "OPTIONS") {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Successful preflight" }),
  };
}
```

## Debugging Tools

### API Tester Tool

The frontend includes an API tester tool at `/api-tester.html` that allows you to test endpoints in both local and production environments.

### Backend Health Check Script

The repository includes a backend health check script (`check-backend-health.sh`) that tests various backend endpoints and configurations.

To use:

```bash
./check-backend-health.sh
```

## Troubleshooting

### Common Issues and Solutions

1. **404 Not Found for API Routes**

   - Check if the routes are correctly defined in the backend
   - Verify that API paths in the frontend match backend routes
   - Ensure Netlify redirects are properly configured

2. **CORS Errors**

   - Verify CORS configuration in the backend
   - Check if the frontend URL is correctly set in the backend environment variables
   - Ensure Netlify functions have proper CORS headers

3. **Authentication Issues**

   - Check if JWT tokens are being correctly generated and validated
   - Verify that auth headers are included in API requests

4. **API Proxy Issues in Netlify Functions**

   - Check `api-proxy.js` for correct path handling
   - Ensure the backend URL is correctly set
   - Verify that the proxy function is correctly forwarding all headers and body

5. **Backend Not Accessible**
   - Check if Render service is running
   - Verify network settings and firewall configurations
   - Test basic endpoints like `/health` to confirm the server is responding

### Path Handling Checklist

When troubleshooting API path issues:

1. Check backend route definitions (usually in route files)
2. Verify API client configuration in the frontend
3. Check Netlify function path handling in `api-proxy.js`
4. Test different path patterns (with and without `/api` prefix)
5. Use the API tester tool to identify which paths work

### Server Communication Testing

For diagnosing server communication problems:

1. Run the backend health check script
2. Use the API tester to test specific endpoints
3. Check network requests in browser developer tools
4. Verify environment variables are correctly set

---

If you encounter issues not covered in this guide, please check the application logs on both Netlify and Render, or contact the development team for assistance.
