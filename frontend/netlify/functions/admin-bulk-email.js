// netlify/functions/admin-bulk-email.js
const db = require('./db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const verifyAdmin = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  
  const result = await db.query(
    'SELECT role FROM users WHERE id = $1',
    [decoded.userId]
  );
  
  if (!result.rows[0] || result.rows[0].role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return decoded;
};

const createEmailHTML = (content) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${content.subject}</h2>
      ${content.imageUrl ? `<img src="${content.imageUrl}" style="max-width: 100%; height: auto; margin: 20px 0;" />` : ''}
      <div>${content.message.replace(/\\n/g, '<br>')}</div>
      ${content.link ? `
        <div style="margin: 20px 0;">
          <a href="${content.link}" style="background-color: #00ff9d; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            ${content.linkText || 'Learn More'}
          </a>
        </div>
      ` : ''}
      <hr style="margin: 20px 0;">
      <footer style="color: #666; font-size: 12px;">
        <p>This email was sent by E-Cell KCCEMSR</p>
      </footer>
    </div>
  `;
};

module.exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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
      case 'POST': {
        const { 
          subject, 
          message, 
          imageUrl, 
          link, 
          linkText,
          targetGroup // 'all', 'users', 'event_registrants'
        } = JSON.parse(event.body);

        // Get email recipients based on target group
        let recipients;
        switch (targetGroup) {
          case 'all': {
            // Get all users and contact form submissions
            const userEmails = await db.query('SELECT DISTINCT email FROM users');
            const contactEmails = await db.query('SELECT DISTINCT email FROM contact_submissions');
            const eventEmails = await db.query('SELECT DISTINCT email FROM event_registrations');
            
            // Combine and deduplicate emails
            recipients = [...new Set([
              ...userEmails.rows.map(r => r.email),
              ...contactEmails.rows.map(r => r.email),
              ...eventEmails.rows.map(r => r.email)
            ])];
            break;
          }
          case 'users': {
            const result = await db.query('SELECT DISTINCT email FROM users');
            recipients = result.rows.map(r => r.email);
            break;
          }
          case 'event_registrants': {
            const result = await db.query('SELECT DISTINCT email FROM event_registrations');
            recipients = result.rows.map(r => r.email);
            break;
          }
          default:
            throw new Error('Invalid target group');
        }

        // Create email content
        const htmlContent = createEmailHTML({
          subject,
          message,
          imageUrl,
          link,
          linkText
        });

        // Queue emails for all recipients
        const insertPromises = recipients.map(email =>
          db.query(
            `INSERT INTO email_queue (to_email, subject, body)
             VALUES ($1, $2, $3)`,
            [email, subject, htmlContent]
          )
        );

        await Promise.all(insertPromises);

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Queued ${recipients.length} emails for sending`,
            recipientCount: recipients.length
          })
        };
      }

      case 'GET': {
        // Get email stats
        const stats = await db.query(`
          SELECT 
            status,
            COUNT(*) as count
          FROM email_queue
          GROUP BY status
        `);

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stats: stats.rows
          })
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
    console.error('Admin bulk email error:', error);
    return {
      statusCode: error.message.includes('Admin access required') ? 403 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: error.message || 'Internal server error' })
    };
  }
};
