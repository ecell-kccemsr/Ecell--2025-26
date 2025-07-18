#!/bin/bash

echo "🚀 Setting up E-Cell Backend..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual configuration values"
fi

# Create uploads directory
mkdir -p uploads/events
mkdir -p uploads/users
mkdir -p uploads/meetings

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Start MongoDB if not already running"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 API Documentation will be available at: http://localhost:5000/health"
