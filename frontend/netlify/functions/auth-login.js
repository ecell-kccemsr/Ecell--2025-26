// netlify/functions/auth-login.js
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Export the handler function
module.exports.handler = async (event, context) => {
  console.log("Auth Login Function Called:", event.path, event.httpMethod);

  // Allow CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  try {
    console.log("Processing login request in auth-login function");
    console.log("HTTP Method:", event.httpMethod);
    console.log("Path:", event.path);
    
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Method not allowed"
        })
      };
    }

    // Parse the request body
    let body;
    try {
      body = JSON.parse(event.body || "{}");
      console.log("Parsed request body:", body);
    } catch (e) {
      console.error("Error parsing request body:", e);
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Invalid request body",
          error: e.message
        })
      };
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Invalid request body"
        })
      };
    }

    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Email and password are required"
        })
      };
    }

    console.log(`Login attempt for email: ${email}`);

    try {
      console.log("Forwarding request to backend:", `${BACKEND_URL}/api/auth/login`);
      
      // Forward the login request to the backend
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password
      });
      
      console.log("Backend response:", response.status);

      if (response.data && response.data.token) {
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(response.data)
        };
      }

      // If backend request succeeds but no token, fallback to test users
      console.log("No token in response, falling back to test users");
    } catch (error) {
      console.error('Backend login error:', error.response?.data || error.message);
      
      // For backend errors, fallback to test users instead of returning error
      console.log("Backend error, falling back to test users");
    }

    // Test user credentials for development
    const testUsers = [
      {
        email: "admin@ecell.com",
        password: "adminpass",
        role: "admin",
        name: "Admin User",
      },
      {
        email: "student@ecell.com",
        password: "studentpass",
        role: "student",
        name: "Student User",
      },
      {
        email: "test@example.com",
        password: "testpass",
        role: "user",
        name: "Test User",
      },
    ];

    // Find matching test user
    const matchedUser = testUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      console.log(`Test user found: ${matchedUser.name} (${matchedUser.role})`);
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Login successful",
          token: `temp-token-${Date.now()}-${matchedUser.role}`,
          user: {
            id: `user-${matchedUser.email.split("@")[0]}`,
            email: matchedUser.email,
            name: matchedUser.name,
            role: matchedUser.role,
          },
        }),
      };
    }

    // If no matching test user, return authentication error
    console.log("No matching test user found");
    return {
      statusCode: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Authentication failed",
        error: "Invalid email or password",
      }),
    };
  } catch (error) {
    console.error("Auth login error:", error);

    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Login failed",
        error: error.message,
      }),
    };
  }
};
