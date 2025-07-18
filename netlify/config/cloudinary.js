const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with error handling
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Log Cloudinary configuration status (without sensitive data)
  console.log("🔧 Cloudinary Configuration:");
  console.log(
    "  Cloud Name:",
    process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "  API Key:",
    process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "  API Secret:",
    process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
  );
} catch (error) {
  console.error("❌ Cloudinary configuration error:", error.message);
}

// Set up storage with error handling
let storage = null;
try {
  // Configure Cloudinary storage for multer
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ecell-events", // Folder name in Cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: [
        { width: 1200, height: 600, crop: "fill", quality: "auto" }, // Event banner size
      ],
    },
  });
} catch (error) {
  console.error("❌ Cloudinary storage setup error:", error.message);
  // Create fallback local storage if Cloudinary setup fails
}

// Configure multer with error handling
let upload = null;
try {
  // Use Cloudinary storage if available, otherwise use memory storage
  upload = multer({
    storage: storage || multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept only image files
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"), false);
      }
    },
  });
} catch (error) {
  console.error("❌ Multer configuration error:", error.message);
  // Create a dummy upload middleware that rejects all uploads
  upload = {
    single: () => (req, res, next) => {
      next(new Error("File upload unavailable due to configuration error"));
    },
    array: () => (req, res, next) => {
      next(new Error("File upload unavailable due to configuration error"));
    },
  };
}

module.exports = { cloudinary, upload };
