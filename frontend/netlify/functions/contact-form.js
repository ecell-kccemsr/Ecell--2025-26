// netlify/functions/contact-form.js
const db = require('./db');

// Email template for contact form submissions
const createEmailContent = (formData) => {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message.replace(/\\n/g, '<br>')}</p>
    <hr>
    <p><small>Sent from E-Cell Contact Form</small></p>
  `;
};

module.exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
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
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: `${field} is required` }),
        };
      }
    }

    // Store in database
    const result = await db.query(
      `INSERT INTO contact_submissions (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [formData.name, formData.email, formData.phone || null, formData.subject, formData.message]
    );

    // Queue email notification
    const emailContent = createEmailContent(formData);
    await db.query(
      `INSERT INTO email_queue (to_email, subject, body)
       VALUES ($1, $2, $3)`,
      [
        process.env.ADMIN_EMAIL || 'admin@ecell.com',
        `New Contact Form Submission: ${formData.subject}`,
        emailContent
      ]
    );

    // Send auto-reply to user
    await db.query(
      `INSERT INTO email_queue (to_email, subject, body)
       VALUES ($1, $2, $3)`,
      [
        formData.email,
        'Thank you for contacting E-Cell',
        `
        <h2>Thank you for contacting E-Cell!</h2>
        <p>Dear ${formData.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <hr>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,</p>
        <p>E-Cell Team</p>
        `
      ]
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Thank you for your message. We'll get back to you soon!",
        id: result.rows[0].id
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to submit form. Please try again later."
      }),
    };
  }
};
