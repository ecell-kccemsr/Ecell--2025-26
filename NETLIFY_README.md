# E-Cell Netlify Deployment

This project is configured to be fully deployed on Netlify, with the frontend served as a static site and the backend as Netlify Functions.

## Project Structur

```
/
├── frontend/           # React frontend application
├── backend/            # Express.js backend (source for Netlify Functions)
├── netlify/
│   ├── functions/      # Generated Netlify Functions
│   ├── config/         # Shared backend config
│   ├── models/         # MongoDB models
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic services
│   └── utils/          # Utility functions
├── netlify.toml        # Netlify configuration
└── setup-netlify-functions.js  # Script to set up Netlify Functions
```

## How It Works

1. The `setup-netlify-functions.js` script:

   - Copies essential backend code to the `netlify/` directory
   - Creates the main API function in `netlify/functions/api.js`
   - Sets up the package.json for Netlify Functions

2. The API is served as a single Netlify Function at `/.netlify/functions/api`

   - All routes are prefixed with this path

3. The frontend makes API calls to `/.netlify/functions/api`

## Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Set up Netlify Functions
npm run build:functions

# Start the Netlify development server
npm run dev
```

This will start the Netlify dev server which serves both the frontend and the Netlify Functions.

## Deployment

The application is automatically deployed when pushed to GitHub if connected to Netlify.

## Environment Variables

The following environment variables must be set in the Netlify dashboard:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Limitations

- Netlify Functions have a 10-second execution limit
- Maximum function bundle size is 50MB
- Cold starts may affect performance

## References

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Express.js on Netlify Functions](https://github.com/netlify/netlify-lambda/tree/master/examples/express)
- [serverless-http](https://github.com/dougmoscrop/serverless-http)
