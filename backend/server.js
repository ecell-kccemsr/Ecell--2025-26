require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { cloudinary } = require("./config/cloudinary");

const app = express();

// CORS configuration - must come before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://ecell-2025-26.onrender.com",
      "https://kcecell25.netlify.app",  // Your Netlify frontend domain
      "https://kcecell001.netlify.app", // New Netlify frontend domain
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

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://ecell-2025-26.onrender.com",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

// Root endpoint for quick testing - available before database connection
app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Cell API is running",
    timestamp: new Date().toISOString(),
    server: "Express",
    version: require("./package.json").version,
    routes: ["/health", "/api/auth", "/api/users", "/api/events"],
  });
});

// Health check endpoint - available before database connection
app.get("/health", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  let cloudinaryStatus = "Not initialized";

  try {
    const { cloudinary } = require("./config/cloudinary");
    cloudinaryStatus = cloudinary.config().cloud_name
      ? "Configured"
      : "Not configured";
  } catch (error) {
    cloudinaryStatus = `Error: ${error.message}`;
  }

  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoStatus,
    cloudinary: cloudinaryStatus,
    processUptime: process.uptime() + " seconds",
    memoryUsage: process.memoryUsage(),
  });
});

// Initialize services with proper error handling
const initializeServices = async () => {
  // Initialize Cloudinary safely
  try {
    const { cloudinary } = require("./config/cloudinary");
    console.log("✅ Cloudinary module loaded");

    try {
      await cloudinary.api.ping();
      console.log("✅ Cloudinary connected successfully");
      console.log(`☁️  Cloud Name: ${cloudinary.config().cloud_name}`);
    } catch (error) {
      console.error(
        "⚠️ Cloudinary ping failed, but continuing:",
        error.message
      );
      // Continue even if ping fails
    }
  } catch (error) {
    console.error("❌ Failed to load Cloudinary module:", error.message);
    // Continue without Cloudinary if it fails
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecell_db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ MongoDB connected successfully");
    console.log(`📁 Database: ${mongoose.connection.name}`);

    // Start notification scheduler after database connection
    try {
      const notificationService = require("./services/notificationService");
      notificationService.startEventReminderScheduler();
      console.log("📧 Event notification scheduler started");
    } catch (error) {
      console.error("⚠️ Notification scheduler error:", error.message);
      // Continue without notifications if they fail
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Continue without MongoDB if it fails
  }

  // Initialize routes with better error handling
  const routes = [
    { path: "/api/auth", module: "./routes/auth" },
    { path: "/api/users", module: "./routes/users" },
    { path: "/api/events", module: "./routes/events" },
    { path: "/api/todos", module: "./routes/todos" },
    { path: "/api/meetings", module: "./routes/meetings" },
    { path: "/api/notifications", module: "./routes/notifications" },
    { path: "/api/contact", module: "./routes/contact" }
  ];
  
  // Load each route individually for better error isolation
  let successCount = 0;
  for (const route of routes) {
    try {
      const routeModule = require(route.module);
      app.use(route.path, routeModule);
      console.log(`✅ Route loaded: ${route.path}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to load route ${route.path}:`, error.message);
    }
  }
  
  console.log(`${successCount}/${routes.length} API routes loaded successfully`);
  if (successCount < routes.length) {
    console.warn("⚠️ Some API routes failed to load. Check errors above.");
  }
};

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
  console.error("❌ Server Error:", err.stack);
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

// Start server and initialize services
const startServer = async () => {
  try {
    // Initialize services before starting the server
    await initializeServices();

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(
        `🚀 E-Cell Backend Server Started at ${new Date().toISOString()}`
      );
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
        `  - Frontend URL: ${
          process.env.FRONTEND_URL || "https://ecell-2025-26.onrender.com"
        }`
      );
      console.log(`==================================================`);
      console.log(`🔒 CORS Configuration:`);
      console.log(`  - Origins: ${JSON.stringify(corsOptions.origin)}`);
      console.log(`  - Credentials: Enabled`);
      console.log(`  - Methods: ${corsOptions.methods.join(", ")}`);
      console.log(`==================================================`);

      // Log environment variables
      try {
        console.log(`🔧 Environment Variables:`);
        Object.keys(process.env).forEach((key) => {
          if (
            !key.includes("KEY") &&
            !key.includes("SECRET") &&
            !key.includes("PASSWORD") &&
            !key.includes("TOKEN")
          ) {
            console.log(`  - ${key}: ${process.env[key]}`);
          } else {
            console.log(`  - ${key}: [REDACTED]`);
          }
        });
      } catch (error) {
        console.error(
          "⚠️ Error printing environment variables:",
          error.message
        );
      }
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
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  // Don't exit the process in production, just log the error
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Don't exit the process in production, just log the error
});

// Start the server
startServer();
