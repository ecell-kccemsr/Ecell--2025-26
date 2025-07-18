#!/bin/bash

echo "=== E-Cell Backend Build Script ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Environment: $NODE_ENV"
echo "===================================="

echo "Creating .env file from environment variables..."
echo "PORT=$PORT" > .env
echo "NODE_ENV=$NODE_ENV" >> .env
echo "MONGODB_URI=$MONGODB_URI" >> .env
echo "FRONTEND_URL=$FRONTEND_URL" >> .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
echo ".env file created"

echo "===================================="
echo "Build script complete."
