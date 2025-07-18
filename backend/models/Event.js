const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    type: {
      type: String,
      enum: [
        "workshop",
        "seminar",
        "competition",
        "networking",
        "meeting",
        "other",
      ],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "entrepreneurship",
        "technology",
        "business",
        "innovation",
        "startup",
        "other",
      ],
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["online", "offline", "hybrid"],
        required: true,
      },
      venue: String,
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      onlineLink: String,
      platform: String, // Zoom, Meet, Teams, etc.
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    speakers: [
      {
        name: { type: String, required: true },
        designation: String,
        company: String,
        bio: String,
        image: String,
        linkedin: String,
        twitter: String,
      },
    ],
    registration: {
      required: {
        type: Boolean,
        default: true,
      },
      deadline: Date,
      maxParticipants: Number,
      fees: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
      },
      rsvp: {
        enabled: {
          type: Boolean,
          default: false,
        },
        type: {
          type: String,
          enum: ["internal", "luma", "google_forms", "external"],
          default: "internal",
        },
        externalLink: String, // For Luma, Google Forms, or other external RSVP
        buttonText: {
          type: String,
          default: "RSVP Now",
        },
      },
      formFields: [
        {
          name: String,
          type: {
            type: String,
            enum: ["text", "email", "phone", "select", "textarea"],
          },
          required: Boolean,
          options: [String], // for select type
        },
      ],
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        attended: {
          type: Boolean,
          default: false,
        },
        feedback: {
          rating: { type: Number, min: 1, max: 5 },
          comment: String,
          submittedAt: Date,
        },
        formData: mongoose.Schema.Types.Mixed,
      },
    ],
    agenda: [
      {
        time: String,
        title: String,
        description: String,
        speaker: String,
        duration: Number, // in minutes
      },
    ],
    sponsors: [
      {
        name: {
          type: String,
          required: true,
        },
        logo: String, // URL to sponsor logo
        website: String,
        tier: {
          type: String,
          enum: [
            "title",
            "presenting",
            "gold",
            "silver",
            "bronze",
            "partner",
            "supporter",
          ],
          default: "supporter",
        },
        description: String,
        featured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    media: {
      banner: String,
      gallery: [String],
      videos: [String],
      thumbnail: String,
    },
    resources: [
      {
        title: String,
        type: { type: String, enum: ["document", "link", "video", "image"] },
        url: String,
        description: String,
      },
    ],
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "members-only"],
      default: "public",
    },
    notifications: {
      reminderSent: {
        type: Boolean,
        default: false,
      },
      followupSent: {
        type: Boolean,
        default: false,
      },
    },
    analytics: {
      views: { type: Number, default: 0 },
      registrations: { type: Number, default: 0 },
      attendance: { type: Number, default: 0 },
    },
    externalIntegrations: {
      rsvpLink: String, // Luma, Google Forms, or other external RSVP link
      eventbriteEventId: String,
      facebookEventId: String,
      linkedinEventId: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ "location.type": 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ visibility: 1 });

// Virtual for participant count
eventSchema.virtual("participantCount").get(function () {
  return this.participants.length;
});

// Virtual for average rating
eventSchema.virtual("averageRating").get(function () {
  const ratings = this.participants
    .filter((p) => p.feedback && p.feedback.rating)
    .map((p) => p.feedback.rating);

  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

// Middleware to update analytics
eventSchema.pre("save", function (next) {
  if (this.isModified("participants")) {
    this.analytics.registrations = this.participants.length;
    this.analytics.attendance = this.participants.filter(
      (p) => p.attended
    ).length;
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
