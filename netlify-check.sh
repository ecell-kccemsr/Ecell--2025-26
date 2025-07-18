#!/bin/bash

echo "=== Netlify Deployment Check ==="
echo "Checking frontend build directory..."

if [ -d "frontend/dist" ]; then
  echo "✅ Build directory exists"
  
  if [ -f "frontend/dist/index.html" ]; then
    echo "✅ index.html found"
  else
    echo "❌ index.html not found in build directory"
  fi
  
  echo "Checking for JavaScript assets..."
  JS_FILES=$(find frontend/dist -name "*.js" | wc -l)
  echo "Found $JS_FILES JavaScript files"
  
  echo "Checking for CSS assets..."
  CSS_FILES=$(find frontend/dist -name "*.css" | wc -l)
  echo "Found $CSS_FILES CSS files"
  
  echo "Checking API URL configuration..."
  grep -r "VITE_API_URL" frontend/.env* || echo "❌ VITE_API_URL not found in environment files"
else
  echo "❌ Build directory not found. Please run 'npm run build' in the frontend directory"
fi

echo "=== Check Complete ==="
