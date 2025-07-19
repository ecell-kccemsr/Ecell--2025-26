// netlify/functions/auth-forgot-password.js
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_API_URL || "https://kcecell-backend-api.onrender.com";

exports.handler = async (event, context) => {
  console.log("Auth Forgot Password Function Called:", event.path, event.httpMethod);

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

  try {
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
    }

    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Email is required"
        })
      };
    }

    // Test users list - keeping in sync with auth-login.js
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

    // Check if email exists in test users
    const userExists = testUsers.some(user => user.email === email);

    if (userExists) {
      // For test users, provide direct instructions
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "This is a test account. Please use these credentials:",
          testAccount: {
            email: email,
            password: email === "admin@ecell.com" ? "adminpass" : 
                     email === "student@ecell.com" ? "studentpass" : "testpass"
          },
          note: "This is a development/test environment. In production, a reset link would be sent to your email."
        })
      };
    }

    try {
      console.log("Forwarding request to backend:", `${BACKEND_URL}/.netlify/functions/auth-forgot-password`);
      const response = await axios.post(`${BACKEND_URL}/.netlify/functions/auth-forgot-password`, { email });
      console.log("Backend response:", response.status);
      
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "If an account exists with this email, password reset instructions will be sent.",
          note: "Please check your email for further instructions."
        })
      };
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "If an account exists with this email, password reset instructions will be sent.",
          demo: true
        })
      };
    }
  } catch (error) {
    console.error("Auth forgot password error:", error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message
      })
    };
  }
};
