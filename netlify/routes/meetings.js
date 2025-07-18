const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Meeting = require("../models/Meeting");
const { auth } = require("../middleware/auth");
const notificationService = require("../services/notificationService");
const router = express.Router();

// @route   GET /api/meetings
// @desc    Get user's meetings with filters
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
    query("status")
      .optional()
      .isIn(["scheduled", "ongoing", "completed", "cancelled"])
      .withMessage("Invalid status"),
    query("type")
      .optional()
      .isIn([
        "team",
        "client",
        "interview",
        "presentation",
        "brainstorming",
        "other",
      ])
      .withMessage("Invalid type"),
    query("upcoming")
      .optional()
      .isBoolean()
      .withMessage("Upcoming must be boolean"),
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

      const { page = 1, limit = 20, status, type, upcoming } = req.query;

      const query = {
        $or: [
          { organizer: req.user._id },
          { "participants.user": req.user._id },
        ],
      };

      if (status) query.status = status;
      if (type) query.type = type;

      if (upcoming === "true") {
        query.startTime = { $gte: new Date() };
      }

      const meetings = await Meeting.find(query)
        .populate("organizer", "name email")
        .populate("participants.user", "name email")
        .sort({ startTime: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Meeting.countDocuments(query);

      // Add user's participation status
      meetings.forEach((meeting) => {
        const participant = meeting.getParticipant(req.user._id);
        meeting.userRole =
          meeting.organizer._id.toString() === req.user._id.toString()
            ? "organizer"
            : participant?.role || "participant";
        meeting.userStatus = participant?.status || "not_invited";
      });

      res.json({
        meetings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get meetings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/meetings/:id
// @desc    Get single meeting
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("organizer", "name email profile")
      .populate("participants.user", "name email profile")
      .populate("agenda.presenter", "name email");

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Check if user has access to this meeting
    if (
      !meeting.isParticipant(req.user._id) &&
      meeting.organizer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Add user's participation info
    const participant = meeting.getParticipant(req.user._id);
    meeting.userRole =
      meeting.organizer._id.toString() === req.user._id.toString()
        ? "organizer"
        : participant?.role || "participant";
    meeting.userStatus = participant?.status || "not_invited";

    res.json({ meeting });
  } catch (error) {
    console.error("Get meeting error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/meetings
// @desc    Create new meeting
// @access  Private
router.post(
  "/",
  [
    auth,
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("startTime").isISO8601().withMessage("Valid start time is required"),
    body("endTime").isISO8601().withMessage("Valid end time is required"),
    body("type")
      .optional()
      .isIn([
        "team",
        "client",
        "interview",
        "presentation",
        "brainstorming",
        "other",
      ])
      .withMessage("Invalid type"),
    body("location.type")
      .isIn(["online", "offline", "hybrid"])
      .withMessage("Invalid location type"),
    body("participants")
      .optional()
      .isArray()
      .withMessage("Participants must be an array"),
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

      const meetingData = {
        ...req.body,
        organizer: req.user._id,
      };

      // Validate times
      if (new Date(meetingData.endTime) <= new Date(meetingData.startTime)) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }

      // Add organizer as participant
      const participants = meetingData.participants || [];
      participants.push({
        user: req.user._id,
        role: "organizer",
        status: "accepted",
      });

      meetingData.participants = participants;

      const meeting = new Meeting(meetingData);
      await meeting.save();

      await meeting.populate("organizer", "name email");
      await meeting.populate("participants.user", "name email");

      // Send invitations to participants
      const participantIds = participants
        .filter((p) => p.user.toString() !== req.user._id.toString())
        .map((p) => p.user);

      if (participantIds.length > 0) {
        await notificationService.sendMeetingInvitation(
          meeting._id,
          participantIds,
          req.user._id
        );
      }

      res.status(201).json({
        message: "Meeting created successfully",
        meeting,
      });
    } catch (error) {
      console.error("Create meeting error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/meetings/:id
// @desc    Update meeting
// @access  Private
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
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("startTime")
      .optional()
      .isISO8601()
      .withMessage("Valid start time is required"),
    body("endTime")
      .optional()
      .isISO8601()
      .withMessage("Valid end time is required"),
    body("type")
      .optional()
      .isIn([
        "team",
        "client",
        "interview",
        "presentation",
        "brainstorming",
        "other",
      ])
      .withMessage("Invalid type"),
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

      const meeting = await Meeting.findById(req.params.id);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      // Only organizer can update meeting
      if (meeting.organizer.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Only organizer can update meeting" });
      }

      // Validate times if both are provided
      const startTime = req.body.startTime || meeting.startTime;
      const endTime = req.body.endTime || meeting.endTime;

      if (new Date(endTime) <= new Date(startTime)) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }

      Object.assign(meeting, req.body);
      await meeting.save();

      await meeting.populate("organizer", "name email");
      await meeting.populate("participants.user", "name email");

      // Notify participants about meeting update
      const participantIds = meeting.participants
        .filter((p) => p.user._id.toString() !== req.user._id.toString())
        .map((p) => p.user._id);

      if (participantIds.length > 0) {
        await notificationService.createBulkNotifications(
          participantIds.map((participantId) => ({
            recipient: participantId,
            sender: req.user._id,
            type: "meeting_update",
            title: `Meeting Updated: ${meeting.title}`,
            message: `The meeting "${meeting.title}" has been updated. Please check the latest details.`,
            data: { meetingId: meeting._id },
            channels: { inApp: { enabled: true }, email: { enabled: true } },
            relatedEntity: { entityType: "Meeting", entityId: meeting._id },
            actionUrl: `/meetings/${meeting._id}`,
            actionText: "View Meeting",
          }))
        );
      }

      res.json({
        message: "Meeting updated successfully",
        meeting,
      });
    } catch (error) {
      console.error("Update meeting error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/meetings/:id
// @desc    Delete meeting
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Only organizer can delete meeting
    if (meeting.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only organizer can delete meeting" });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Delete meeting error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/meetings/:id/participants/:participantId/status
// @desc    Update participant status (accept/decline invitation)
// @access  Private
router.put(
  "/:id/participants/:participantId/status",
  [
    auth,
    body("status")
      .isIn(["invited", "accepted", "declined", "tentative"])
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

      const meeting = await Meeting.findById(req.params.id);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      // Find participant
      const participant = meeting.participants.find(
        (p) => p.user.toString() === req.params.participantId
      );

      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }

      // Users can only update their own status
      if (req.user._id.toString() !== req.params.participantId) {
        return res
          .status(403)
          .json({ message: "Can only update your own status" });
      }

      participant.status = req.body.status;
      await meeting.save();

      res.json({
        message: "Participation status updated successfully",
        status: participant.status,
      });
    } catch (error) {
      console.error("Update participant status error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/meetings/:id/action-items
// @desc    Add action item to meeting
// @access  Private
router.post(
  "/:id/action-items",
  [
    auth,
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
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

      const meeting = await Meeting.findById(req.params.id);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      // Check if user has access to this meeting
      if (
        !meeting.isParticipant(req.user._id) &&
        meeting.organizer.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      meeting.actionItems.push(req.body);
      await meeting.save();

      res.json({
        message: "Action item added successfully",
        actionItems: meeting.actionItems,
      });
    } catch (error) {
      console.error("Add action item error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/meetings/stats/overview
// @desc    Get meeting statistics for user
// @access  Private
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const query = {
      $or: [{ organizer: userId }, { "participants.user": userId }],
    };

    const [
      totalMeetings,
      upcomingMeetings,
      completedMeetings,
      todayMeetings,
      organizedMeetings,
    ] = await Promise.all([
      Meeting.countDocuments(query),
      Meeting.countDocuments({
        ...query,
        startTime: { $gte: new Date() },
        status: "scheduled",
      }),
      Meeting.countDocuments({ ...query, status: "completed" }),
      Meeting.countDocuments({
        ...query,
        startTime: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Meeting.countDocuments({ organizer: userId }),
    ]);

    res.json({
      totalMeetings,
      upcomingMeetings,
      completedMeetings,
      todayMeetings,
      organizedMeetings,
    });
  } catch (error) {
    console.error("Get meeting stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
