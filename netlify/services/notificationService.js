const Notification = require("../models/Notification");
const { sendEmail } = require("./emailService");

class NotificationService {
  // Create and send notification
  async createNotification({
    recipient,
    sender = null,
    type,
    title,
    message,
    data = {},
    priority = "medium",
    channels = { inApp: { enabled: true } },
    scheduled = { enabled: false },
    relatedEntity = null,
    actionRequired = false,
    actionUrl = null,
    actionText = null,
    expiresAt = null,
  }) {
    try {
      const notification = new Notification({
        recipient,
        sender,
        type,
        title,
        message,
        data,
        priority,
        channels,
        scheduled,
        relatedEntity,
        actionRequired,
        actionUrl,
        actionText,
        expiresAt,
      });

      await notification.save();

      // Send notification through enabled channels
      if (
        !scheduled.enabled ||
        (scheduled.enabled && scheduled.sendAt <= new Date())
      ) {
        await this.sendNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Send notification through appropriate channels
  async sendNotification(notification) {
    const results = {
      inApp: false,
      email: false,
      push: false,
    };

    try {
      // In-app notification is always enabled by default
      if (notification.channels.inApp.enabled) {
        results.inApp = true;
      }

      // Send email notification
      if (notification.channels.email.enabled) {
        try {
          await this.sendEmailNotification(notification);
          notification.channels.email.sent = true;
          notification.channels.email.sentAt = new Date();
          results.email = true;
        } catch (error) {
          console.error("Failed to send email notification:", error);
        }
      }

      // Send push notification (placeholder for future implementation)
      if (notification.channels.push.enabled) {
        try {
          await this.sendPushNotification(notification);
          notification.channels.push.sent = true;
          notification.channels.push.sentAt = new Date();
          results.push = true;
        } catch (error) {
          console.error("Failed to send push notification:", error);
        }
      }

      // Update scheduled status if applicable
      if (notification.scheduled.enabled) {
        notification.scheduled.sent = true;
      }

      await notification.save();
      return results;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  // Send email notification
  async sendEmailNotification(notification) {
    const User = require("../models/User");
    const recipient = await User.findById(notification.recipient);

    if (!recipient || !recipient.email) {
      throw new Error("Recipient email not found");
    }

    // Check user's email preferences
    if (!recipient.preferences.emailNotifications) {
      return; // User has disabled email notifications
    }

    const emailData = {
      to: recipient.email,
      subject: notification.title,
      template: this.getEmailTemplate(notification.type),
      data: {
        name: recipient.name,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
        ...notification.data,
      },
    };

    await sendEmail(emailData);
  }

  // Send push notification (placeholder)
  async sendPushNotification(notification) {
    // Implement push notification logic here
    // This could integrate with Firebase Cloud Messaging, OneSignal, etc.
    console.log("Push notification would be sent:", notification.title);
  }

  // Get appropriate email template based on notification type
  getEmailTemplate(type) {
    const templateMap = {
      event_reminder: "event-reminder",
      event_announcement: "event-announcement",
      event_cancellation: "event-cancellation",
      event_registration: "admin-notification",
      event_update: "admin-notification",
      meeting_reminder: "meeting-invitation",
      meeting_invitation: "meeting-invitation",
      meeting_update: "admin-notification",
      todo_reminder: "todo-reminder",
      todo_assignment: "admin-notification",
      admin_announcement: "admin-notification",
      user_verification: "verification",
      password_reset: "password-reset",
      system_update: "admin-notification",
      calendar_sync: "admin-notification",
      deadline_approaching: "todo-reminder",
    };

    return templateMap[type] || "admin-notification";
  }

  // Bulk create notifications
  async createBulkNotifications(notifications) {
    try {
      const results = [];
      for (const notificationData of notifications) {
        try {
          const notification = await this.createNotification(notificationData);
          results.push({ success: true, notification });
        } catch (error) {
          results.push({
            success: false,
            error: error.message,
            recipient: notificationData.recipient,
          });
        }
      }
      return results;
    } catch (error) {
      console.error("Error creating bulk notifications:", error);
      throw error;
    }
  }

  // Get notifications for user
  async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type = null,
      priority = null,
    } = options;

    const query = {
      recipient: userId,
      archived: false,
    };

    if (unreadOnly) {
      query["channels.inApp.read"] = false;
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("sender", "name email")
      .lean();

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    };
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification.markAsRead();
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId) {
    await Notification.updateMany(
      {
        recipient: userId,
        "channels.inApp.read": false,
        archived: false,
      },
      {
        "channels.inApp.read": true,
        "channels.inApp.readAt": new Date(),
      }
    );
  }

  // Archive notification
  async archiveNotification(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification.archive();
  }

  // Get unread count for user
  async getUnreadCount(userId) {
    return Notification.getUnreadCount(userId);
  }

  // Process scheduled notifications
  async processScheduledNotifications() {
    const now = new Date();
    const scheduledNotifications = await Notification.find({
      "scheduled.enabled": true,
      "scheduled.sent": false,
      "scheduled.sendAt": { $lte: now },
    });

    console.log(
      `Processing ${scheduledNotifications.length} scheduled notifications`
    );

    for (const notification of scheduledNotifications) {
      try {
        await this.sendNotification(notification);
      } catch (error) {
        console.error(
          `Failed to send scheduled notification ${notification._id}:`,
          error
        );
      }
    }
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications() {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    console.log(`Cleaned up ${result.deletedCount} expired notifications`);
    return result.deletedCount;
  }

  // Notification templates for common scenarios
  async sendEventReminder(eventId, participantIds) {
    const Event = require("../models/Event");
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const notifications = participantIds.map((participantId) => ({
      recipient: participantId,
      type: "event_reminder",
      title: `Reminder: ${event.title}`,
      message: `Don't forget about the upcoming event "${
        event.title
      }" on ${event.startDate.toLocaleDateString()}.`,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.startDate.toLocaleDateString(),
        eventLocation:
          event.location.type === "online" ? "Online" : event.location.venue,
        eventLink: event.location.onlineLink,
      },
      channels: {
        inApp: { enabled: true },
        email: { enabled: true },
      },
      relatedEntity: {
        entityType: "Event",
        entityId: eventId,
      },
      actionUrl: `/events/${eventId}`,
      actionText: "View Event",
    }));

    return this.createBulkNotifications(notifications);
  }

  async sendMeetingInvitation(meetingId, participantIds, organizerId) {
    const Meeting = require("../models/Meeting");
    const User = require("../models/User");

    const [meeting, organizer] = await Promise.all([
      Meeting.findById(meetingId),
      User.findById(organizerId),
    ]);

    if (!meeting || !organizer) {
      throw new Error("Meeting or organizer not found");
    }

    const notifications = participantIds.map((participantId) => ({
      recipient: participantId,
      sender: organizerId,
      type: "meeting_invitation",
      title: `Meeting Invitation: ${meeting.title}`,
      message: `You're invited to join "${
        meeting.title
      }" on ${meeting.startTime.toLocaleDateString()}.`,
      data: {
        meetingId: meeting._id,
        meetingTitle: meeting.title,
        meetingDate: meeting.startTime.toLocaleString(),
        meetingLink: meeting.location.onlineLink,
        organizer: organizer.name,
      },
      channels: {
        inApp: { enabled: true },
        email: { enabled: true },
      },
      relatedEntity: {
        entityType: "Meeting",
        entityId: meetingId,
      },
      actionRequired: true,
      actionUrl: `/meetings/${meetingId}`,
      actionText: "Join Meeting",
    }));

    return this.createBulkNotifications(notifications);
  }

  async sendTodoReminder(todoId, userId) {
    const Todo = require("../models/Todo");
    const todo = await Todo.findById(todoId).populate("user", "name email");

    if (!todo) {
      throw new Error("Todo not found");
    }

    return this.createNotification({
      recipient: userId,
      type: "todo_reminder",
      title: `Task Reminder: ${todo.title}`,
      message: `Don't forget to complete "${todo.title}". Due date: ${
        todo.dueDate?.toLocaleDateString() || "No due date"
      }.`,
      data: {
        todoId: todo._id,
        todoTitle: todo.title,
        dueDate: todo.dueDate?.toLocaleDateString(),
        priority: todo.priority,
      },
      priority: todo.priority === "urgent" ? "high" : "medium",
      channels: {
        inApp: { enabled: true },
        email: { enabled: true },
      },
      relatedEntity: {
        entityType: "Todo",
        entityId: todoId,
      },
      actionUrl: `/todos`,
      actionText: "View Task",
    });
  }

  // Event-specific notification methods
  async notifyNewEvent(eventId) {
    try {
      const Event = require("../models/Event");
      const User = require("../models/User");

      const event = await Event.findById(eventId).populate("organizer", "name");
      if (!event) {
        throw new Error("Event not found");
      }

      // Get all verified users who want email notifications
      const users = await User.find({
        isVerified: true,
        "preferences.emailNotifications": true,
      }).select("_id name email");

      console.log(
        `📧 Sending new event notifications for: ${event.title} to ${users.length} users`
      );

      const notifications = users.map((user) => ({
        recipient: user._id,
        sender: event.organizer._id,
        type: "event_announcement",
        title: `🎉 New Event: ${event.title}`,
        message: `A new event "${event.title}" has been announced. Check it out and register if interested!`,
        data: {
          eventId: event._id,
          eventTitle: event.title,
          eventDescription: event.description,
          eventDate: event.startDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          eventLocation:
            event.location.type === "online" ? "Online" : event.location.venue,
          eventType: event.type,
          organizerName: event.organizer.name,
          registrationRequired: event.registration.required,
        },
        channels: {
          inApp: { enabled: true },
          email: { enabled: true },
        },
        relatedEntity: {
          entityType: "Event",
          entityId: eventId,
        },
        actionUrl: `/events/${eventId}`,
        actionText: "View Event",
      }));

      const results = await this.createBulkNotifications(notifications);
      console.log(`✅ New event notifications sent successfully`);
      return results;
    } catch (error) {
      console.error("Error sending new event notifications:", error);
      throw error;
    }
  }

  async notifyEventStartingSoon(eventId) {
    try {
      const Event = require("../models/Event");
      const User = require("../models/User");

      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // Get all verified users who want email notifications
      const users = await User.find({
        isVerified: true,
        "preferences.emailNotifications": true,
      }).select("_id name email");

      console.log(
        `⏰ Sending event reminder for: ${event.title} to ${users.length} users`
      );

      const notifications = users.map((user) => ({
        recipient: user._id,
        type: "event_reminder",
        title: `⏰ Starting Soon: ${event.title}`,
        message: `The event "${event.title}" is starting in 1 hour. Don't miss out!`,
        data: {
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.startDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          eventLocation:
            event.location.type === "online" ? "Online" : event.location.venue,
          joinLink: event.location.onlineLink,
          timeRemaining: "1 hour",
        },
        priority: "high",
        channels: {
          inApp: { enabled: true },
          email: { enabled: true },
        },
        relatedEntity: {
          entityType: "Event",
          entityId: eventId,
        },
        actionUrl: event.location.onlineLink || `/events/${eventId}`,
        actionText:
          event.location.type === "online" ? "Join Event" : "View Event",
      }));

      const results = await this.createBulkNotifications(notifications);

      // Mark reminder as sent
      await Event.findByIdAndUpdate(eventId, {
        "notifications.reminderSent": true,
      });

      console.log(`✅ Event reminder notifications sent successfully`);
      return results;
    } catch (error) {
      console.error("Error sending event reminder notifications:", error);
      throw error;
    }
  }

  async notifyEventCancelled(eventId, cancellationReason = "") {
    try {
      const Event = require("../models/Event");
      const User = require("../models/User");

      const event = await Event.findById(eventId).populate("organizer", "name");
      if (!event) {
        throw new Error("Event not found");
      }

      // Get all verified users who want email notifications
      const users = await User.find({
        isVerified: true,
        "preferences.emailNotifications": true,
      }).select("_id name email");

      console.log(
        `❌ Sending cancellation notifications for: ${event.title} to ${users.length} users`
      );

      const notifications = users.map((user) => ({
        recipient: user._id,
        sender: event.organizer._id,
        type: "event_cancellation",
        title: `❌ Event Cancelled: ${event.title}`,
        message: `Unfortunately, the event "${event.title}" has been cancelled. ${cancellationReason}`,
        data: {
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.startDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          cancellationReason:
            cancellationReason ||
            "The event has been cancelled due to unforeseen circumstances.",
          organizerName: event.organizer.name,
        },
        priority: "high",
        channels: {
          inApp: { enabled: true },
          email: { enabled: true },
        },
        relatedEntity: {
          entityType: "Event",
          entityId: eventId,
        },
        actionUrl: `/events`,
        actionText: "View Other Events",
      }));

      const results = await this.createBulkNotifications(notifications);
      console.log(`✅ Event cancellation notifications sent successfully`);
      return results;
    } catch (error) {
      console.error("Error sending event cancellation notifications:", error);
      throw error;
    }
  }

  // Check for upcoming events and send reminders
  async checkUpcomingEvents() {
    try {
      const Event = require("../models/Event");

      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      const fiftyMinutesFromNow = new Date(Date.now() + 50 * 60 * 1000);

      // Find events starting in the next 10 minutes (50-60 minutes from now)
      const upcomingEvents = await Event.find({
        startDate: {
          $gte: fiftyMinutesFromNow,
          $lte: oneHourFromNow,
        },
        status: "published",
        "notifications.reminderSent": { $ne: true },
      });

      console.log(`🔍 Found ${upcomingEvents.length} events starting soon`);

      for (const event of upcomingEvents) {
        await this.notifyEventStartingSoon(event._id);
      }

      return upcomingEvents.length;
    } catch (error) {
      console.error("Error checking upcoming events:", error);
      throw error;
    }
  }

  // Send contact form notification to admins
  async sendContactFormNotification({ to, subject, templateData }) {
    try {
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00ff9d, #00b8ff); padding: 30px; text-align: center;">
            <h1 style="color: #000000; margin: 0; font-size: 24px; font-weight: bold;">
              📧 New Contact Form Submission
            </h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: #ffffff; padding: 25px; border-radius: 8px; border-left: 4px solid #00ff9d;">
              <h2 style="color: #333; margin-top: 0; font-size: 20px;">Contact Details</h2>
              
              <div style="margin: 15px 0;">
                <strong style="color: #555;">Name:</strong>
                <span style="color: #333; margin-left: 10px;">${templateData.senderName}</span>
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #555;">Email:</strong>
                <span style="color: #333; margin-left: 10px;">
                  <a href="mailto:${templateData.senderEmail}" style="color: #00b8ff; text-decoration: none;">
                    ${templateData.senderEmail}
                  </a>
                </span>
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #555;">Phone:</strong>
                <span style="color: #333; margin-left: 10px;">
                  <a href="tel:${templateData.senderPhone}" style="color: #00b8ff; text-decoration: none;">
                    ${templateData.senderPhone}
                  </a>
                </span>
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #555;">Subject:</strong>
                <span style="color: #333; margin-left: 10px;">${templateData.subject}</span>
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #555;">Submitted:</strong>
                <span style="color: #333; margin-left: 10px;">${templateData.submissionDate}</span>
              </div>
            </div>
            
            <div style="background: #ffffff; padding: 25px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #00b8ff;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">Message:</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #00ff9d;">
                <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${templateData.message}</p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${templateData.replyToEmail}?subject=Re: ${templateData.subject}" 
                 style="display: inline-block; background: linear-gradient(135deg, #00ff9d, #00b8ff); color: #000000; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">
                📧 Reply to ${templateData.senderName}
              </a>
              <a href="tel:${templateData.senderPhone}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">
                📞 Call ${templateData.senderName}
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #333; color: #fff; text-align: center; padding: 20px;">
            <p style="margin: 0; font-size: 14px;">
              E-Cell Admin Dashboard • Contact Form Notification
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to,
        subject,
        html: emailTemplate,
        priority: "high",
      });

      console.log(`✅ Contact form notification sent to admin: ${to}`);
    } catch (error) {
      console.error("❌ Error sending contact form notification:", error);
      throw error;
    }
  }

  // Send contact form confirmation to user
  async sendContactConfirmation({ to, subject, templateData }) {
    try {
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00ff9d, #00b8ff); padding: 30px; text-align: center;">
            <h1 style="color: #000000; margin: 0; font-size: 24px; font-weight: bold;">
              ✅ Thank You for Contacting E-Cell!
            </h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: #ffffff; padding: 25px; border-radius: 8px; border-left: 4px solid #00ff9d;">
              <h2 style="color: #333; margin-top: 0; font-size: 20px;">Hi ${
                templateData.name
              }! 👋</h2>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                Thank you for reaching out to us! We've received your message and our team will get back to you as soon as possible.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00b8ff;">
                <h3 style="color: #333; margin-top: 0; font-size: 16px;">Your Message Summary:</h3>
                <p style="margin: 10px 0;"><strong>Subject:</strong> ${
                  templateData.subject
                }</p>
                <p style="margin: 10px 0;"><strong>Submitted:</strong> ${
                  templateData.submissionDate
                }</p>
                <div style="margin: 15px 0;">
                  <strong>Message:</strong>
                  <div style="background: #ffffff; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 3px solid #00ff9d;">
                    <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${
                      templateData.message
                    }</p>
                  </div>
                </div>
              </div>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                📧 <strong>What's next?</strong><br>
                Our team typically responds within 24-48 hours. We'll review your message and get back to you with a detailed response.
              </p>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                In the meantime, feel free to explore our latest events and initiatives on our website!
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/events" 
                 style="display: inline-block; background: linear-gradient(135deg, #00ff9d, #00b8ff); color: #000000; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">
                🎯 View Our Events
              </a>
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">
                🏠 Visit Our Website
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #333; color: #fff; text-align: center; padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">E-Cell Team</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              Driving Innovation • Fostering Entrepreneurship • Building Future
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to,
        subject,
        html: emailTemplate,
      });

      console.log(`✅ Contact confirmation sent to: ${to}`);
    } catch (error) {
      console.error("❌ Error sending contact confirmation:", error);
      throw error;
    }
  }

  // Start the event reminder scheduler
  startEventReminderScheduler() {
    console.log("🕐 Starting event reminder scheduler...");

    // Check every 10 minutes for upcoming events
    const interval = setInterval(async () => {
      try {
        await this.checkUpcomingEvents();
      } catch (error) {
        console.error("Error in event reminder scheduler:", error);
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Run initial check
    this.checkUpcomingEvents();

    return interval;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;
