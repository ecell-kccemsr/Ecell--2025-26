const mongoose = require("mongoose");
const Event = require("../models/Event");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const predefinedEvents = [
  {
    title: "Orientation @",
    description:
      "E-cell members will be briefed about the objective and the future events with introduction to the core team",
    shortDescription: "Introduction to E-Cell objectives and core team",
    type: "seminar",
    category: "entrepreneurship",
    startDate: new Date("2025-07-15T10:00:00.000Z"),
    endDate: new Date("2025-07-15T12:00:00.000Z"),
    location: {
      type: "offline",
      venue: "Seminar Hall",
      address: "College Campus",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    },
    registration: {
      required: true,
      deadline: new Date("2025-07-14T23:59:59.000Z"),
      maxParticipants: 100,
      fees: {
        amount: 0,
        currency: "INR",
      },
      rsvp: {
        enabled: true,
        type: "luma",
        externalLink: "https://lu.ma/ecell-orientation",
        buttonText: "Register on Luma",
      },
    },
    status: "published",
    featured: true,
    visibility: "public",
    media: {
      banner:
        "https://via.placeholder.com/800x400/667eea/ffffff?text=E-Cell+Orientation",
      thumbnail:
        "https://via.placeholder.com/400x200/667eea/ffffff?text=Orientation",
    },
    tags: ["orientation", "introduction", "networking"],
  },
  {
    title: "Git-Github @",
    description:
      "Basics of Git and Github, its importance, Github Education Plan (how to avail github copilot Pro for free) & practice on git-github like push-pull project, merge project, open source contribution, github branches.",
    shortDescription: "Hands-on workshop on Git and Github fundamentals",
    type: "workshop",
    category: "technology",
    startDate: new Date("2025-07-20T14:00:00.000Z"),
    endDate: new Date("2025-07-20T17:00:00.000Z"),
    location: {
      type: "offline",
      venue: "Computer Lab",
      address: "College Campus",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    },
    registration: {
      required: true,
      deadline: new Date("2025-07-19T23:59:59.000Z"),
      maxParticipants: 50,
      fees: {
        amount: 0,
        currency: "INR",
      },
      rsvp: {
        enabled: true,
        type: "luma",
        externalLink: "https://lu.ma/ecell-git-github",
        buttonText: "Register on Luma",
      },
    },
    status: "published",
    featured: true,
    visibility: "public",
    media: {
      banner:
        "https://via.placeholder.com/800x400/28a745/ffffff?text=Git+GitHub+Workshop",
      thumbnail:
        "https://via.placeholder.com/400x200/28a745/ffffff?text=Git+GitHub",
    },
    tags: ["git", "github", "programming", "open-source", "workshop"],
  },
  {
    title: "LinkedIn and Networking",
    description:
      "Teaching how to make and optimize your linkedin profile, how to post things, free tools which work like linked in navigator tools, Building CV and its importance. How to create a public portfolio, how much its important, how to make your public portfolio visible through git-github",
    shortDescription:
      "Master LinkedIn optimization and professional networking",
    type: "seminar",
    category: "business",
    startDate: new Date("2025-07-25T15:00:00.000Z"),
    endDate: new Date("2025-07-25T17:00:00.000Z"),
    location: {
      type: "online",
      platform: "Zoom",
      onlineLink: "https://zoom.us/j/123456789",
    },
    registration: {
      required: true,
      deadline: new Date("2025-07-24T23:59:59.000Z"),
      maxParticipants: 200,
      fees: {
        amount: 0,
        currency: "INR",
      },
      rsvp: {
        enabled: true,
        type: "luma",
        externalLink: "https://lu.ma/ecell-linkedin-networking",
        buttonText: "Register on Luma",
      },
    },
    status: "published",
    featured: true,
    visibility: "public",
    media: {
      banner:
        "https://via.placeholder.com/800x400/3182ce/ffffff?text=LinkedIn+Networking",
      thumbnail:
        "https://via.placeholder.com/400x200/3182ce/ffffff?text=LinkedIn",
    },
    tags: [
      "linkedin",
      "networking",
      "portfolio",
      "cv",
      "professional-development",
    ],
  },
  {
    title: "Introduction to GameDev",
    description:
      "Basic of graphics, tools used in gamedev, making simple games using unity",
    shortDescription: "Learn game development basics with Unity",
    type: "workshop",
    category: "technology",
    startDate: new Date("2025-08-05T14:00:00.000Z"),
    endDate: new Date("2025-08-05T17:00:00.000Z"),
    location: {
      type: "hybrid",
      venue: "Computer Lab",
      address: "College Campus",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      platform: "Zoom",
      onlineLink: "https://zoom.us/j/987654321",
    },
    registration: {
      required: true,
      deadline: new Date("2025-08-04T23:59:59.000Z"),
      maxParticipants: 40,
      fees: {
        amount: 0,
        currency: "INR",
      },
      rsvp: {
        enabled: true,
        type: "luma",
        externalLink: "https://lu.ma/ecell-gamedev-intro",
        buttonText: "Register on Luma",
      },
    },
    status: "published",
    featured: true,
    visibility: "public",
    media: {
      banner:
        "https://via.placeholder.com/800x400/805ad5/ffffff?text=GameDev+Workshop",
      thumbnail:
        "https://via.placeholder.com/400x200/805ad5/ffffff?text=GameDev",
    },
    tags: ["gamedev", "unity", "graphics", "programming", "workshop"],
  },
  {
    title: "Ideathon & B-plan Auctions",
    description:
      "An ideathon presentation in group to present your ideas & A panel of judges who will decide the winner (for both best judge & idea we will award)",
    shortDescription: "Present your innovative ideas and business plans",
    type: "competition",
    category: "entrepreneurship",
    startDate: new Date("2025-08-15T10:00:00.000Z"),
    endDate: new Date("2025-08-15T18:00:00.000Z"),
    location: {
      type: "offline",
      venue: "Seminar Hall",
      address: "College Campus",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    },
    registration: {
      required: true,
      deadline: new Date("2025-08-10T23:59:59.000Z"),
      maxParticipants: 100,
      fees: {
        amount: 0,
        currency: "INR",
      },
      rsvp: {
        enabled: true,
        type: "luma",
        externalLink: "https://lu.ma/ecell-ideathon-bplan",
        buttonText: "Register on Luma",
      },
    },
    status: "published",
    featured: true,
    visibility: "public",
    media: {
      banner:
        "https://via.placeholder.com/800x400/e53e3e/ffffff?text=Ideathon+Competition",
      thumbnail:
        "https://via.placeholder.com/400x200/e53e3e/ffffff?text=Ideathon",
    },
    tags: [
      "ideathon",
      "business-plan",
      "competition",
      "innovation",
      "entrepreneurship",
    ],
  },
];

const seedEvents = async () => {
  try {
    await connectDB();

    // Clear existing events (optional)
    // await Event.deleteMany({});

    // Find a user to be the organizer (you might need to adjust this)
    const User = require("../models/User");
    let organizer = await User.findOne({ role: "admin" });

    if (!organizer) {
      // Create a default organizer if none exists
      organizer = await User.create({
        name: "E-Cell Admin",
        email: "admin@ecell.com",
        password: "tempPassword123", // This should be hashed
        role: "admin",
        isVerified: true,
      });
    }

    // Add organizer to all events
    const eventsWithOrganizer = predefinedEvents.map((event) => ({
      ...event,
      organizer: organizer._id,
    }));

    // Insert events
    const createdEvents = await Event.insertMany(eventsWithOrganizer);
    console.log(`✅ Successfully created ${createdEvents.length} events`);

    // Display created events
    createdEvents.forEach((event) => {
      console.log(`📅 ${event.title} - ${event.startDate.toDateString()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedEvents();
}

module.exports = { seedEvents, predefinedEvents };
