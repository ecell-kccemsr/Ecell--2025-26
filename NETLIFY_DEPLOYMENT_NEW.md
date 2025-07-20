# E-Cell Website - Full Netlify Deployment

This guide explains how to deploy the entire E-Cell website (both frontend and backend) on Netlify using serverless functions.

## Overview

We've moved from a split architecture (frontend on Netlify, backend on Render) to a fully integrated approach where everything runs on Netlify. This simplifies deployment, eliminates CORS issues, and reduces complexity.

## Project Structure

```
/
├── frontend/                # React application
│   ├── netlify/functions/  # Serverless API implementations
│   │   ├── api.js          # Main API handler (replaces backend server)
│   │   └── auth-login.js   # Authentication function
│   ├── public/             # Static assets
│   ├── src/                # React source files
│   └── netlify.toml        # Netlify configuration
└── setup.sh                # Setup script
```

## Setup Instructions

### Local Development

1. Run the setup script:

```bash
./setup.sh
```

This will:

- Check for required tools (Node.js, npm, Netlify CLI)
- Install any missing dependencies
- Set up the project for local development

2. Start the local development server:

```bash
cd frontend
netlify dev
```

This will start the Netlify development server at http://localhost:8888, which includes:

- The React frontend
- Netlify Functions for API endpoints
- Hot reloading for development

### Deployment to Netlify

#### Option 1: Using Netlify CLI (Recommended)

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Log in to Netlify (if not already logged in):

```bash
netlify login
```

3. Initialize the Netlify project (first time only):

```bash
netlify init
```

4. Deploy to production:

```bash
netlify deploy --prod
```

#### Option 2: Using Netlify Dashboard

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Click "Deploy site"

### Environment Variables

Set these in your Netlify dashboard under Site settings > Environment variables:

- `NODE_VERSION`: `16` (or higher)

## Testing Your Deployment

After deployment, you can test your site:

1. Visit the main site URL (e.g., https://your-site-name.netlify.app)
2. Test the API using the API tester tool at /api-tester.html
3. Try logging in with one of the test accounts:
   - Admin: admin@ecell.com / adminpass
   - Student: student@ecell.com / studentpass
   - Test: test@example.com / testpass

## Data Persistence

The current serverless implementation uses in-memory data that doesn't persist between function invocations. For a production site, consider using:

1. **Netlify Key-Value Store** - For simple storage needs
2. **FaunaDB** - Serverless database with a generous free tier
3. **Supabase or Neon** - Serverless PostgreSQL
4. **MongoDB Atlas** - MongoDB cloud service

## Image and File Storage

For storing images and files:

1. **Cloudinary** - For image and media management
2. **Netlify Large Media** - Git LFS-based storage
3. **AWS S3** - Cloud object storage

## Troubleshooting

If you encounter issues:

1. Check Netlify function logs in the Netlify dashboard
2. Use the API tester tool at /api-tester.html
3. Check your browser console for errors
4. Verify environment variables

## Next Steps for Production

1. Implement a proper database connection
2. Set up secure authentication with proper JWT handling
3. Configure image upload functionality with Cloudinary or similar
4. Add form handling for the contact form
5. Set up scheduled functions for any recurring tasks
