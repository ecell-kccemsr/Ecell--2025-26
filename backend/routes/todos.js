const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Todo = require("../models/Todo");
const { auth } = require("../middleware/auth");
const notificationService = require("../services/notificationService");
const router = express.Router();

// @route   GET /api/todos
// @desc    Get user's todos with filters
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
      .isIn(["pending", "in-progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
    query("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
    query("category")
      .optional()
      .isIn(["personal", "work", "event", "meeting", "deadline", "other"])
      .withMessage("Invalid category"),
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

      const {
        page = 1,
        limit = 20,
        status,
        priority,
        category,
        overdue,
        upcoming,
      } = req.query;

      const query = { user: req.user._id };

      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (category) query.category = category;

      if (overdue === "true") {
        query.dueDate = { $lt: new Date() };
        query.status = { $ne: "completed" };
      }

      if (upcoming === "true") {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        query.dueDate = { $gte: today, $lte: nextWeek };
        query.status = { $ne: "completed" };
      }

      const todos = await Todo.find(query)
        .populate("assignedBy", "name email")
        .populate("relatedEvent", "title startDate")
        .populate("relatedMeeting", "title startTime")
        .sort({ priority: -1, dueDate: 1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Todo.countDocuments(query);

      res.json({
        todos,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get todos error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("assignedBy", "name email")
      .populate("relatedEvent", "title startDate")
      .populate("relatedMeeting", "title startTime");

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ todo });
  } catch (error) {
    console.error("Get todo error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/todos
// @desc    Create new todo
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
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
    body("category")
      .optional()
      .isIn(["personal", "work", "event", "meeting", "deadline", "other"])
      .withMessage("Invalid category"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
    body("reminder.enabled")
      .optional()
      .isBoolean()
      .withMessage("Reminder enabled must be boolean"),
    body("reminder.datetime")
      .optional()
      .isISO8601()
      .withMessage("Invalid reminder datetime"),
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

      const todoData = {
        ...req.body,
        user: req.user._id,
      };

      // Validate reminder datetime is before due date
      if (
        todoData.reminder?.enabled &&
        todoData.reminder.datetime &&
        todoData.dueDate
      ) {
        if (
          new Date(todoData.reminder.datetime) >= new Date(todoData.dueDate)
        ) {
          return res
            .status(400)
            .json({ message: "Reminder time must be before due date" });
        }
      }

      const todo = new Todo(todoData);
      await todo.save();

      await todo.populate("assignedBy", "name email");

      res.status(201).json({
        message: "Todo created successfully",
        todo,
      });
    } catch (error) {
      console.error("Create todo error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/todos/:id
// @desc    Update todo
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
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority"),
    body("category")
      .optional()
      .isIn(["personal", "work", "event", "meeting", "deadline", "other"])
      .withMessage("Invalid category"),
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

      const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      Object.assign(todo, req.body);
      await todo.save();

      await todo.populate("assignedBy", "name email");

      res.json({
        message: "Todo updated successfully",
        todo,
      });
    } catch (error) {
      console.error("Update todo error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Delete todo error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/todos/:id/subtasks
// @desc    Update subtasks
// @access  Private
router.put(
  "/:id/subtasks",
  [
    auth,
    body("subtasks").isArray().withMessage("Subtasks must be an array"),
    body("subtasks.*.title")
      .notEmpty()
      .withMessage("Subtask title is required"),
    body("subtasks.*.completed")
      .optional()
      .isBoolean()
      .withMessage("Subtask completed must be boolean"),
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

      const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      // Update subtasks with completion timestamps
      todo.subtasks = req.body.subtasks.map((subtask) => ({
        ...subtask,
        completedAt: subtask.completed ? new Date() : undefined,
      }));

      await todo.save();

      res.json({
        message: "Subtasks updated successfully",
        todo,
      });
    } catch (error) {
      console.error("Update subtasks error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/todos/stats/overview
// @desc    Get todo statistics for user
// @access  Private
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalTodos,
      completedTodos,
      pendingTodos,
      overdueTodos,
      todayTodos,
      highPriorityTodos,
    ] = await Promise.all([
      Todo.countDocuments({ user: userId }),
      Todo.countDocuments({ user: userId, status: "completed" }),
      Todo.countDocuments({
        user: userId,
        status: { $in: ["pending", "in-progress"] },
      }),
      Todo.countDocuments({
        user: userId,
        dueDate: { $lt: new Date() },
        status: { $ne: "completed" },
      }),
      Todo.countDocuments({
        user: userId,
        dueDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: { $ne: "completed" },
      }),
      Todo.countDocuments({
        user: userId,
        priority: { $in: ["high", "urgent"] },
        status: { $ne: "completed" },
      }),
    ]);

    const completionRate =
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    res.json({
      totalTodos,
      completedTodos,
      pendingTodos,
      overdueTodos,
      todayTodos,
      highPriorityTodos,
      completionRate,
    });
  } catch (error) {
    console.error("Get todo stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
