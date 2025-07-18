# E-Cell Project Deployment Guide

## Netlify Deployment Instructions

### Prerequisites
- A Netlify account
- Git repository access

### Deploying the Full Stack Application to Netlify

#### Option 1: Deploy via Netlify UI
1. Log in to your Netlify account
2. Click on "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select the Ecell--2025-26 repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. Under "Advanced build settings", add the environment variables listed below
7. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Log in to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Follow the prompts to connect to your Git repository
5. The netlify.toml file in the repository will handle the configuration

### Environment Variables
Make sure the following environment variables are set in Netlify:
- `VITE_API_URL`: URL of your Netlify Functions (e.g., `/.netlify/functions`)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Post-Deployment
- Check that your site is successfully deployed
- Verify that the frontend can communicate with the backend API
- Test all main features of the application

### Troubleshooting
- If routes don't work (404 errors), check that the _redirects file is properly deployed
- If API calls fail, verify your Netlify Functions are working correctly
- For build failures, check the build logs in Netlify

## Backend as Netlify Functions

The backend will be deployed as Netlify Functions, providing a serverless architecture for your API.

### Setting Up Netlify Functions
1. Netlify automatically detects and deploys functions in the `netlify/functions` directory
2. Each function file is deployed as a separate API endpoint
3. Your API endpoints will be available at `/.netlify/functions/[function-name]`

### Database Connection
MongoDB will be connected from your Netlify Functions using the `MONGODB_URI` environment variable.

### Function Limitations
- Netlify Functions have a maximum execution duration of 10 seconds
- Function bundle size is limited to 50MB
- Cold starts may affect performance

### Monitoring and Debugging
- View function logs in the Netlify dashboard under "Functions"
- Use the Netlify CLI for local development and testing
