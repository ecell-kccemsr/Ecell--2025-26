require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmailDirectly() {
  try {
    console.log("🔧 Direct Nodemailer Test:");
    console.log("  Host:", process.env.EMAIL_HOST);
    console.log("  Port:", process.env.EMAIL_PORT);
    console.log("  User:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test connection
    console.log("Testing connection...");
    await transporter.verify();
    console.log("✅ Connection verified");

    // Send test email
    const result = await transporter.sendMail({
      from: `E-Cell <${process.env.EMAIL_USER}>`,
      to: "admin@ecell.com",
      subject: "Direct Test Email",
      html: "<h1>Test Email</h1><p>This is a direct test email.</p>",
      text: "Test Email - This is a direct test email.",
    });

    console.log("✅ Email sent successfully:", result.messageId);
  } catch (error) {
    console.error("❌ Direct email test failed:", error);
  }

  process.exit(0);
}

testEmailDirectly();
