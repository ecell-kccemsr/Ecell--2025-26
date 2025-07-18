const mongoose = require("mongoose");
const notificationService = require("./services/notificationService");
require("dotenv").config();

// Connect to MongoDB
async function testEmailNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test creating a simple notification with a valid type
    const testNotification = await notificationService.createNotification({
      recipient: "6877f5c26f5d67929b92d1e3", // Real admin user ID
      type: "event_reminder", // Using a valid enum value
      title: "Test Email Notification",
      message:
        "This is a test email notification to check if emails are working.",
      data: {
        eventTitle: "Test Event",
        eventDate: new Date().toLocaleDateString(),
        eventLocation: "Online",
      },
      channels: {
        inApp: { enabled: true },
        email: { enabled: true },
      },
      actionUrl: "/events/test",
      actionText: "View Event",
    });

    console.log("✅ Test notification created:", testNotification._id);
  } catch (error) {
    console.error("❌ Error testing email notifications:", error);
  } finally {
    process.exit(0);
  }
}

testEmailNotifications();
