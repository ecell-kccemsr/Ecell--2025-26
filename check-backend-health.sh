#!/bin/bash

# Backend Server Health Checker
# This script tests various aspects of the backend server to diagnose connectivity issues

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       BACKEND SERVER HEALTH CHECK      ${NC}"
echo -e "${BLUE}========================================${NC}"

# Default backend URLs
LOCAL_URL="http://localhost:5001"
RENDER_URL="https://kcecell-backend-api.onrender.com"
SELECTED_URL=$LOCAL_URL

# Ask which environment to test
echo -e "${YELLOW}Which environment do you want to test?${NC}"
echo "1) Local ($LOCAL_URL)"
echo "2) Render ($RENDER_URL)"
echo "3) Custom URL"
read -p "Enter your choice (1-3): " env_choice

case $env_choice in
    1)
        SELECTED_URL=$LOCAL_URL
        echo -e "Testing local environment at ${BLUE}$SELECTED_URL${NC}"
        ;;
    2)
        SELECTED_URL=$RENDER_URL
        echo -e "Testing Render environment at ${BLUE}$SELECTED_URL${NC}"
        ;;
    3)
        read -p "Enter the custom URL (including http:// or https://): " custom_url
        SELECTED_URL=$custom_url
        echo -e "Testing custom URL at ${BLUE}$SELECTED_URL${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice. Defaulting to local environment.${NC}"
        ;;
esac

# Function to test an endpoint
test_endpoint() {
    local url=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=${4:-""}
    local description=${5:-"Testing $endpoint"}
    
    echo -e "\n${YELLOW}$description${NC}"
    echo -e "URL: ${BLUE}$url$endpoint${NC}"
    echo -e "Method: ${BLUE}$method${NC}"
    
    if [[ -n "$data" ]]; then
        echo -e "Data: ${BLUE}$data${NC}"
    fi
    
    echo -e "Response:"
    
    if [[ "$method" == "GET" ]]; then
        if curl -s -o /dev/null -w "%{http_code}" "$url$endpoint" | grep -q "200\|201\|202\|203\|204"; then
            echo -e "${GREEN}✓ Success${NC}"
            curl -s "$url$endpoint" | json_pp 2>/dev/null || echo "Could not parse response as JSON"
        else
            echo -e "${RED}✗ Failed${NC}"
            status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url$endpoint")
            echo -e "Status code: ${RED}$status_code${NC}"
            curl -s "$url$endpoint"
        fi
    else
        if curl -s -o /dev/null -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url$endpoint" | grep -q "200\|201\|202\|203\|204"; then
            echo -e "${GREEN}✓ Success${NC}"
            curl -s -X "$method" -H "Content-Type: application/json" -d "$data" "$url$endpoint" | json_pp 2>/dev/null || echo "Could not parse response as JSON"
        else
            echo -e "${RED}✗ Failed${NC}"
            status_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url$endpoint")
            echo -e "Status code: ${RED}$status_code${NC}"
            curl -s -X "$method" -H "Content-Type: application/json" -d "$data" "$url$endpoint"
        fi
    fi
}

# Function to test route patterns
test_route_pattern() {
    local url=$1
    local pattern=$2
    local description="Testing route pattern: $pattern"
    
    echo -e "\n${YELLOW}$description${NC}"
    echo -e "Pattern: ${BLUE}$pattern${NC}"
    
    # Generate all combinations of paths to test
    local paths=(
        "${pattern}"
        "api${pattern}"
        "/api${pattern}"
    )
    
    for path in "${paths[@]}"; do
        echo -e "\nTesting path: ${BLUE}$url/$path${NC}"
        curl -s -o /dev/null -w "Status code: %{http_code}\n" "$url/$path"
    done
}

# Test basic server health
echo -e "\n${BLUE}=== Testing Basic Server Health ===${NC}"
test_endpoint "$SELECTED_URL" "/health" "GET" "" "Testing server health endpoint"

# Test authentication endpoints
echo -e "\n${BLUE}=== Testing Authentication Endpoints ===${NC}"
test_endpoint "$SELECTED_URL" "/api/auth/login" "POST" '{"email":"admin@example.com","password":"password123"}' "Testing login endpoint with /api prefix"
test_endpoint "$SELECTED_URL" "/auth/login" "POST" '{"email":"admin@example.com","password":"password123"}' "Testing login endpoint without /api prefix"

# Test events endpoints
echo -e "\n${BLUE}=== Testing Events Endpoints ===${NC}"
test_endpoint "$SELECTED_URL" "/api/events" "GET" "" "Testing events endpoint with /api prefix"
test_endpoint "$SELECTED_URL" "/events" "GET" "" "Testing events endpoint without /api prefix"

# Test common route patterns
echo -e "\n${BLUE}=== Testing Common Route Patterns ===${NC}"
test_route_pattern "$SELECTED_URL" "/auth/login"
test_route_pattern "$SELECTED_URL" "/events"

# Check CORS headers
echo -e "\n${BLUE}=== Testing CORS Headers ===${NC}"
echo -e "${YELLOW}Checking CORS headers for OPTIONS request${NC}"
curl -s -o /dev/null -w "Access-Control-Allow-Origin: %{http_header:Access-Control-Allow-Origin}\nAccess-Control-Allow-Methods: %{http_header:Access-Control-Allow-Methods}\nAccess-Control-Allow-Headers: %{http_header:Access-Control-Allow-Headers}\n" -X OPTIONS "$SELECTED_URL/health"

# Print summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}       HEALTH CHECK COMPLETED           ${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "If you're still having issues, check the following:"
echo -e "1. Are the routes correctly defined in the backend?"
echo -e "2. Is CORS properly configured to allow requests from the frontend?"
echo -e "3. Are the API paths in the frontend correctly formed?"
echo -e "4. Is the backend server running and accessible?"
echo -e "\nFor more detailed debugging, use the API tester tool at: /api-tester.html"
