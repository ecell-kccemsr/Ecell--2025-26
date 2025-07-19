const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Calendar functionality removed - simplified placeholder

// @route   GET /api/calendar/status
// @desc    Get calendar integration status
// @access  Private
router.get("/status", auth, async (req, res) => {
  try {
    res.json({
      message: "Calendar functionality has been disabled",
      status: "disabled"
    });
  } catch (error) {
    console.error("Calendar status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post(
  "/google/connect",
  [auth, body("code").notEmpty().withMessage("Authorization code is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { code } = req.body;

      // Initialize OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Update user preferences
      const User = require("../models/User");
      const user = await User.findById(req.user._id);

      user.preferences.calendarIntegration.google.enabled = true;
      user.preferences.calendarIntegration.google.refreshToken =
        tokens.refresh_token;
      await user.save();

      res.json({
        message: "Google Calendar connected successfully",
        connected: true,
      });
    } catch (error) {
      console.error("Google Calendar connection error:", error);
      res.status(500).json({ message: "Failed to connect Google Calendar" });
    }
  }
);

// @route   POST /api/calendar/google/disconnect
// @desc    Disconnect Google Calendar
// @access  Private
router.post("/google/disconnect", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user._id);

    user.preferences.calendarIntegration.google.enabled = false;
    user.preferences.calendarIntegration.google.refreshToken = undefined;
    await user.save();

    res.json({
      message: "Google Calendar disconnected successfully",
      connected: false,
    });
  } catch (error) {
    console.error("Google Calendar disconnection error:", error);
    res.status(500).json({ message: "Failed to disconnect Google Calendar" });
  }
});

// @route   POST /api/calendar/outlook/connect
// @desc    Connect Outlook Calendar
// @access  Private
router.post(
  "/outlook/connect",
  [auth, body("code").notEmpty().withMessage("Authorization code is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { code } = req.body;

      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        new URLSearchParams({
          client_id: process.env.OUTLOOK_CLIENT_ID,
          client_secret: process.env.OUTLOOK_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
          grant_type: "authorization_code",
          scope:
            "https://graph.microsoft.com/Calendars.ReadWrite offline_access",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { refresh_token } = tokenResponse.data;

      // Update user preferences
      const User = require("../models/User");
      const user = await User.findById(req.user._id);

      user.preferences.calendarIntegration.outlook.enabled = true;
      user.preferences.calendarIntegration.outlook.refreshToken = refresh_token;
      await user.save();

      res.json({
        message: "Outlook Calendar connected successfully",
        connected: true,
      });
    } catch (error) {
      console.error("Outlook Calendar connection error:", error);
      res.status(500).json({ message: "Failed to connect Outlook Calendar" });
    }
  }
);

// @route   POST /api/calendar/outlook/disconnect
// @desc    Disconnect Outlook Calendar
// @access  Private
router.post("/outlook/disconnect", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user._id);

    user.preferences.calendarIntegration.outlook.enabled = false;
    user.preferences.calendarIntegration.outlook.refreshToken = undefined;
    await user.save();

    res.json({
      message: "Outlook Calendar disconnected successfully",
      connected: false,
    });
  } catch (error) {
    console.error("Outlook Calendar disconnection error:", error);
    res.status(500).json({ message: "Failed to disconnect Outlook Calendar" });
  }
});

// @route   GET /api/calendar/status
// @desc    Get calendar integration status
// @access  Private
router.get("/status", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user._id);

    res.json({
      google: {
        connected: user.preferences.calendarIntegration.google.enabled,
        hasRefreshToken:
          !!user.preferences.calendarIntegration.google.refreshToken,
      },
      outlook: {
        connected: user.preferences.calendarIntegration.outlook.enabled,
        hasRefreshToken:
          !!user.preferences.calendarIntegration.outlook.refreshToken,
      },
    });
  } catch (error) {
    console.error("Get calendar status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calendar/sync/event/:eventId
// @desc    Sync event to connected calendars
// @access  Private
router.post("/sync/event/:eventId", auth, async (req, res) => {
  try {
    const Event = require("../models/Event");
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is registered for the event
    const isParticipant = event.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Must be registered for event to sync" });
    }

    const User = require("../models/User");
    const user = await User.findById(req.user._id);
    const results = {};

    // Sync to Google Calendar
    if (user.preferences.calendarIntegration.google.enabled) {
      try {
        const googleEventId = await syncToGoogleCalendar(user, event);
        results.google = { success: true, eventId: googleEventId };
      } catch (error) {
        console.error("Google Calendar sync error:", error);
        results.google = { success: false, error: error.message };
      }
    }

    // Sync to Outlook Calendar
    if (user.preferences.calendarIntegration.outlook.enabled) {
      try {
        const outlookEventId = await syncToOutlookCalendar(user, event);
        results.outlook = { success: true, eventId: outlookEventId };
      } catch (error) {
        console.error("Outlook Calendar sync error:", error);
        results.outlook = { success: false, error: error.message };
      }
    }

    if (Object.keys(results).length === 0) {
      return res
        .status(400)
        .json({ message: "No calendar integrations enabled" });
    }

    res.json({
      message: "Calendar sync completed",
      results,
    });
  } catch (error) {
    console.error("Calendar sync error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calendar/sync/meeting/:meetingId
// @desc    Sync meeting to connected calendars
// @access  Private
router.post("/sync/meeting/:meetingId", auth, async (req, res) => {
  try {
    const Meeting = require("../models/Meeting");
    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Check if user has access to this meeting
    if (
      !meeting.isParticipant(req.user._id) &&
      meeting.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const User = require("../models/User");
    const user = await User.findById(req.user._id);
    const results = {};

    // Sync to Google Calendar
    if (user.preferences.calendarIntegration.google.enabled) {
      try {
        const googleEventId = await syncMeetingToGoogleCalendar(user, meeting);
        results.google = { success: true, eventId: googleEventId };
      } catch (error) {
        console.error("Google Calendar sync error:", error);
        results.google = { success: false, error: error.message };
      }
    }

    // Sync to Outlook Calendar
    if (user.preferences.calendarIntegration.outlook.enabled) {
      try {
        const outlookEventId = await syncMeetingToOutlookCalendar(
          user,
          meeting
        );
        results.outlook = { success: true, eventId: outlookEventId };
      } catch (error) {
        console.error("Outlook Calendar sync error:", error);
        results.outlook = { success: false, error: error.message };
      }
    }

    if (Object.keys(results).length === 0) {
      return res
        .status(400)
        .json({ message: "No calendar integrations enabled" });
    }

    res.json({
      message: "Calendar sync completed",
      results,
    });
  } catch (error) {
    console.error("Calendar sync error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to sync event to Google Calendar
async function syncToGoogleCalendar(user, event) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: user.preferences.calendarIntegration.google.refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const calendarEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: event.startDate.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: event.endDate.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    location:
      event.location.type === "online"
        ? event.location.onlineLink
        : event.location.venue,
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: calendarEvent,
  });

  return response.data.id;
}

// Helper function to sync meeting to Google Calendar
async function syncMeetingToGoogleCalendar(user, meeting) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: user.preferences.calendarIntegration.google.refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const calendarEvent = {
    summary: meeting.title,
    description: meeting.description,
    start: {
      dateTime: meeting.startTime.toISOString(),
      timeZone: meeting.timezone,
    },
    end: {
      dateTime: meeting.endTime.toISOString(),
      timeZone: meeting.timezone,
    },
    location:
      meeting.location.type === "online"
        ? meeting.location.onlineLink
        : meeting.location.venue,
    conferenceData:
      meeting.location.type === "online"
        ? {
            entryPoints: [
              {
                entryPointType: "video",
                uri: meeting.location.onlineLink,
              },
            ],
          }
        : undefined,
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: calendarEvent,
    conferenceDataVersion: 1,
  });

  return response.data.id;
}

// Helper function to sync event to Outlook Calendar
async function syncToOutlookCalendar(user, event) {
  // Get access token using refresh token
  const tokenResponse = await axios.post(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET,
      refresh_token: user.preferences.calendarIntegration.outlook.refreshToken,
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/Calendars.ReadWrite",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const calendarEvent = {
    subject: event.title,
    body: {
      contentType: "HTML",
      content: event.description,
    },
    start: {
      dateTime: event.startDate.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: event.endDate.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    location: {
      displayName:
        event.location.type === "online" ? "Online" : event.location.venue,
    },
  };

  const response = await axios.post(
    "https://graph.microsoft.com/v1.0/me/events",
    calendarEvent,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.id;
}

// Helper function to sync meeting to Outlook Calendar
async function syncMeetingToOutlookCalendar(user, meeting) {
  // Get access token using refresh token
  const tokenResponse = await axios.post(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET,
      refresh_token: user.preferences.calendarIntegration.outlook.refreshToken,
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/Calendars.ReadWrite",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const calendarEvent = {
    subject: meeting.title,
    body: {
      contentType: "HTML",
      content: meeting.description,
    },
    start: {
      dateTime: meeting.startTime.toISOString(),
      timeZone: meeting.timezone,
    },
    end: {
      dateTime: meeting.endTime.toISOString(),
      timeZone: meeting.timezone,
    },
    location: {
      displayName:
        meeting.location.type === "online" ? "Online" : meeting.location.venue,
    },
    isOnlineMeeting: meeting.location.type === "online",
    onlineMeetingUrl: meeting.location.onlineLink,
  };

  const response = await axios.post(
    "https://graph.microsoft.com/v1.0/me/events",
    calendarEvent,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.id;
}

// @route   ANY /api/calendar/*
// @desc    Catch-all for any calendar requests
// @access  Private
router.all("*", auth, (req, res) => {
  res.status(200).json({
    message: "Calendar integration functionality has been removed",
    status: "disabled"
  });
});

module.exports = router;
