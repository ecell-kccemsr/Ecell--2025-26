// netlify/functions/email-service.js
const db = require('./db');
const nodemailer = require('nodemailer');

// Create mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Process email queue
const processEmailQueue = async () => {
  try {
    // Get pending emails with fewer than 3 attempts
    const result = await db.query(
      `SELECT * FROM email_queue 
       WHERE status = 'pending' 
       AND attempts < 3 
       ORDER BY created_at ASC 
       LIMIT 10`
    );

    for (const email of result.rows) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email.to_email,
          subject: email.subject,
          html: email.body,
        });

        // Mark as sent
        await db.query(
          `UPDATE email_queue 
           SET status = 'sent', 
               last_attempt = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [email.id]
        );
      } catch (error) {
        console.error('Failed to send email:', error);
        
        // Update attempt count
        await db.query(
          `UPDATE email_queue 
           SET attempts = attempts + 1, 
               last_attempt = CURRENT_TIMESTAMP,
               status = CASE WHEN attempts + 1 >= 3 THEN 'failed' ELSE 'pending' END 
           WHERE id = $1`,
          [email.id]
        );
      }
    }
  } catch (error) {
    console.error('Email queue processing error:', error);
  }
};

// Queue new email
const queueEmail = async (to, subject, body) => {
  try {
    const result = await db.query(
      `INSERT INTO email_queue (to_email, subject, body) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [to, subject, body]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Failed to queue email:', error);
    throw error;
  }
};

module.exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Method not allowed" })
    };
  }

  try {
    if (event.queryStringParameters?.action === 'process') {
      // Process email queue (protected endpoint)
      const apiKey = event.headers['x-api-key'];
      if (apiKey !== process.env.CRON_API_KEY) {
        throw new Error('Unauthorized');
      }
      await processEmailQueue();
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Email queue processed" })
      };
    } else {
      // Queue new email
      const { to, subject, body } = JSON.parse(event.body);
      const result = await queueEmail(to, subject, body);
      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      };
    }
  } catch (error) {
    console.error('Email service error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: error.message || 'Internal server error' })
    };
  }
};
