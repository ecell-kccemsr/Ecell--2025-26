// netlify/functions/admin-submissions.js
const db = require('./db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const verifyAdmin = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  
  // Verify admin role
  const result = await db.query(
    'SELECT role FROM users WHERE id = $1',
    [decoded.userId]
  );
  
  if (!result.rows[0] || result.rows[0].role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return decoded;
};

module.exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  try {
    await verifyAdmin(event.headers.authorization || event.headers.Authorization);

    switch (event.httpMethod) {
      case 'GET': {
        const { id, status, page = 1, limit = 10 } = event.queryStringParameters || {};
        
        if (id) {
          // Get single submission
          const result = await db.query(
            'SELECT * FROM contact_submissions WHERE id = $1',
            [id]
          );
          return {
            statusCode: result.rows.length ? 200 : 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows[0] || { message: 'Submission not found' })
          };
        }

        // List submissions with filters and pagination
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM contact_submissions';
        const params = [];
        
        if (status) {
          query += ' WHERE status = $1';
          params.push(status);
        }
        
        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        
        // Get total count for pagination
        const countResult = await db.query(
          'SELECT COUNT(*) FROM contact_submissions' + (status ? ' WHERE status = $1' : ''),
          status ? [status] : []
        );

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissions: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
          })
        };
      }

      case 'PUT': {
        const { id } = event.queryStringParameters || {};
        const updates = JSON.parse(event.body);
        
        const result = await db.query(
          'UPDATE contact_submissions SET status = $1 WHERE id = $2 RETURNING *',
          [updates.status, id]
        );

        return {
          statusCode: result.rows.length ? 200 : 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows[0] || { message: 'Submission not found' })
        };
      }

      case 'DELETE': {
        const { id } = event.queryStringParameters || {};
        const result = await db.query(
          'DELETE FROM contact_submissions WHERE id = $1 RETURNING id',
          [id]
        );

        return {
          statusCode: result.rows.length ? 200 : 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows.length ? { message: 'Submission deleted' } : { message: 'Submission not found' })
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
    console.error('Admin submissions error:', error);
    return {
      statusCode: error.message.includes('Admin access required') ? 403 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: error.message || 'Internal server error' })
    };
  }
};
