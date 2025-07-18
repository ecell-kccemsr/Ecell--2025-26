const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["personal", "work", "event", "meeting", "deadline", "other"],
      default: "personal",
    },
    dueDate: Date,
    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      datetime: Date,
      sent: {
        type: Boolean,
        default: false,
      },
    },
    tags: [String],
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    relatedMeeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        url: String,
        size: Number,
        mimeType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
      },
    ],
    completedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ category: 1 });

// Virtual for completion percentage
todoSchema.virtual("completionPercentage").get(function () {
  if (this.subtasks.length === 0) {
    return this.status === "completed" ? 100 : 0;
  }

  const completedSubtasks = this.subtasks.filter((st) => st.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Virtual for overdue status
todoSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === "completed") return false;
  return new Date() > this.dueDate;
});

// Middleware to set completedAt when status changes to completed
todoSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "completed" && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== "completed") {
      this.completedAt = undefined;
    }
  }
  next();
});

module.exports = mongoose.model("Todo", todoSchema);
