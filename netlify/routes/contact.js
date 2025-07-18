const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const notificationService = require("../services/notificationService");
const router = express.Router();

// Rate limiting for contact form submissions
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    message: "Too many contact form submissions. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  "/",
  contactRateLimit,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage("Please provide a valid phone number"),
    body("subject")
      .trim()
      .notEmpty()
      .withMessage("Subject is required")
      .isLength({ min: 5, max: 200 })
      .withMessage("Subject must be between 5 and 200 characters"),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters"),
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

      const { name, email, phone, subject, message } = req.body;

      // Prepare email content for admins
      const adminEmailData = {
        to: process.env.ADMIN_EMAIL || "admin@ecell.com",
        subject: `New Contact Form Submission - ${subject}`,
        templateData: {
          senderName: name,
          senderEmail: email,
          senderPhone: phone,
          subject: subject,
          message: message,
          submissionDate: new Date().toLocaleString(),
          replyToEmail: email,
        },
      };

      // Send notification email to admins
      await notificationService.sendContactFormNotification(adminEmailData);

      // Prepare confirmation email for the user
      const userEmailData = {
        to: email,
        subject: "Thank you for contacting E-Cell!",
        templateData: {
          name: name,
          subject: subject,
          message: message,
          submissionDate: new Date().toLocaleString(),
        },
      };

      // Send confirmation email to user
      await notificationService.sendContactConfirmation(userEmailData);

      res.status(200).json({
        message:
          "Contact form submitted successfully. We'll get back to you soon!",
        success: true,
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      res.status(500).json({
        message: "Failed to submit contact form. Please try again later.",
        success: false,
      });
    }
  }
);

module.exports = router;
