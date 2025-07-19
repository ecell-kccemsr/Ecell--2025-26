// netlify/functions/auth-reset-password.js
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_API_URL || "https://kcecell-backend-api.onrender.com";

exports.handler = async (event, context) => {
  console.log("Auth Reset Password Function Called:", event.path, event.httpMethod);

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

    const { token, password } = body;

    if (!token || !password) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Token and password are required"
        })
      };
    }

    try {
      console.log("Forwarding request to backend:", `${BACKEND_URL}/api/auth/reset-password`);
      
      // Forward the reset password request to the backend
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        token,
        password
      });
      
      console.log("Backend response:", response.status);

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Password reset successful",
          ...response.data
        })
      };
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      
      return {
        statusCode: error.response?.status || 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: error.response?.data?.message || "Failed to reset password",
          error: error.response?.data?.error || error.message
        })
      };
    }
  } catch (error) {
    console.error("Auth reset password error:", error);
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
