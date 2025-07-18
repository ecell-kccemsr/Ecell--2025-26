const nodemailer = require("nodemailer");
const path = require("path");

// Ensure environment variables are loaded
require("dotenv").config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service verification failed:", error);
      return false;
    }
  }

  // Send email with template
  async sendEmail({ to, subject, template, data = {} }) {
    try {
      const htmlContent = this.getTemplate(template, data);

      const mailOptions = {
        from: `E-Cell <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
        text: this.htmlToText(htmlContent),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  // Send bulk emails
  async sendBulkEmails(emails) {
    const results = [];
    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push({ success: true, email: email.to, result });
      } catch (error) {
        results.push({ success: false, email: email.to, error: error.message });
      }
    }
    return results;
  }

  // Get email template
  getTemplate(templateName, data) {
    switch (templateName) {
      case "verification":
        return this.getVerificationTemplate(data);
      case "password-reset":
        return this.getPasswordResetTemplate(data);
      case "event-reminder":
        return this.getEventReminderTemplate(data);
      case "event-announcement":
        return this.getEventAnnouncementTemplate(data);
      case "event-cancellation":
        return this.getEventCancellationTemplate(data);
      case "meeting-invitation":
        return this.getMeetingInvitationTemplate(data);
      case "todo-reminder":
        return this.getTodoReminderTemplate(data);
      case "admin-notification":
        return this.getAdminNotificationTemplate(data);
      case "welcome":
        return this.getWelcomeTemplate(data);
      default:
        return this.getDefaultTemplate(data);
    }
  }

  // Email templates
  getVerificationTemplate({ name, verificationLink }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to E-Cell!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining E-Cell! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email Address</a>
            <p>If you didn't create an account with us, please ignore this email.</p>
            <p>This verification link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetTemplate({ name, resetLink }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e53e3e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #e53e3e; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>This reset link will expire in 10 minutes for security reasons.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getEventReminderTemplate({
    name,
    eventTitle,
    eventDate,
    eventLocation,
    eventLink,
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #38a169; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #38a169; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .event-details { background: white; padding: 15px; border-left: 4px solid #38a169; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>This is a reminder for the upcoming event you registered for:</p>
            <div class="event-details">
              <h3>${eventTitle}</h3>
              <p><strong>Date:</strong> ${eventDate}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
            </div>
            ${
              eventLink
                ? `<a href="${eventLink}" class="button">Join Event</a>`
                : ""
            }
            <p>We look forward to seeing you there!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getEventAnnouncementTemplate({
    name,
    eventTitle,
    eventDescription,
    eventDate,
    eventLocation,
    eventType,
    organizerName,
    registrationRequired,
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .event-details { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
          .badge { display: inline-block; background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; text-transform: uppercase; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Event Announcement</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We're excited to announce a new event that might interest you!</p>
            <div class="event-details">
              <h3>${eventTitle}</h3>
              <span class="badge">${eventType}</span>
              <p><strong>Description:</strong> ${eventDescription}</p>
              <p><strong>Date & Time:</strong> ${eventDate}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
              <p><strong>Organized by:</strong> ${organizerName}</p>
              ${
                registrationRequired
                  ? "<p><strong>Registration required</strong></p>"
                  : ""
              }
            </div>
            <a href="${
              process.env.FRONTEND_URL
            }/events" class="button">View Event Details</a>
            <p>Don't miss out on this exciting opportunity! Register now if spots are limited.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getEventCancellationTemplate({
    name,
    eventTitle,
    eventDate,
    cancellationReason,
    organizerName,
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e53e3e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .event-details { background: white; padding: 15px; border-left: 4px solid #e53e3e; margin: 15px 0; border-radius: 4px; }
          .reason-box { background: #fed7d7; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Event Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We regret to inform you that the following event has been cancelled:</p>
            <div class="event-details">
              <h3>${eventTitle}</h3>
              <p><strong>Scheduled Date:</strong> ${eventDate}</p>
              <p><strong>Organized by:</strong> ${organizerName}</p>
            </div>
            <div class="reason-box">
              <p><strong>Reason for cancellation:</strong></p>
              <p>${cancellationReason}</p>
            </div>
            <p>We apologize for any inconvenience this may cause. Please check out our other upcoming events:</p>
            <a href="${process.env.FRONTEND_URL}/events" class="button">View Other Events</a>
            <p>Thank you for your understanding.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getMeetingInvitationTemplate({
    name,
    meetingTitle,
    meetingDate,
    meetingLink,
    organizer,
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3182ce; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3182ce; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .meeting-details { background: white; padding: 15px; border-left: 4px solid #3182ce; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Meeting Invitation</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You're invited to join the following meeting:</p>
            <div class="meeting-details">
              <h3>${meetingTitle}</h3>
              <p><strong>Date & Time:</strong> ${meetingDate}</p>
              <p><strong>Organizer:</strong> ${organizer}</p>
            </div>
            <a href="${meetingLink}" class="button">Join Meeting</a>
            <p>Please make sure to join on time. Looking forward to your participation!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getTodoReminderTemplate({ name, todoTitle, dueDate, priority }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ed8936; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .todo-details { background: white; padding: 15px; border-left: 4px solid #ed8936; margin: 15px 0; }
          .priority-${priority} { border-left-color: ${
      priority === "high" || priority === "urgent" ? "#e53e3e" : "#ed8936"
    }; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Task Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>This is a reminder for your upcoming task:</p>
            <div class="todo-details priority-${priority}">
              <h3>${todoTitle}</h3>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
            </div>
            <p>Don't forget to complete this task on time!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAdminNotificationTemplate({ title, message, actionLink }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #805ad5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #805ad5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>${message}</p>
            ${
              actionLink
                ? `<a href="${actionLink}" class="button">Take Action</a>`
                : ""
            }
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeTemplate({ name }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to E-Cell!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Welcome to the E-Cell community! We're excited to have you on board.</p>
            <p>As a member, you can:</p>
            <ul>
              <li>Participate in exciting events and workshops</li>
              <li>Network with fellow entrepreneurs</li>
              <li>Access exclusive resources and opportunities</li>
              <li>Stay updated with the latest in entrepreneurship</li>
            </ul>
            <p>Get started by exploring our upcoming events and joining the conversations!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getDefaultTemplate({ title, message }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a5568; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title || "Notification from E-Cell"}</h1>
          </div>
          <div class="content">
            <p>${message || "You have a new notification from E-Cell."}</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 E-Cell. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Convert HTML to plain text (basic implementation)
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export methods
module.exports = {
  sendEmail: emailService.sendEmail.bind(emailService),
  sendBulkEmails: emailService.sendBulkEmails.bind(emailService),
  verifyConnection: emailService.verifyConnection.bind(emailService),
};
