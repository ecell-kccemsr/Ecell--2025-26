// Test script to check if the cloudinary module is loading correctly
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

try {
  // Configure Cloudinary with error handling
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "test-cloud-name",
    api_key: process.env.CLOUDINARY_API_KEY || "test-api-key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "test-api-secret",
  });

  console.log("✅ Cloudinary module loaded successfully");
  console.log("Configuration:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "PRESENT" : "MISSING",
    api_key: process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING",
  });

  // Test the connection to Cloudinary API
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error("❌ Cloudinary API connection failed:", error.message);
    } else {
      console.log("✅ Cloudinary API connection successful:", result.status);
    }
  });
} catch (error) {
  console.error("❌ Error loading cloudinary module:", error.message);
}
