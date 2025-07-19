// netlify/functions/todos.js
const db = require('./db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, JWT_SECRET);
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
    const decoded = verifyToken(event.headers.authorization || event.headers.Authorization);
    const userId = decoded.userId;

    switch (event.httpMethod) {
      case 'GET': {
        const { listId } = event.queryStringParameters || {};
        
        if (listId) {
          // Get items from a specific list
          const result = await db.query(
            `SELECT ti.* FROM todo_items ti
             JOIN todo_lists tl ON ti.list_id = tl.id
             WHERE tl.id = $1 AND tl.user_id = $2
             ORDER BY ti.created_at DESC`,
            [listId, userId]
          );
          return {
            statusCode: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows)
          };
        }

        // Get all todo lists
        const result = await db.query(
          'SELECT * FROM todo_lists WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows)
        };
      }

      case 'POST': {
        const { type, listId, title, description, due_date } = JSON.parse(event.body);
        
        if (type === 'list') {
          // Create new todo list
          const result = await db.query(
            'INSERT INTO todo_lists (title, user_id) VALUES ($1, $2) RETURNING *',
            [title, userId]
          );
          return {
            statusCode: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows[0])
          };
        } else {
          // Create new todo item
          const result = await db.query(
            `INSERT INTO todo_items (list_id, title, description, due_date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [listId, title, description, due_date]
          );
          return {
            statusCode: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows[0])
          };
        }
      }

      case 'PUT': {
        const { id } = event.queryStringParameters || {};
        const updates = JSON.parse(event.body);
        
        if (updates.type === 'list') {
          const result = await db.query(
            'UPDATE todo_lists SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [updates.title, id, userId]
          );
          return {
            statusCode: result.rows.length ? 200 : 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows[0] || { message: 'List not found' })
          };
        } else {
          const result = await db.query(
            `UPDATE todo_items SET title = $1, description = $2, status = $3, due_date = $4
             WHERE id = $5 AND list_id IN (SELECT id FROM todo_lists WHERE user_id = $6)
             RETURNING *`,
            [updates.title, updates.description, updates.status, updates.due_date, id, userId]
          );
          return {
            statusCode: result.rows.length ? 200 : 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows[0] || { message: 'Item not found' })
          };
        }
      }

      case 'DELETE': {
        const { id, type } = event.queryStringParameters || {};
        
        if (type === 'list') {
          const result = await db.query(
            'DELETE FROM todo_lists WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
          );
          return {
            statusCode: result.rows.length ? 200 : 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows.length ? { message: 'List deleted' } : { message: 'List not found' })
          };
        } else {
          const result = await db.query(
            `DELETE FROM todo_items WHERE id = $1 AND list_id IN 
             (SELECT id FROM todo_lists WHERE user_id = $2) RETURNING id`,
            [id, userId]
          );
          return {
            statusCode: result.rows.length ? 200 : 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(result.rows.length ? { message: 'Item deleted' } : { message: 'Item not found' })
          };
        }
      }

      default:
        return {
          statusCode: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Todos error:', error);
    return {
      statusCode: error.message === 'No token provided' ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: error.message || 'Internal server error' })
    };
  }
};
