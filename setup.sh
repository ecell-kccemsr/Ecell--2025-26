#!/bin/bash

# Setup script for E-Cell project
# This script helps set up the project for development and deployment

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       E-CELL PROJECT SETUP            ${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo -e "\n${YELLOW}Checking required tools...${NC}"

# Check Node.js
if command_exists node; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓ Node.js is installed: ${NODE_VERSION}${NC}"
else
  echo -e "${RED}✗ Node.js is not installed. Please install Node.js version 16 or higher.${NC}"
  exit 1
fi

# Check npm
if command_exists npm; then
  NPM_VERSION=$(npm -v)
  echo -e "${GREEN}✓ npm is installed: ${NPM_VERSION}${NC}"
else
  echo -e "${RED}✗ npm is not installed. Please install npm.${NC}"
  exit 1
fi

# Check if Netlify CLI is installed
if command_exists netlify; then
  NETLIFY_VERSION=$(netlify -v)
  echo -e "${GREEN}✓ Netlify CLI is installed: ${NETLIFY_VERSION}${NC}"
else
  echo -e "${YELLOW}! Netlify CLI is not installed. Installing...${NC}"
  npm install -g netlify-cli
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Netlify CLI installed successfully${NC}"
  else
    echo -e "${RED}✗ Failed to install Netlify CLI${NC}"
    exit 1
  fi
fi

# Change to frontend directory and install dependencies
echo -e "\n${YELLOW}Setting up frontend...${NC}"
cd frontend

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Frontend dependencies installed successfully${NC}"
else
  echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
  exit 1
fi

# Check for Netlify Functions directory
if [ ! -d "netlify/functions" ]; then
  echo -e "${YELLOW}Creating Netlify Functions directory...${NC}"
  mkdir -p netlify/functions
fi

# Create a simple test function if it doesn't exist
if [ ! -f "netlify/functions/test-endpoint.js" ]; then
  echo -e "${YELLOW}Creating test function...${NC}"
  cat > netlify/functions/test-endpoint.js << 'EOF'
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Test function is working!",
      timestamp: new Date().toISOString()
    })
  };
}
EOF
  echo -e "${GREEN}✓ Test function created${NC}"
fi

# Print success message
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}       SETUP COMPLETED SUCCESSFULLY     ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Development Commands:${NC}"
echo -e "  ${BLUE}npm run dev${NC} - Start development server"
echo -e "  ${BLUE}netlify dev${NC} - Start Netlify development environment (recommended)"
echo -e "  ${BLUE}npm run build${NC} - Build for production"
echo -e "\n${YELLOW}Deployment Commands:${NC}"
echo -e "  ${BLUE}netlify deploy --prod${NC} - Deploy to Netlify production"
echo -e "  ${BLUE}netlify deploy${NC} - Deploy to a Netlify draft URL for testing"
echo -e "\n${YELLOW}Useful URLs:${NC}"
echo -e "  ${BLUE}Local development:${NC} http://localhost:8888"
echo -e "  ${BLUE}API Tester:${NC} http://localhost:8888/api-tester.html"
echo -e "  ${BLUE}Test Function:${NC} http://localhost:8888/.netlify/functions/test-endpoint"
echo -e "\n${YELLOW}For more information, see the README.md file${NC}"
