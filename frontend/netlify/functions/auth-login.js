// netlify/functions/auth-login.js
const db = require('./db');
const bcrypt = require('bcryptjs');
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

    // Query user from database
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return {
        statusCode: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Authentication failed",
          error: "Invalid email or password"
        })
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Authentication failed",
          error: "Invalid email or password"
        })
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
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
