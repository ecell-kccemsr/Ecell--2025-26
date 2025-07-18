const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Notification = require("../models/Notification");
const { auth, admin } = require("../middleware/auth");
const notificationService = require("../services/notificationService");
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get(
  "/",
  [
    auth,
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("unreadOnly")
      .optional()
      .isBoolean()
      .withMessage("UnreadOnly must be boolean"),
    query("type").optional().isString().withMessage("Type must be string"),
    query("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        unreadOnly: req.query.unreadOnly === "true",
        type: req.query.type,
        priority: req.query.priority,
      };

      const result = await notificationService.getUserNotifications(
        req.user._id,
        options
      );

      res.json(result);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get single notification
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    }).populate("sender", "name email");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ notification });
  } catch (error) {
    console.error("Get notification error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", auth, async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.id, req.user._id);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    if (error.message === "Notification not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put("/mark-all-read", auth, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notifications/:id/archive
// @desc    Archive notification
// @access  Private
router.put("/:id/archive", auth, async (req, res) => {
  try {
    await notificationService.archiveNotification(req.params.id, req.user._id);
    res.json({ message: "Notification archived" });
  } catch (error) {
    console.error("Archive notification error:", error);
    if (error.message === "Notification not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/notifications
// @desc    Create notification (admin only)
// @access  Private (Admin)
router.post(
  "/",
  [
    auth,
    admin,
    body("recipient").isMongoId().withMessage("Valid recipient ID is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
    body("channels.inApp.enabled")
      .optional()
      .isBoolean()
      .withMessage("InApp enabled must be boolean"),
    body("channels.email.enabled")
      .optional()
      .isBoolean()
      .withMessage("Email enabled must be boolean"),
    body("scheduled.enabled")
      .optional()
      .isBoolean()
      .withMessage("Scheduled enabled must be boolean"),
    body("scheduled.sendAt")
      .optional()
      .isISO8601()
      .withMessage("Invalid send date"),
    body("actionRequired")
      .optional()
      .isBoolean()
      .withMessage("Action required must be boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const notificationData = {
        ...req.body,
        sender: req.user._id,
      };

      const notification = await notificationService.createNotification(
        notificationData
      );

      res.status(201).json({
        message: "Notification created successfully",
        notification,
      });
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/notifications/bulk
// @desc    Create bulk notifications (admin only)
// @access  Private (Admin)
router.post(
  "/bulk",
  [
    auth,
    admin,
    body("notifications")
      .isArray()
      .withMessage("Notifications must be an array"),
    body("notifications.*.recipient")
      .isMongoId()
      .withMessage("Valid recipient ID is required"),
    body("notifications.*.type").notEmpty().withMessage("Type is required"),
    body("notifications.*.title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),
    body("notifications.*.message")
      .trim()
      .notEmpty()
      .withMessage("Message is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const notifications = req.body.notifications.map((notification) => ({
        ...notification,
        sender: req.user._id,
      }));

      const results = await notificationService.createBulkNotifications(
        notifications
      );

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      res.json({
        message: `Bulk notification complete: ${successCount} sent, ${failureCount} failed`,
        results,
      });
    } catch (error) {
      console.error("Create bulk notifications error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/notifications/broadcast
// @desc    Broadcast notification to all users (admin only)
// @access  Private (Admin)
router.post(
  "/broadcast",
  [
    auth,
    admin,
    body("type").notEmpty().withMessage("Type is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
    body("userFilter")
      .optional()
      .isObject()
      .withMessage("User filter must be an object"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const User = require("../models/User");

      // Get users based on filter
      const userFilter = req.body.userFilter || {};
      const users = await User.find(userFilter).select("_id");

      if (users.length === 0) {
        return res
          .status(400)
          .json({ message: "No users found matching the filter" });
      }

      const notifications = users.map((user) => ({
        recipient: user._id,
        sender: req.user._id,
        type: req.body.type,
        title: req.body.title,
        message: req.body.message,
        priority: req.body.priority || "medium",
        channels: {
          inApp: { enabled: true },
          email: { enabled: req.body.sendEmail || false },
        },
        data: req.body.data || {},
      }));

      const results = await notificationService.createBulkNotifications(
        notifications
      );

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      res.json({
        message: `Broadcast complete: ${successCount} sent to users, ${failureCount} failed`,
        totalUsers: users.length,
        results,
      });
    } catch (error) {
      console.error("Broadcast notification error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/notifications/admin/stats
// @desc    Get notification statistics (admin only)
// @access  Private (Admin)
router.get("/admin/stats", auth, admin, async (req, res) => {
  try {
    const [
      totalNotifications,
      unreadNotifications,
      todayNotifications,
      emailNotifications,
      highPriorityNotifications,
    ] = await Promise.all([
      Notification.countDocuments(),
      Notification.countDocuments({
        "channels.inApp.read": false,
        archived: false,
      }),
      Notification.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Notification.countDocuments({ "channels.email.enabled": true }),
      Notification.countDocuments({ priority: { $in: ["high", "urgent"] } }),
    ]);

    // Get notification types distribution
    const typeDistribution = await Notification.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalNotifications,
      unreadNotifications,
      todayNotifications,
      emailNotifications,
      highPriorityNotifications,
      typeDistribution,
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/notifications/test-email
// @desc    Send test email notification (admin only)
// @access  Private (Admin)
router.post(
  "/test-email",
  [
    auth,
    admin,
    body("email").isEmail().withMessage("Valid email is required"),
    body("template")
      .optional()
      .isString()
      .withMessage("Template must be string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { sendEmail } = require("../services/emailService");

      await sendEmail({
        to: req.body.email,
        subject: "Test Email from E-Cell",
        template: req.body.template || "admin-notification",
        data: {
          title: "Test Email",
          message: "This is a test email from the E-Cell notification system.",
          name: "Test User",
        },
      });

      res.json({ message: "Test email sent successfully" });
    } catch (error) {
      console.error("Send test email error:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  }
);

module.exports = router;
