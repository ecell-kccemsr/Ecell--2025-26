require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: "admin@ecell.com" }, { role: "admin" }],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:", existingAdmin.email);
      console.log("   Role:", existingAdmin.role);
      console.log("   Name:", existingAdmin.name);
      return;
    }

    // Create admin user
    const adminPassword = "Admin@123"; // You can change this
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      name: "E-Cell Admin",
      email: "admin@ecell.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      profile: {
        department: "Administration",
        position: "System Administrator",
        bio: "E-Cell System Administrator with full access to all features.",
        skills: ["Administration", "Management", "Leadership"],
        socialLinks: {
          linkedin: "",
          twitter: "",
          github: "",
        },
      },
    });

    await adminUser.save();

    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email: admin@ecell.com");
    console.log("🔑 Password: Admin@123");
    console.log("👑 Role: admin");
    console.log("");
    console.log("⚠️  IMPORTANT: Change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createAdminUser();
