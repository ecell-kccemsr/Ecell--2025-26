require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const// Root endpoint for quick testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Cell API is running",
    timestamp: new Date().toISOString(),
    server: "Express",
    version: require('./package.json').version,
    routes: ["/health", "/api/auth", "/api/users", "/api/events"]
  });
});

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
    processUptime: process.uptime() + " seconds",
    memoryUsage: process.memoryUsage(),
  });
});ors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { cloudinary } = require("./config/cloudinary");

const app = express();

// CORS configuration - must come before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://ecell-2025-26.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
      undefined, // Allow requests with no origin (like mobile apps, curl, etc)
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Accept",
    "X-Requested-With",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // Cache preflight request for 1 day
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests separately
app.options("*", cors(corsOptions));

// Security middleware - must come after CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware - reduced chunk size to avoid warnings
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `📨 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

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

// Root endpoint for quick testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Cell API is running",
    timestamp: new Date().toISOString(),
    server: "Express",
    version: require('./package.json').version,
    routes: ["/health", "/api/auth", "/api/users", "/api/events"]
  });
});

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
    processUptime: process.uptime() + " seconds",
    memoryUsage: process.memoryUsage(),
  });
});

// Root endpoint for quick testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Cell API is running",
    timestamp: new Date().toISOString(),
    server: "Express",
    version: require('./package.json').version,
    endpoints: ["/health", "/api/auth", "/api/users", "/api/events"]
  });
});

// Error handling middleware
// CORS error handler
app.use((err, req, res, next) => {
  if (err.name === "CORSError") {
    console.error("CORS Error:", err.message);
    return res.status(403).json({
      message: "CORS error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Not allowed by CORS",
    });
  }
  next(err);
});

// General error handler
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

const PORT = process.env.PORT || 5001;

// Enhanced server startup with detailed logging
const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 E-Cell Backend Server Started at ${new Date().toISOString()}`);
  console.log(`==================================================`);
  console.log(`📋 Server Details:`);
  console.log(`  - Port: ${PORT}`);
  console.log(`  - Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`  - Process ID: ${process.pid}`);
  console.log(`  - Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
  console.log(
    `  - MongoDB URI: ${
      process.env.MONGODB_URI ? "Configured ✅" : "Missing ⚠️"
    }`
  );
  console.log(
    `  - Frontend URL: ${process.env.FRONTEND_URL || "https://ecell-2025-26.onrender.com"}`
  );
  console.log(`==================================================`);
  console.log(`🔒 CORS Configuration:`);
  console.log(`  - Origins: ${JSON.stringify(corsOptions.origin)}`);
  console.log(`  - Credentials: Enabled`);
  console.log(`  - Methods: ${corsOptions.methods.join(", ")}`);
  console.log(`==================================================`);
  
  // Log all environment variables (excluding sensitive ones)
  console.log(`🔧 Environment Variables:`);
  Object.keys(process.env).forEach(key => {
    if (!key.includes('KEY') && !key.includes('SECRET') && !key.includes('PASSWORD') && !key.includes('TOKEN')) {
      console.log(`  - ${key}: ${process.env[key]}`);
    } else {
      console.log(`  - ${key}: [REDACTED]`);
    }
  });
  console.log(`==================================================`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("❌ Server Error:", err.message);
  if (err.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} is already in use. Please choose a different port.`
    );
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});
