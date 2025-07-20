#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    STARTING E-CELL DEVELOPMENT SERVER  ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if any processes are using port 10000 or 5173
echo -e "\n${YELLOW}Checking for processes using ports...${NC}"

PORT_10000=$(lsof -i :10000 | grep LISTEN)
PORT_5173=$(lsof -i :5173 | grep LISTEN)
PORT_8888=$(lsof -i :8888 | grep LISTEN)

if [ ! -z "$PORT_10000" ]; then
  echo -e "${RED}Port 10000 is in use by:${NC}"
  echo "$PORT_10000"
  echo -e "${YELLOW}Killing process...${NC}"
  kill $(echo "$PORT_10000" | awk '{print $2}')
  sleep 1
fi

if [ ! -z "$PORT_5173" ]; then
  echo -e "${RED}Port 5173 is in use by:${NC}"
  echo "$PORT_5173"
  echo -e "${YELLOW}Killing process...${NC}"
  kill $(echo "$PORT_5173" | awk '{print $2}')
  sleep 1
fi

if [ ! -z "$PORT_8888" ]; then
  echo -e "${RED}Port 8888 is in use by:${NC}"
  echo "$PORT_8888"
  echo -e "${YELLOW}Killing process...${NC}"
  kill $(echo "$PORT_8888" | awk '{print $2}')
  sleep 1
fi

# Change to the frontend directory
cd frontend || exit 1

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo -e "${YELLOW}Netlify CLI not found. Installing globally...${NC}"
  npm install -g netlify-cli
fi

# Start Netlify dev with specific port
echo -e "\n${GREEN}Starting Netlify Dev server...${NC}"
echo -e "${BLUE}This will serve:${NC}"
echo -e "  - Frontend at ${GREEN}http://localhost:8888${NC}"
echo -e "  - Netlify Functions at ${GREEN}http://localhost:8888/.netlify/functions/*${NC}"
echo -e "  - API endpoints at ${GREEN}http://localhost:8888/api/*${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop the server${NC}\n"

# Start Netlify Dev
netlify dev --port 8888
