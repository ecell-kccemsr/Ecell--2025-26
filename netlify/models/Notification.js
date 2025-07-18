const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "event_reminder",
        "event_announcement",
        "event_cancellation",
        "event_registration",
        "event_update",
        "meeting_reminder",
        "meeting_invitation",
        "meeting_update",
        "todo_reminder",
        "todo_assignment",
        "admin_announcement",
        "user_verification",
        "password_reset",
        "system_update",
        "calendar_sync",
        "deadline_approaching",
        "other",
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    channels: {
      inApp: {
        enabled: { type: Boolean, default: true },
        read: { type: Boolean, default: false },
        readAt: Date,
      },
      email: {
        enabled: { type: Boolean, default: false },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        delivered: { type: Boolean, default: false },
        opened: { type: Boolean, default: false },
      },
      push: {
        enabled: { type: Boolean, default: false },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        clicked: { type: Boolean, default: false },
      },
    },
    scheduled: {
      enabled: { type: Boolean, default: false },
      sendAt: Date,
      sent: { type: Boolean, default: false },
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Event", "Meeting", "Todo", "User", "Other"],
      },
      entityId: mongoose.Schema.Types.ObjectId,
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
    actionUrl: String,
    actionText: String,
    expiresAt: Date,
    archived: {
      type: Boolean,
      default: false,
    },
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({
  recipient: 1,
  "channels.inApp.read": 1,
  createdAt: -1,
});
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ "scheduled.sendAt": 1, "scheduled.sent": 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ archived: 1 });

// Virtual for overall read status
notificationSchema.virtual("isRead").get(function () {
  return this.channels.inApp.read;
});

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
  this.channels.inApp.read = true;
  this.channels.inApp.readAt = new Date();
  return this.save();
};

// Method to archive notification
notificationSchema.methods.archive = function () {
  this.archived = true;
  this.archivedAt = new Date();
  return this.save();
};

// Static method to create and send notification
notificationSchema.statics.createAndSend = async function (notificationData) {
  const notification = new this(notificationData);
  await notification.save();

  // Here you would integrate with your notification service
  // to actually send emails, push notifications, etc.

  return notification;
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    recipient: userId,
    "channels.inApp.read": false,
    archived: false,
  });
};

// TTL index to automatically delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
