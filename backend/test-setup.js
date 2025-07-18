// Test script to verify backend setup
console.log("🧪 Testing E-Cell Backend Setup...\n");

// Test environment variables
console.log("📝 Environment Configuration:");
require("dotenv").config();
console.log(`- Node Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`- Port: ${process.env.PORT || "5000"}`);
console.log(
  `- MongoDB URI: ${
    process.env.MONGODB_URI ? "✅ Configured" : "❌ Not configured"
  }`
);
console.log(
  `- JWT Secret: ${
    process.env.JWT_SECRET ? "✅ Configured" : "❌ Not configured"
  }`
);
console.log(
  `- Email Config: ${
    process.env.EMAIL_USER ? "✅ Configured" : "❌ Not configured"
  }`
);

// Test dependencies
console.log("\n📦 Testing Dependencies:");
try {
  require("express");
  console.log("✅ Express.js");
} catch (e) {
  console.log("❌ Express.js - ", e.message);
}

try {
  require("mongoose");
  console.log("✅ Mongoose");
} catch (e) {
  console.log("❌ Mongoose - ", e.message);
}

try {
  require("jsonwebtoken");
  console.log("✅ JWT");
} catch (e) {
  console.log("❌ JWT - ", e.message);
}

try {
  require("bcryptjs");
  console.log("✅ BCrypt");
} catch (e) {
  console.log("❌ BCrypt - ", e.message);
}

try {
  require("nodemailer");
  console.log("✅ Nodemailer");
} catch (e) {
  console.log("❌ Nodemailer - ", e.message);
}

try {
  require("express-validator");
  console.log("✅ Express Validator");
} catch (e) {
  console.log("❌ Express Validator - ", e.message);
}

// Test file structure
console.log("\n📁 Testing File Structure:");
const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "server.js",
  "package.json",
  ".env.example",
  "models/User.js",
  "models/Event.js",
  "routes/auth.js",
  "routes/events.js",
  "middleware/auth.js",
  "services/emailService.js",
];

requiredFiles.forEach((file) => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
  }
});

// Test models
console.log("\n🗃️ Testing Models:");
try {
  const User = require("./models/User");
  console.log("✅ User model");
} catch (e) {
  console.log("❌ User model - ", e.message);
}

try {
  const Event = require("./models/Event");
  console.log("✅ Event model");
} catch (e) {
  console.log("❌ Event model - ", e.message);
}

try {
  const Todo = require("./models/Todo");
  console.log("✅ Todo model");
} catch (e) {
  console.log("❌ Todo model - ", e.message);
}

try {
  const Meeting = require("./models/Meeting");
  console.log("✅ Meeting model");
} catch (e) {
  console.log("❌ Meeting model - ", e.message);
}

try {
  const Notification = require("./models/Notification");
  console.log("✅ Notification model");
} catch (e) {
  console.log("❌ Notification model - ", e.message);
}

console.log("\n🎉 Backend setup test completed!");
console.log("\n📋 Next Steps:");
console.log("1. Start MongoDB (mongod or MongoDB Atlas)");
console.log("2. Update .env file with your actual configuration");
console.log('3. Run "npm run dev" to start the development server');
console.log("4. Test the API at http://localhost:5000/health");
