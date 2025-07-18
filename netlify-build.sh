#!/bin/bash

echo "===== Netlify Deployment Script ====="

# Install dependencies for functions
echo "Installing dependencies for functions..."
cd netlify/functions
npm install
cd ../..

echo "===== Deployment Preparation Complete ====="
