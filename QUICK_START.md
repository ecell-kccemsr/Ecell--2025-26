# E-Cell Website Quick Start Guide

This guide provides the quickest path to deploy the E-Cell website on Netlify.

## Quick Deployment Steps

1. **Prepare your repository**

Ensure your repository is structured like this:

```
/
├── frontend/                # Frontend application
│   ├── netlify/functions/   # Serverless functions
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   └── netlify.toml         # Netlify configuration
```

2. **Deploy to Netlify**

**Option A: One-click deploy**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ecell-kccemsr/Ecell--2025-26)

**Option B: Manual deploy**

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

6. **Verify deployment**

- Visit your deployed site (Netlify provides a temporary URL)
- Test the API using the API tester at `/api-tester.html`
- Try logging in with test credentials:
  - Email: `admin@ecell.com`
  - Password: `adminpass`

## Test Users

| Email             | Password    | Role         |
| ----------------- | ----------- | ------------ |
| admin@ecell.com   | adminpass   | Admin        |
| student@ecell.com | studentpass | Student      |
| test@example.com  | testpass    | Regular user |

## API Endpoints

All API functionality is provided by Netlify Functions:

- Authentication: `/api/auth/login`
- Events: `/api/events`
- Contact form: `/api/contact`
- Health check: `/api/health`

## Next Steps

For full deployment details and customization options, see `NETLIFY_DEPLOYMENT_NEW.md`
