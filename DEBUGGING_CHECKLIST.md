# Debugging Checklist for E-Cell Website

This checklist is designed to help you systematically diagnose and fix common issues with the E-Cell website deployment, focusing on the integration between the frontend (Netlify) and backend (Render).

## Quick Reference

- **Frontend URL**: https://kcecell001.netlify.app
- **Backend URL**: https://kcecell-backend-api.onrender.com
- **API Tester**: https://kcecell001.netlify.app/api-tester.html

## Step 1: Verify Services Are Running

- [ ] Check if Netlify frontend is accessible
- [ ] Verify Render backend is running (`/health` endpoint)
- [ ] Confirm that MongoDB Atlas is operational
- [ ] Check that Cloudinary services are working

## Step 2: Test Basic API Communication

- [ ] Run the backend health check script: `./check-backend-health.sh`
- [ ] Check the API tester tool: `/api-tester.html`
- [ ] Verify both local and production environments
- [ ] Test direct communication with backend (CORS test)

## Step 3: Check API Paths and Routing

Paths can be a common source of issues. Verify the following:

- [ ] Backend routes are correctly defined with proper prefixes:

  ```javascript
  // Should be defined as:
  router.post("/login", authController.login);
  // And mounted as:
  app.use("/api/auth", authRouter);
  ```

- [ ] Frontend API config uses correct paths:

  ```javascript
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  export const API_ENDPOINTS = {
    auth: {
      login: `${API_BASE_URL}/auth/login`,
    },
  };
  ```

- [ ] Netlify function properly handles paths:

  ```javascript
  // Check path handling in api-proxy.js
  if (path.includes("/auth")) {
    url = `${BACKEND_URL}/api${path}`;
  } else {
    const adjustedPath = path.replace(/^\/api/, "");
    url = `${BACKEND_URL}/api${adjustedPath}`;
  }
  ```

- [ ] Netlify redirects are correctly configured:
  ```toml
  [[redirects]]
    from = "/api/*"
    to = "/.netlify/functions/api-proxy/:splat"
    status = 200
  ```

## Step 4: Verify Environment Variables

- [ ] Frontend environment variables:

  - `VITE_API_URL` set to `/api` in production
  - `VITE_API_URL` set to `http://localhost:5001` in development

- [ ] Netlify environment variables:

  - `BACKEND_API_URL` set to `https://kcecell-backend-api.onrender.com`

- [ ] Backend environment variables:
  - `PORT` set to `5001`
  - `MONGODB_URI` configured correctly
  - `JWT_SECRET` defined
  - `CLOUDINARY_*` variables set
  - `FRONTEND_URL` set to `https://kcecell001.netlify.app`

## Step 5: Check CORS Configuration

- [ ] Backend CORS config allows requests from the frontend:

  ```javascript
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  ```

- [ ] Netlify function includes CORS headers:

  ```javascript
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
  ```

- [ ] OPTIONS requests are properly handled

## Step 6: Authentication Flow

- [ ] Login request correctly passes credentials
- [ ] JWT token is correctly generated and returned
- [ ] Token storage in frontend works
- [ ] API requests include Authorization header
- [ ] API client correctly attaches tokens to requests

## Step 7: Network and Request Analysis

- [ ] Check browser Network tab for request/response details
- [ ] Look for failed requests, status codes, and error messages
- [ ] Verify request headers, especially Content-Type and Authorization
- [ ] Check response headers for CORS issues
- [ ] Look for any connection timeouts or latency issues

## Step 8: Server Logs

- [ ] Check Netlify deployment logs
- [ ] Check Render server logs
- [ ] Look for errors or warnings related to API requests
- [ ] Check for MongoDB connection issues
- [ ] Verify Cloudinary API interactions

## Step 9: Local Testing

If issues persist, test locally:

- [ ] Run the frontend locally with `npm run dev`
- [ ] Run the backend locally with `npm run start`
- [ ] Use the run-local.sh script for convenience
- [ ] Test API endpoints with local URLs
- [ ] Compare local vs. production behavior

## Step 10: Common Fixes

Try these common fixes if issues are identified:

- [ ] Clear browser cache and cookies
- [ ] Restart the backend server
- [ ] Redeploy the frontend with updated environment variables
- [ ] Check for recent code changes that might have broken functionality
- [ ] Verify that package versions are compatible
- [ ] Update dependencies if needed

## Documentation References

Refer to these resources for more detailed information:

- [ ] `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- [ ] API documentation
- [ ] Netlify Functions documentation
- [ ] Render Web Services documentation

---

If problems persist after following this checklist, please contact the development team for further assistance.
