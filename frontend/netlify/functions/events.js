// netlify/functions/events.js
const db = require('./db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify JWT token
const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, JWT_SECRET);
};

module.exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Credentials": "true"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  try {
    let userId = null;
    let isAdmin = false;

    // Verify token for protected routes
    if (event.httpMethod !== 'GET') {
      const decoded = verifyToken(event.headers.authorization || event.headers.Authorization);
      userId = decoded.userId;
      isAdmin = decoded.role === 'admin';
    }

    switch (event.httpMethod) {
      case 'GET': {
        const { id, upcoming, status } = event.queryStringParameters || {};
        
        if (id) {
          // Get single event
          const result = await db.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
          );
          return {
            statusCode: result.rows.length ? 200 : 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows[0] || { message: 'Event not found' })
          };
        }

        // List events with filters
        let query = 'SELECT * FROM events';
        const params = [];
        const conditions = [];

        if (upcoming === 'true') {
          conditions.push('start_date >= CURRENT_TIMESTAMP');
        }
        if (status) {
          conditions.push('status = $' + (params.length + 1));
          params.push(status);
        }

        if (conditions.length) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY start_date ASC';

        const result = await db.query(query, params);
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows)
        };
      }

      case 'POST': {
        if (!isAdmin) {
          return {
            statusCode: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Admin access required' })
          };
        }

        const { title, description, start_date, end_date, location, status, image_url, registration_link } = JSON.parse(event.body);

        const result = await db.query(
          `INSERT INTO events (title, description, start_date, end_date, location, status, image_url, registration_link, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [title, description, start_date, end_date, location, status || 'draft', image_url, registration_link, userId]
        );

        return {
          statusCode: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows[0])
        };
      }

      case 'PUT': {
        if (!isAdmin) {
          return {
            statusCode: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Admin access required' })
          };
        }

        const { id } = event.queryStringParameters || {};
        const updates = JSON.parse(event.body);

        const setClause = Object.keys(updates)
          .filter(key => !['id', 'created_at', 'created_by'].includes(key))
          .map((key, index) => `${key} = $${index + 2}`)
          .join(', ');

        const values = [id, ...Object.values(updates)
          .filter((_, index) => !['id', 'created_at', 'created_by'].includes(Object.keys(updates)[index]))];

        const result = await db.query(
          `UPDATE events SET ${setClause} WHERE id = $1 RETURNING *`,
          values
        );

        return {
          statusCode: result.rows.length ? 200 : 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows[0] || { message: 'Event not found' })
        };
      }

      case 'DELETE': {
        if (!isAdmin) {
          return {
            statusCode: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Admin access required' })
          };
        }

        const { id } = event.queryStringParameters || {};
        const result = await db.query(
          'DELETE FROM events WHERE id = $1 RETURNING id',
          [id]
        );

        return {
          statusCode: result.rows.length ? 200 : 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows.length ? { message: 'Event deleted' } : { message: 'Event not found' })
        };
      }

      default:
        return {
          statusCode: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Events error:', error);
    return {
      statusCode: error.message === 'No token provided' ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: error.message || 'Internal server error' })
    };
  }
};
