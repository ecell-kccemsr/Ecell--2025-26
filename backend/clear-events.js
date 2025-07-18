require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

async function clearEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Event.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} events`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing events:", error);
    process.exit(1);
  }
}

clearEvents();
