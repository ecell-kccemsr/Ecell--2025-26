require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function checkAndCreateAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin exists
    const admin = await User.findOne({ email: "admin@ecell.com" }).select(
      "+password"
    );

    if (admin) {
      console.log("✅ Admin user found:", admin.email, "Role:", admin.role);
      console.log("Password field present:", !!admin.password);
      console.log(
        "Password length:",
        admin.password ? admin.password.length : "N/A"
      );

      if (admin.password) {
        console.log("Testing password comparison...");
        const isMatch = await admin.comparePassword("Admin@123");
        console.log("Password match:", isMatch);
      } else {
        console.log("❌ Password field is missing - recreating admin user...");

        // Delete the existing admin and recreate
        await User.deleteOne({ email: "admin@ecell.com" });

        const newAdmin = new User({
          name: "E-Cell Admin",
          email: "admin@ecell.com",
          password: "Admin@123",
          role: "admin",
          isVerified: true,
        });

        await newAdmin.save();
        console.log("✅ Admin user recreated with password!");
      }
    } else {
      console.log("❌ Admin user not found");

      // Create admin user
      console.log("Creating admin user...");
      const adminUser = new User({
        name: "E-Cell Admin",
        email: "admin@ecell.com",
        password: "Admin@123", // Will be hashed by the User model
        role: "admin",
        isVerified: true,
      });

      await adminUser.save();
      console.log("✅ Admin user created successfully!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkAndCreateAdmin();
