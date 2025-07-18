const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB and find a user
async function getUserForTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find a verified user with email preferences enabled
    const user = await User.findOne({
      isVerified: true,
      email: { $exists: true, $ne: "" },
      "preferences.emailNotifications": true,
    });

    if (user) {
      console.log("✅ Found test user:");
      console.log("  ID:", user._id);
      console.log("  Name:", user.name);
      console.log("  Email:", user.email);
      console.log(
        "  Email Notifications:",
        user.preferences.emailNotifications
      );
    } else {
      console.log("❌ No suitable user found");
      // Let's see what users exist
      const allUsers = await User.find().select(
        "_id name email isVerified preferences"
      );
      console.log("All users in database:", allUsers);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

getUserForTest();
