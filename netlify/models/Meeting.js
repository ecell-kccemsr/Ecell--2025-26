const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["organizer", "participant", "presenter", "observer"],
          default: "participant",
        },
        status: {
          type: String,
          enum: ["invited", "accepted", "declined", "tentative"],
          default: "invited",
        },
        joinedAt: Date,
        leftAt: Date,
      },
    ],
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    type: {
      type: String,
      enum: [
        "team",
        "client",
        "interview",
        "presentation",
        "brainstorming",
        "other",
      ],
      default: "team",
    },
    location: {
      type: {
        type: String,
        enum: ["online", "offline", "hybrid"],
        required: true,
      },
      venue: String,
      address: String,
      onlineLink: String,
      platform: String, // Zoom, Meet, Teams, etc.
      meetingId: String,
      passcode: String,
    },
    agenda: [
      {
        topic: {
          type: String,
          required: true,
        },
        duration: Number, // in minutes
        presenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        notes: String,
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    recurring: {
      enabled: {
        type: Boolean,
        default: false,
      },
      pattern: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
      interval: Number, // every X days/weeks/months
      endDate: Date,
      daysOfWeek: [Number], // 0=Sunday, 1=Monday, etc.
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "notification"],
          required: true,
        },
        time: {
          type: Number, // minutes before meeting
          required: true,
        },
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    attachments: [
      {
        filename: String,
        originalName: String,
        url: String,
        size: Number,
        mimeType: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: String,
    actionItems: [
      {
        description: {
          type: String,
          required: true,
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        dueDate: Date,
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    recording: {
      enabled: {
        type: Boolean,
        default: false,
      },
      url: String,
      duration: Number, // in seconds
      size: Number, // in bytes
    },
    externalIntegrations: {
      googleCalendarEventId: String,
      outlookCalendarEventId: String,
      zoomMeetingId: String,
      teamsMeetingId: String,
    },
    privacy: {
      type: String,
      enum: ["public", "private", "team-only"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
meetingSchema.index({ organizer: 1, startTime: 1 });
meetingSchema.index({ "participants.user": 1 });
meetingSchema.index({ startTime: 1, endTime: 1 });
meetingSchema.index({ status: 1 });

// Virtual for duration in minutes
meetingSchema.virtual("duration").get(function () {
  if (!this.startTime || !this.endTime) return 0;
  return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

// Virtual for participant count
meetingSchema.virtual("participantCount").get(function () {
  return this.participants.filter((p) => p.status === "accepted").length;
});

// Method to check if user is participant
meetingSchema.methods.isParticipant = function (userId) {
  return this.participants.some((p) => p.user.toString() === userId.toString());
};

// Method to get participant by user ID
meetingSchema.methods.getParticipant = function (userId) {
  return this.participants.find((p) => p.user.toString() === userId.toString());
};

// Middleware to validate end time is after start time
meetingSchema.pre("save", function (next) {
  if (this.endTime <= this.startTime) {
    return next(new Error("End time must be after start time"));
  }
  next();
});

module.exports = mongoose.model("Meeting", meetingSchema);
