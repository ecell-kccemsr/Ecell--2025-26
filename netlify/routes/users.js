const express = require("express");
const { body, validationResult, query } = require("express-validator");
const User = require("../models/User");
const { auth, admin } = require("../middleware/auth");
const { sanitizeUser } = require("../utils/auth");
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  [
    auth,
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("profile.bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("profile.phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
    body("profile.college")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("College name cannot exceed 100 characters"),
    body("profile.year")
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage("Year cannot exceed 20 characters"),
    body("profile.interests")
      .optional()
      .isArray()
      .withMessage("Interests must be an array"),
    body("preferences.emailNotifications")
      .optional()
      .isBoolean()
      .withMessage("Email notifications must be boolean"),
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

      const user = await User.findById(req.user._id);
      const updateData = { ...req.body };

      // Merge nested objects properly
      if (updateData.profile) {
        user.profile = { ...user.profile.toObject(), ...updateData.profile };
        delete updateData.profile;
      }

      if (updateData.preferences) {
        user.preferences = {
          ...user.preferences.toObject(),
          ...updateData.preferences,
        };
        delete updateData.preferences;
      }

      Object.assign(user, updateData);
      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get(
  "/",
  [
    auth,
    admin,
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Invalid role"),
    query("verified")
      .optional()
      .isBoolean()
      .withMessage("Verified must be boolean"),
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

      const { page = 1, limit = 20, role, verified, search } = req.query;

      const query = {};

      if (role) query.role = role;
      if (verified !== undefined) query.isVerified = verified === "true";

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "profile.college": { $regex: search, $options: "i" } },
        ];
      }

      const users = await User.find(query)
        .select(
          "-password -verificationToken -resetPasswordToken -resetPasswordExpires"
        )
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      res.json({
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Users can only view their own profile unless they're admin
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      // Return limited public info for non-admin users
      const publicUser = {
        _id: user._id,
        name: user.name,
        profile: {
          bio: user.profile.bio,
          college: user.profile.college,
          interests: user.profile.interests,
          avatar: user.profile.avatar,
        },
        createdAt: user.createdAt,
      };
      return res.json({ user: publicUser });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put(
  "/:id/role",
  [
    auth,
    admin,
    body("role").isIn(["user", "admin"]).withMessage("Invalid role"),
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

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent admin from demoting themselves
      if (
        req.user._id.toString() === req.params.id &&
        req.body.role !== "admin"
      ) {
        return res.status(400).json({ message: "Cannot demote yourself" });
      }

      user.role = req.body.role;
      await user.save();

      res.json({
        message: "User role updated successfully",
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error("Update user role error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/users/:id/verify
// @desc    Verify user account (admin only)
// @access  Private (Admin)
router.put(
  "/:id/verify",
  [
    auth,
    admin,
    body("verified").isBoolean().withMessage("Verified must be boolean"),
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

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isVerified = req.body.verified;
      if (req.body.verified) {
        user.verificationToken = undefined;
      }
      await user.save();

      res.json({
        message: `User ${
          req.body.verified ? "verified" : "unverified"
        } successfully`,
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error("Verify user error:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/users/:id
// @desc    Delete user account (admin only)
// @access  Private (Admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics (admin only)
// @access  Private (Admin)
router.get("/stats/overview", auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: "admin" });

    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Users who logged in recently
    const recentLogins = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
    });

    res.json({
      totalUsers,
      verifiedUsers,
      adminUsers,
      recentUsers,
      recentLogins,
      verificationRate:
        totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
