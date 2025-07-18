const { sendEmail } = require("./services/emailService");
require("dotenv").config();

async function testEmailService() {
  try {
    console.log("🔧 Email Configuration:");
    console.log("  Host:", process.env.EMAIL_HOST);
    console.log("  Port:", process.env.EMAIL_PORT);
    console.log("  User:", process.env.EMAIL_USER);
    console.log("  Pass:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");

    // Test sending a simple email
    const result = await sendEmail({
      to: "admin@ecell.com",
      subject: "Test Email from E-Cell Backend",
      template: "admin-notification",
      data: {
        name: "Admin",
        title: "Test Notification",
        message: "This is a test email to verify the email service is working.",
        actionUrl: "http://localhost:5173",
        actionText: "View Dashboard",
      },
    });

    console.log("✅ Email sent successfully:", result.messageId);
  } catch (error) {
    console.error("❌ Email test failed:", error);
  }

  process.exit(0);
}

testEmailService();
