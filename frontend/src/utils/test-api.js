// Test script for the frontend
import axios from "axios";

const LOCAL_API = "http://localhost:5001";
const NETLIFY_API = "/api"; // This will use the API_URL from environment variables

// Helper function to log with styling
const log = (title, data, error = false) => {
  console.log(
    `%c ${title} `,
    `background: ${
      error ? "#f44336" : "#4CAF50"
    }; color: white; font-weight: bold; border-radius: 3px;`,
    data
  );
};

// Test all API endpoints
async function testAPI(baseURL) {
  log("Testing API with base URL", baseURL);

  try {
    // Test health endpoint
    try {
      const healthResponse = await axios.get(`${baseURL}/health`);
      log("Health Response", healthResponse.data);
    } catch (error) {
      log("Health endpoint error", error.message, true);
    }

    // Test auth login
    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email: "admin@example.com",
        password: "password123",
      });
      log("Login Response", loginResponse.data);
    } catch (error) {
      log("Login error", error.response?.data || error.message, true);
    }

    // Test events endpoint
    try {
      const eventsResponse = await axios.get(`${baseURL}/events`);
      log("Events Response", eventsResponse.data);
    } catch (error) {
      log("Events endpoint error", error.response?.data || error.message, true);
    }
  } catch (error) {
    log("Test failed", error.message, true);
  }
}

// Run tests for both local and Netlify API
async function runAllTests() {
  console.log(
    "%c API TESTING STARTED ",
    "background: #2196F3; color: white; font-weight: bold; font-size: 14px; padding: 5px;"
  );

  // Test local backend
  await testAPI(LOCAL_API);

  // Test Netlify API proxy
  await testAPI(NETLIFY_API);

  console.log(
    "%c API TESTING COMPLETE ",
    "background: #2196F3; color: white; font-weight: bold; font-size: 14px; padding: 5px;"
  );
}

// Execute if running in browser
if (typeof window !== "undefined") {
  // Create a button to run tests
  const button = document.createElement("button");
  button.textContent = "Run API Tests";
  button.style =
    "position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;";

  button.addEventListener("click", runAllTests);

  document.body.appendChild(button);

  // Add a console message
  console.log(
    "%c API Test Script Loaded! ",
    "background: #2196F3; color: white; font-weight: bold; font-size: 14px; padding: 5px;"
  );
  console.log(
    "Click the button in the bottom right to run tests, or call runAllTests() from the console."
  );
}

export { runAllTests, testAPI };
