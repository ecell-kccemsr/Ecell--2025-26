// netlify/functions/auth-me.js
const db = require('./db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports.handler = async (event, context) => {
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
    // Get token from Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "No token provided"
        })
      };
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // If this is a test user token
    if (decoded.userId && decoded.userId.startsWith('user-')) {
      const email = decoded.userId.replace('user-', '') + '@ecell.com';
      
      // Find matching test user
      const testUsers = [
        {
          email: "admin@ecell.com",
          role: "admin",
          name: "Admin User",
        },
        {
          email: "student@ecell.com",
          role: "student",
          name: "Student User",
        },
        {
          email: "test@example.com",
          role: "user",
          name: "Test User",
        },
      ];
      
      const testUser = testUsers.find(user => user.email === email);
      if (testUser) {
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: {
              id: decoded.userId,
              ...testUser
            }
          })
        };
      }
    }

    // Get user from database for non-test users
    const result = await db.query(
      'SELECT id, email, role, name FROM users WHERE id = $1',
      [decoded.userId]
    );

    const user = result.rows[0];

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "User not found"
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user
      })
    };

  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      statusCode: 401,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Invalid or expired token"
      })
    };
  }
};
