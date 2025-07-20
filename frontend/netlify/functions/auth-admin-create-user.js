// netlify/functions/auth-admin-create-user.js
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify JWT token and admin status
const verifyAdminToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return decoded;
};

module.exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" })
    };
  }

  try {
    // Verify admin token
    const decoded = verifyAdminToken(event.headers.authorization || event.headers.Authorization);

    if (event.httpMethod === "POST") {
      const { email, password, name, role } = JSON.parse(event.body);

      // Input validation
      if (!email || !password || !name || !role) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "All fields are required" })
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if user already exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "User already exists" })
        };
      }

      // Create new user
      const result = await db.query(
        'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, name, role',
        [email, hashedPassword, name, role]
      );

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "User created successfully",
          user: result.rows[0]
        })
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method not allowed" })
    };

  } catch (error) {
    console.error('Admin create user error:', error);
    return {
      statusCode: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: error.message || "Internal server error" })
    };
  }
};
