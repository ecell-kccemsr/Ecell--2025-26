#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}        E-CELL SETUP SCRIPT            ${NC}"
echo -e "${BLUE}========================================${NC}"

# Install frontend dependencies
echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install

# Install netlify functions dependencies
echo -e "\n${YELLOW}Installing Netlify Functions dependencies...${NC}"
cd netlify/functions
npm install

# Back to root
cd ../..

# Install Netlify CLI globally if not already installed
if ! command -v netlify &> /dev/null; then
  echo -e "\n${YELLOW}Installing Netlify CLI globally...${NC}"
  npm install -g netlify-cli
else
  echo -e "\n${GREEN}Netlify CLI is already installed.${NC}"
fi

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "\n${YELLOW}To start development server, run:${NC}"
echo -e "  ${BLUE}./dev-server.sh${NC}"
echo -e "\n${YELLOW}To deploy to Netlify, run:${NC}"
echo -e "  ${BLUE}cd frontend && netlify deploy --prod${NC}"
echo -e "\n${BLUE}========================================${NC}"
