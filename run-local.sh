#!/bin/bash

# Simple script to start both backend and frontend servers concurrently
# Usage: ./run-local.sh

# Define colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E-Cell Development Environment...${NC}"

# Function to cleanup child processes on exit
cleanup() {
  echo -e "\n${YELLOW}Shutting down servers...${NC}"
  if [ ! -z "$BACKEND_PID" ]; then
    echo -e "Stopping backend server (PID: $BACKEND_PID)"
    kill $BACKEND_PID 2>/dev/null
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "Stopping frontend server (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID 2>/dev/null
  fi
  echo -e "${GREEN}Shutdown complete.${NC}"
  exit 0
}

# Set up trap for clean shutdown
trap cleanup INT TERM EXIT

# Start backend server
echo -e "\n${YELLOW}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"
echo -e "${GREEN}Backend URL: http://localhost:5001${NC}"

# Wait a bit for backend to initialize
sleep 2

# Start frontend server
echo -e "\n${YELLOW}Starting frontend server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"
echo -e "${GREEN}Frontend URL: http://localhost:5173${NC}"

echo -e "\n${GREEN}Both servers are now running!${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Keep script running until user presses Ctrl+C
wait
