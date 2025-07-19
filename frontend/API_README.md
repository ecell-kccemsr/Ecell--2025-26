# E-Cell Frontend API Integration

This document explains how API integration works in the E-Cell frontend application.

## API Communication Architecture

The frontend communicates with the backend API through Netlify Functions that serve as a proxy:

```
Frontend (React) → Netlify Functions Proxy → Backend API (Render)
```

## Key Files

- `src/services/api.js` - Main API client using axios
- `src/utils/api.js` - Alternative API client with utility functions
- `src/config/api.config.js` - API endpoint configuration
- `netlify/functions/api-proxy.js` - Netlify function that proxies requests to the backend
- `netlify/functions/auth-login.js` - Temporary login function for development

## Environment Variables

- Development (local): `VITE_API_URL=http://localhost:5001`
- Production (Netlify): `VITE_API_URL=/api`

## How It Works

1. Frontend makes requests to `/api/*` endpoints
2. Netlify redirects route these to Netlify Functions
3. Netlify Functions forward the requests to the backend API

## API Path Handling

API paths are structured to work in both development and production:

- In development: Direct calls to `http://localhost:5001/endpoint`
- In production: Calls to `/api/endpoint` which are proxied by Netlify Functions

## Authentication

Authentication is handled by:

1. Sending credentials to `/api/auth/login`
2. Storing the JWT token in localStorage
3. Including the token in the Authorization header for subsequent requests

## Temporary Login Function

During development, you can use these test credentials with the temporary login function:

- Admin: admin@ecell.com / adminpass
- Student: student@ecell.com / studentpass
- Test: test@example.com / testpass

## Troubleshooting

If API calls fail:

1. Check the browser console for errors
2. Verify the correct API URL is being used
3. Check for CORS issues
4. Verify the Netlify Functions are deployed correctly
5. Check if the backend API is accessible
