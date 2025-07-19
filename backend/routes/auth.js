const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth, admin } = require("../middleware/auth");
const {
  generateToken,
  createResetToken,
  hashString,
  sanitizeUser,
  isValidPassword,
} = require("../utils/auth");
const { sendEmail } = require("../services/emailService");
const router = express.Router();

// @route   GET /api/auth/health
// @desc    Health check for auth routes
// @access  Public
router.get("/health", (req, res) => {
  res.json({ message: "Auth routes are working" });
});

// @route   POST /api/auth/register
// @desc    Public registration disabled - Admin only user creation
// @access  Disabled
router.post("/register", async (req, res) => {
  return res.status(403).json({
    message:
      "Public registration is disabled. Contact admin to create an account.",
    error: "REGISTRATION_DISABLED",
  });
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update login info
      await user.updateLoginInfo();

      // Generate JWT token
      const token = generateToken({ id: user._id });

      res.json({
        message: "Login successful",
        token,
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post(
  "/verify-email",
  [body("token").notEmpty().withMessage("Verification token is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { token } = req.body;

      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }

      // Update user as verified
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Server error during verification" });
    }
  }
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
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

      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      }

      // Create reset token
      const { token, hashedToken, expires } = createResetToken();

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = expires;
      await user.save();

      // Send reset email
      try {
        await sendEmail({
          to: email,
          subject: "Password Reset Request",
          template: "password-reset",
          data: {
            name: user.name,
            resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
          },
        });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        return res
          .status(500)
          .json({ message: "Failed to send password reset email" });
      }

      res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .custom((value) => {
        if (!isValidPassword(value)) {
          throw new Error(
            "Password must contain at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
          );
        }
        return true;
      }),
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

      const { token, password } = req.body;

      // Hash the token to compare with stored hash
      const hashedToken = hashString(token);

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      // Update password and clear reset token
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/auth/change-password
// @desc    Change password for logged in user
// @access  Private
router.post(
  "/change-password",
  [
    auth,
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long")
      .custom((value) => {
        if (!isValidPassword(value)) {
          throw new Error(
            "Password must contain at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
          );
        }
        return true;
      }),
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

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select("+password");

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token invalidation)
// @access  Private
router.post("/logout", auth, (req, res) => {
  // In a more sophisticated setup, you might maintain a blacklist of invalidated tokens
  res.json({ message: "Logged out successfully" });
});

// @route   POST /api/auth/admin/create-user
// @desc    Admin creates a new user
// @access  Private (Admin only)
router.post(
  "/admin/create-user",
  [
    auth,
    admin,
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .isIn(["user", "admin", "moderator"])
      .withMessage("Invalid role specified"),
    body("department")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Department cannot exceed 100 characters"),
    body("position")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Position cannot exceed 100 characters"),
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

      const { name, email, password, role, department, position, bio } =
        req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await hashString(password);

      // Generate verification token
      const verificationToken = require("crypto")
        .randomBytes(32)
        .toString("hex");

      // Create user object
      const userData = {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        isVerified: false, // Users need to verify their email
        verificationToken,
        profile: {
          department: department || "",
          position: position || "",
          bio: bio || "",
          skills: [],
          socialLinks: {
            linkedin: "",
            twitter: "",
            github: "",
          },
        },
      };

      const user = new User(userData);
      await user.save();

      // Send verification email
      try {
        await sendEmail({
          to: email,
          subject: "Welcome to E-Cell - Verify Your Account",
          template: "verification",
          data: {
            name,
            verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
          },
        });
        console.log(`Verification email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Don't fail user creation if email fails, but log it
      }

      // Generate token for the new user
      const token = generateToken({ id: user._id });

      // Return sanitized user data
      const sanitizedUser = sanitizeUser(user);

      res.status(201).json({
        message:
          "User created successfully. Please check email for verification.",
        user: sanitizedUser,
        token,
      });
    } catch (error) {
      console.error("Admin create user error:", error);
      res.status(500).json({
        message: "Server error while creating user",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @route   GET /api/auth/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get("/admin/users", [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find({})
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
});

// @route   DELETE /api/auth/admin/users/:id
// @desc    Delete a user (Admin only)
// @access  Private (Admin only)
router.delete("/admin/users/:id", [auth, admin], async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Server error while deleting user",
    });
  }
});

module.exports = router;
