const fs = require('fs');
const path = require('path');

console.log("=== ECELL Server Startup Test ===");
console.log("Testing module loading...");

try {
  console.log("Loading dotenv...");
  require("dotenv").config();
  console.log("✅ dotenv loaded");
} catch (error) {
  console.error("❌ Error loading dotenv:", error.message);
}

try {
  console.log("\nLoading express...");
  const express = require("express");
  console.log("✅ express loaded");
} catch (error) {
  console.error("❌ Error loading express:", error.message);
}

try {
  console.log("\nLoading mongoose...");
  const mongoose = require("mongoose");
  console.log("✅ mongoose loaded");
} catch (error) {
  console.error("❌ Error loading mongoose:", error.message);
}

try {
  console.log("\nLoading cloudinary config...");
  const { cloudinary, upload } = require("./config/cloudinary");
  console.log("✅ cloudinary config loaded");
  console.log("  upload middleware:", upload ? "Available" : "Not available");
} catch (error) {
  console.error("❌ Error loading cloudinary config:", error.message, error.stack);
}

// Test loading routes
console.log("\n=== Testing Routes Loading ===");
const routes = [
  "auth", "users", "events", "todos", "meetings", "notifications", "calendar", "contact"
];

routes.forEach(route => {
  try {
    console.log(`Loading ${route} route...`);
    const routeModule = require(`./routes/${route}`);
    console.log(`✅ ${route} route loaded`);
  } catch (error) {
    console.error(`❌ Error loading ${route} route:`, error.message);
    console.error(error.stack);
  }
});

console.log("\n=== Environment Variables Check ===");
console.log("  MONGODB_URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing");
console.log("  JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
console.log("  CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing");
console.log("  CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
console.log("  CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

console.log("\n=== Complete! ===");
