require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

async function fixEventImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find events that have image field but no media.thumbnail
    const eventsToFix = await Event.find({
      image: { $exists: true, $ne: null, $ne: "" },
      $or: [
        { "media.thumbnail": { $exists: false } },
        { "media.thumbnail": null },
        { "media.thumbnail": "" },
      ],
    });

    console.log(
      `Found ${eventsToFix.length} events that need image structure fix`
    );

    for (const event of eventsToFix) {
      console.log(`Fixing event: ${event.title}`);
      console.log(`  Current image: ${event.image}`);
      console.log(`  Current media:`, event.media);

      if (!event.media) {
        event.media = {};
      }

      // Set both banner and thumbnail to the same image for now
      event.media.banner = event.image;
      event.media.thumbnail = event.image;

      await event.save();
      console.log(`  ✅ Fixed - media.thumbnail: ${event.media.thumbnail}`);
    }

    console.log(`✅ Fixed ${eventsToFix.length} events`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing event images:", error);
    process.exit(1);
  }
}

fixEventImages();
