require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

async function checkEvent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const events = await Event.find().limit(3);
    console.log(`Found ${events.length} events`);

    events.forEach((event, index) => {
      console.log(`\n--- Event ${index + 1}: ${event.title} ---`);
      console.log("Image field:", event.image);
      console.log("Media field:", event.media);
      console.log("Has media.banner:", !!event.media?.banner);
      console.log("Has media.thumbnail:", !!event.media?.thumbnail);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

checkEvent();
