const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Event = require("../models/Event");
const { auth, admin, optionalAuth } = require("../middleware/auth");
const notificationService = require("../services/notificationService");
const { upload, cloudinary } = require("../config/cloudinary");
const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filters and pagination
// @access  Public
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("status")
      .optional()
      .isIn(["draft", "published", "cancelled", "completed"])
      .withMessage("Invalid status"),
    query("type")
      .optional()
      .isIn([
        "workshop",
        "seminar",
        "competition",
        "networking",
        "meeting",
        "other",
      ])
      .withMessage("Invalid type"),
    query("category")
      .optional()
      .isIn([
        "entrepreneurship",
        "technology",
        "business",
        "innovation",
        "startup",
        "other",
      ])
      .withMessage("Invalid category"),
    query("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be boolean"),
    query("upcoming")
      .optional()
      .isBoolean()
      .withMessage("Upcoming must be boolean"),
  ],
  optionalAuth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        status,
        type,
        category,
        featured,
        upcoming,
        search,
      } = req.query;

      // Build query
      const query = {};

      // Visibility filter
      if (!req.user || req.user.role !== "admin") {
        query.visibility = { $in: ["public", "members-only"] };
        query.status = "published";
      }

      if (status && (req.user?.role === "admin" || status === "published")) {
        query.status = status;
      }

      if (type) query.type = type;
      if (category) query.category = category;
      if (featured !== undefined) query.featured = featured === "true";

      if (upcoming === "true") {
        query.startDate = { $gte: new Date() };
      }

      if (search) {
        query.$text = { $search: search };
      }

      // Create text index if searching
      if (search) {
        try {
          await Event.collection.createIndex({
            title: "text",
            description: "text",
            "speakers.name": "text",
            tags: "text",
          });
        } catch (error) {
          // Index may already exist
        }
      }

      const events = await Event.find(query)
        .populate("organizer", "name email")
        .sort({ featured: -1, startDate: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Event.countDocuments(query);

      // Add participation status for authenticated users
      if (req.user) {
        events.forEach((event) => {
          event.isParticipant = event.participants.some(
            (p) => p.user.toString() === req.user._id.toString()
          );
        });
      }

      res.json({
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email profile")
      .populate("participants.user", "name email profile");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check visibility
    if (!req.user || req.user.role !== "admin") {
      if (
        event.visibility === "private" ||
        (event.visibility === "members-only" && !req.user) ||
        event.status !== "published"
      ) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // Increment view count
    event.analytics.views += 1;
    await event.save();

    // Add participation status for authenticated users
    if (req.user) {
      event.isParticipant = event.participants.some(
        (p) => p.user._id.toString() === req.user._id.toString()
      );
      event.userParticipation = event.participants.find(
        (p) => p.user._id.toString() === req.user._id.toString()
      );
    }

    res.json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/events/upload-image
// @desc    Upload event image to Cloudinary
// @access  Private (Admin only)
router.post(
  "/upload-image",
  [auth, admin],
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // The file is automatically uploaded to Cloudinary by multer-storage-cloudinary
      const imageUrl = req.file.path;
      const publicId = req.file.filename;

      res.json({
        message: "Image uploaded successfully",
        imageUrl,
        publicId,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

// @route   DELETE /api/events/delete-image/:publicId
// @desc    Delete event image from Cloudinary
// @access  Private (Admin only)
router.delete("/delete-image/:publicId", [auth, admin], async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(
      `ecell-events/${publicId}`
    );

    if (result.result === "ok") {
      res.json({
        message: "Image deleted successfully",
        publicId,
        result,
      });
    } else {
      res.status(400).json({
        message: "Failed to delete image",
        result,
      });
    }
  } catch (error) {
    console.error("Image deletion error:", error);
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
});

// @route   POST /api/events
// @desc    Create new event (Admin Panel)
// @access  Private (Admin only)
router.post(
  "/",
  [
    auth,
    admin,
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("type")
      .isIn([
        "workshop",
        "seminar",
        "competition",
        "networking",
        "meeting",
        "conference",
        "webinar",
        "other",
      ])
      .withMessage("Invalid event type"),
    body("category")
      .isIn([
        "entrepreneurship",
        "technology",
        "business",
        "innovation",
        "startup",
        "other",
      ])
      .withMessage("Invalid category"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
    body("location.type")
      .isIn(["online", "offline", "hybrid"])
      .withMessage("Invalid location type"),
    body("registration.rsvp.type")
      .optional()
      .isIn(["internal", "luma", "google_forms", "external"])
      .withMessage("Invalid RSVP type"),
    body("registration.rsvp.externalLink")
      .optional()
      .isURL()
      .withMessage("Invalid RSVP link"),
    body("sponsors")
      .optional()
      .isArray()
      .withMessage("Sponsors must be an array"),
    body("sponsors.*.name")
      .optional()
      .notEmpty()
      .withMessage("Sponsor name is required"),
    body("sponsors.*.tier")
      .optional()
      .isIn([
        "title",
        "presenting",
        "gold",
        "silver",
        "bronze",
        "partner",
        "supporter",
      ])
      .withMessage("Invalid sponsor tier"),
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

      const eventData = {
        ...req.body,
        organizer: req.user._id,
      };

      // Validate dates
      if (new Date(eventData.endDate) <= new Date(eventData.startDate)) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      // Handle registration.rsvp data transformation
      if (eventData.registration?.rsvp) {
        // If rsvp is sent as a string (URL), convert it to proper object structure
        if (typeof eventData.registration.rsvp === "string") {
          const rsvpUrl = eventData.registration.rsvp;
          eventData.registration.rsvp = {
            enabled: true,
            type: "external",
            externalLink: rsvpUrl,
            buttonText: "RSVP Now",
          };
        } else if (typeof eventData.registration.rsvp === "object") {
          // Set default RSVP settings if external link is provided
          if (eventData.registration.rsvp.externalLink) {
            eventData.registration.rsvp.enabled = true;
            if (!eventData.registration.rsvp.type) {
              eventData.registration.rsvp.type = "external";
            }
          }
        }
      }

      // Handle image data transformation
      if (eventData.image) {
        // If image URL is provided, store it in both image field and media structure
        if (!eventData.media) {
          eventData.media = {};
        }
        eventData.media.banner = eventData.image;
        eventData.media.thumbnail = eventData.image;
        // Keep the image field for backward compatibility
      }

      const event = new Event(eventData);
      await event.save();

      await event.populate("organizer", "name email");

      // Send notification if event is published
      if (event.status === "published") {
        try {
          await notificationService.notifyNewEvent(event._id);
          console.log(`✅ New event notifications sent for: ${event.title}`);
        } catch (notificationError) {
          console.error(
            "Error sending new event notifications:",
            notificationError
          );
          // Don't fail the request if notifications fail
        }
      }

      res.status(201).json({
        message: "Event created successfully",
        event,
      });
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin or organizer)
router.put(
  "/:id",
  [
    auth,
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("type")
      .optional()
      .isIn([
        "workshop",
        "seminar",
        "competition",
        "networking",
        "meeting",
        "other",
      ])
      .withMessage("Invalid event type"),
    body("category")
      .optional()
      .isIn([
        "entrepreneurship",
        "technology",
        "business",
        "innovation",
        "startup",
        "other",
      ])
      .withMessage("Invalid category"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
    body("cancellationReason")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Cancellation reason must be at least 10 characters long"),
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

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check permissions
      if (
        req.user.role !== "admin" &&
        event.organizer.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Validate dates if both are provided
      const startDate = req.body.startDate || event.startDate;
      const endDate = req.body.endDate || event.endDate;

      if (new Date(endDate) <= new Date(startDate)) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      // Handle registration.rsvp data transformation for updates
      if (req.body.registration?.rsvp) {
        // If rsvp is sent as a string (URL), convert it to proper object structure
        if (typeof req.body.registration.rsvp === "string") {
          const rsvpUrl = req.body.registration.rsvp;
          req.body.registration.rsvp = {
            enabled: true,
            type: "external",
            externalLink: rsvpUrl,
            buttonText: "RSVP Now",
          };
        } else if (typeof req.body.registration.rsvp === "object") {
          // Set default RSVP settings if external link is provided
          if (req.body.registration.rsvp.externalLink) {
            req.body.registration.rsvp.enabled = true;
            if (!req.body.registration.rsvp.type) {
              req.body.registration.rsvp.type = "external";
            }
          }
        }
      }

      // Handle image data transformation for updates
      if (req.body.image) {
        // If image URL is provided, store it in both image field and media structure
        if (!req.body.media) {
          req.body.media = { ...event.media };
        }
        req.body.media.banner = req.body.image;
        req.body.media.thumbnail = req.body.image;
        // Keep the image field for backward compatibility
      }

      Object.assign(event, req.body);
      await event.save();

      await event.populate("organizer", "name email");

      // Notify participants about event update
      if (event.participants.length > 0) {
        const participantIds = event.participants.map((p) => p.user);
        await notificationService.createBulkNotifications(
          participantIds.map((participantId) => ({
            recipient: participantId,
            type: "event_update",
            title: `Event Updated: ${event.title}`,
            message: `The event "${event.title}" has been updated. Please check the latest details.`,
            data: { eventId: event._id },
            channels: { inApp: { enabled: true }, email: { enabled: true } },
            relatedEntity: { entityType: "Event", entityId: event._id },
            actionUrl: `/events/${event._id}`,
            actionText: "View Event",
          }))
        );
      }

      res.json({
        message: "Event updated successfully",
        event,
      });
    } catch (error) {
      console.error("Update event error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin or organizer)
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
router.post(
  "/:id/register",
  [
    auth,
    body("formData")
      .optional()
      .isObject()
      .withMessage("Form data must be an object"),
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

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if event is published and registration is open
      if (event.status !== "published") {
        return res
          .status(400)
          .json({ message: "Event is not available for registration" });
      }

      if (
        event.registration.required &&
        event.registration.deadline &&
        new Date() > event.registration.deadline
      ) {
        return res
          .status(400)
          .json({ message: "Registration deadline has passed" });
      }

      // Check if user is already registered
      const existingParticipant = event.participants.find(
        (p) => p.user.toString() === req.user._id.toString()
      );

      if (existingParticipant) {
        return res
          .status(400)
          .json({ message: "Already registered for this event" });
      }

      // Check participant limit
      if (
        event.registration.maxParticipants &&
        event.participants.length >= event.registration.maxParticipants
      ) {
        return res.status(400).json({ message: "Event is full" });
      }

      // Add participant
      event.participants.push({
        user: req.user._id,
        formData: req.body.formData || {},
      });

      await event.save();

      // Send confirmation notification
      await notificationService.createNotification({
        recipient: req.user._id,
        type: "event_registration",
        title: `Registration Confirmed: ${event.title}`,
        message: `You have successfully registered for "${event.title}".`,
        data: { eventId: event._id },
        channels: { inApp: { enabled: true }, email: { enabled: true } },
        relatedEntity: { entityType: "Event", entityId: event._id },
        actionUrl: `/events/${event._id}`,
        actionText: "View Event",
      });

      res.json({ message: "Successfully registered for event" });
    } catch (error) {
      console.error("Event registration error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/events/:id/register
// @desc    Unregister from event
// @access  Private
router.delete("/:id/register", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find and remove participant
    const participantIndex = event.participants.findIndex(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({ message: "Not registered for this event" });
    }

    event.participants.splice(participantIndex, 1);
    await event.save();

    res.json({ message: "Successfully unregistered from event" });
  } catch (error) {
    console.error("Event unregistration error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/events/:id/feedback
// @desc    Submit event feedback
// @access  Private
router.post(
  "/:id/feedback",
  [
    auth,
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Comment cannot exceed 500 characters"),
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

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Find participant
      const participant = event.participants.find(
        (p) => p.user.toString() === req.user._id.toString()
      );

      if (!participant) {
        return res
          .status(400)
          .json({ message: "Must be registered for event to submit feedback" });
      }

      // Update feedback
      participant.feedback = {
        rating: req.body.rating,
        comment: req.body.comment || "",
        submittedAt: new Date(),
      };

      await event.save();

      res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
      console.error("Event feedback error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/events/:id/participants
// @desc    Get event participants (admin/organizer only)
// @access  Private
router.get("/:id/participants", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "participants.user",
      "name email profile"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      participants: event.participants,
      count: event.participants.length,
    });
  } catch (error) {
    console.error("Get event participants error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/events/admin/dashboard
// @desc    Get admin dashboard data for events
// @access  Private (Admin only)
router.get("/admin/dashboard", auth, admin, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [
      totalEvents,
      publishedEvents,
      draftEvents,
      upcomingEvents,
      thisMonthEvents,
      thisWeekEvents,
      totalRegistrations,
      recentEvents,
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: "published" }),
      Event.countDocuments({ status: "draft" }),
      Event.countDocuments({
        status: "published",
        startDate: { $gte: new Date() },
      }),
      Event.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
      Event.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      Event.aggregate([{ $unwind: "$participants" }, { $count: "total" }]).then(
        (result) => result[0]?.total || 0
      ),
      Event.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("organizer", "name email")
        .select("title status startDate participants analytics"),
    ]);

    // Get event types distribution
    const eventTypesDistribution = await Event.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get top events by registration
    const topEventsByRegistration = await Event.aggregate([
      { $addFields: { participantCount: { $size: "$participants" } } },
      { $sort: { participantCount: -1 } },
      { $limit: 5 },
      { $project: { title: 1, participantCount: 1, startDate: 1, status: 1 } },
    ]);

    res.json({
      overview: {
        totalEvents,
        publishedEvents,
        draftEvents,
        upcomingEvents,
        thisMonthEvents,
        thisWeekEvents,
        totalRegistrations,
      },
      recentEvents,
      eventTypesDistribution,
      topEventsByRegistration,
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/events/:id/status
// @desc    Update event status (Admin only)
// @access  Private (Admin only)
router.put(
  "/:id/status",
  [
    auth,
    admin,
    body("status")
      .isIn(["draft", "published", "cancelled", "completed"])
      .withMessage("Invalid status"),
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

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const oldStatus = event.status;
      event.status = req.body.status;
      await event.save();

      // Handle status change notifications
      if (req.body.status === "published" && oldStatus !== "published") {
        // New event published - notify all users
        try {
          await notificationService.notifyNewEvent(event._id);
          console.log(
            `✅ New event notifications sent for published event: ${event.title}`
          );
        } catch (notificationError) {
          console.error(
            "Error sending new event notifications:",
            notificationError
          );
        }
      } else if (req.body.status === "cancelled" && oldStatus !== "cancelled") {
        // Event cancelled - notify all users
        try {
          const cancellationReason =
            req.body.cancellationReason ||
            "The event has been cancelled due to unforeseen circumstances.";
          await notificationService.notifyEventCancelled(
            event._id,
            cancellationReason
          );
          console.log(
            `✅ Event cancellation notifications sent for: ${event.title}`
          );
        } catch (notificationError) {
          console.error(
            "Error sending cancellation notifications:",
            notificationError
          );
        }
      }

      // Notify participants if event is published or cancelled (existing logic for participants)
      if (
        event.participants.length > 0 &&
        (req.body.status === "published" || req.body.status === "cancelled")
      ) {
        const participantIds = event.participants.map((p) => p.user);

        let notificationTitle, notificationMessage;
        if (req.body.status === "published") {
          notificationTitle = `Event Published: ${event.title}`;
          notificationMessage = `The event "${event.title}" is now live and available for registration!`;
        } else if (req.body.status === "cancelled") {
          notificationTitle = `Event Cancelled: ${event.title}`;
          notificationMessage = `Unfortunately, the event "${event.title}" has been cancelled. We apologize for any inconvenience.`;
        }

        await notificationService.createBulkNotifications(
          participantIds.map((participantId) => ({
            recipient: participantId,
            type: "event_update",
            title: notificationTitle,
            message: notificationMessage,
            data: { eventId: event._id, oldStatus, newStatus: req.body.status },
            channels: { inApp: { enabled: true }, email: { enabled: true } },
            relatedEntity: { entityType: "Event", entityId: event._id },
            actionUrl: `/events/${event._id}`,
            actionText: "View Event",
          }))
        );
      }

      res.json({
        message: "Event status updated successfully",
        event: { ...event.toObject(), status: req.body.status },
      });
    } catch (error) {
      console.error("Update event status error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/events/:id/duplicate
// @desc    Duplicate an event (Admin only)
// @access  Private (Admin only)
router.post("/:id/duplicate", auth, admin, async (req, res) => {
  try {
    const originalEvent = await Event.findById(req.params.id);
    if (!originalEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Create a copy of the event
    const eventData = originalEvent.toObject();
    delete eventData._id;
    delete eventData.__v;
    delete eventData.createdAt;
    delete eventData.updatedAt;
    delete eventData.participants; // Clear participants for new event
    delete eventData.analytics; // Reset analytics

    // Modify the title to indicate it's a copy
    eventData.title = `${eventData.title} (Copy)`;
    eventData.status = "draft";
    eventData.organizer = req.user._id;

    const duplicatedEvent = new Event(eventData);
    await duplicatedEvent.save();

    await duplicatedEvent.populate("organizer", "name email");

    res.status(201).json({
      message: "Event duplicated successfully",
      event: duplicatedEvent,
    });
  } catch (error) {
    console.error("Duplicate event error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/events/test-notifications
// @desc    Test notification system (Admin only)
// @access  Private (Admin only)
router.post("/test-notifications", auth, admin, async (req, res) => {
  try {
    console.log("🧪 Testing notification system...");

    // Check for upcoming events
    const upcomingCount = await notificationService.checkUpcomingEvents();

    res.json({
      message: "Notification test completed",
      upcomingEventsChecked: upcomingCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test notifications error:", error);
    res.status(500).json({ message: "Error testing notifications" });
  }
});

module.exports = router;
