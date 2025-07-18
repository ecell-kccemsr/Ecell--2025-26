require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { cloudinary } = require("./config/cloudinary");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecell_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📁 Database: ${mongoose.connection.name}`);

    // Start notification scheduler after database connection
    const notificationService = require("./services/notificationService");
    notificationService.startEventReminderScheduler();
    console.log("📧 Event notification scheduler started");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connected successfully");
    console.log(`☁️  Cloud Name: ${cloudinary.config().cloud_name}`);
  } catch (error) {
    console.error("❌ Cloudinary connection error:", error.message);
  }
};

// Test connections
testCloudinaryConnection();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/events", require("./routes/events"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/meetings", require("./routes/meetings"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/contact", require("./routes/contact"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
