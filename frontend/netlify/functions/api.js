// Netlify function for all backend API endpoints
// This serves as a serverless implementation of the backend

// Mock database using in-memory storage (replaced with better storage in production)
// In a real serverless implementation, you would use:
// - FaunaDB, DynamoDB, or another serverless database
// - Netlify Key-Value store for smaller data needs
const db = {
  users: [
    {
      id: "user-admin",
      email: "admin@ecell.com",
      name: "Admin User",
      role: "admin",
      passwordHash: "adminpass", // In production, use proper password hashing
    },
    {
      id: "user-student",
      email: "student@ecell.com",
      name: "Student User",
      role: "student",
      passwordHash: "studentpass",
    },
    {
      id: "user-test",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      passwordHash: "testpass",
    },
  ],
  events: [
    {
      id: "event-001",
      title: "E-Cell Orientation",
      description: "Introduction to E-Cell and entrepreneurship opportunities",
      date: "2025-08-15T10:00:00Z",
      status: "published",
      type: "orientation",
      location: "Main Auditorium",
      featured: true,
      createdAt: "2025-07-01T10:00:00Z",
      updatedAt: "2025-07-10T10:00:00Z",
      image: "https://example.com/images/orientation.jpg",
    },
    {
      id: "event-002",
      title: "Startup Weekend",
      description: "Weekend hackathon for aspiring entrepreneurs",
      date: "2025-09-20T09:00:00Z",
      status: "published",
      type: "hackathon",
      location: "Innovation Center",
      featured: true,
      createdAt: "2025-07-05T10:00:00Z",
      updatedAt: "2025-07-10T10:00:00Z",
      image: "https://example.com/images/startup-weekend.jpg",
    },
    {
      id: "event-003",
      title: "Entrepreneur Talk Series",
      description: "Guest lecture by successful entrepreneurs",
      date: "2025-10-05T16:00:00Z",
      status: "draft",
      type: "talk",
      location: "Seminar Hall",
      featured: false,
      createdAt: "2025-07-08T10:00:00Z",
      updatedAt: "2025-07-10T10:00:00Z",
      image: "https://example.com/images/talk-series.jpg",
    },
  ],
  contacts: [],
};

// Helper functions
const generateToken = (user) => {
  // In a real implementation, use JWT with proper signing
  // For now, just create a simple encoded token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
};

const authenticateUser = (email, password) => {
  const user = db.users.find(
    (u) => u.email === email && u.passwordHash === password
  );
  if (!user) return null;

  // Don't return the password hash
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
};

// Core handler function
exports.handler = async function (event, context) {
  console.log(`API Handler: ${event.path} (${event.httpMethod})`);

  // CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Preflight request successful" }),
    };
  }

  // Extract path and determine API endpoint
  // Remove the /.netlify/functions/api prefix to get the actual endpoint
  const path = event.path.replace("/.netlify/functions/api", "");

  // Parse query parameters and body
  const queryParams = event.queryStringParameters || {};
  const body = event.body ? JSON.parse(event.body) : {};

  // Extract authentication token if present
  const authHeader = event.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  try {
    // Route handling based on path and method

    // Health check endpoint
    if (path === "/health" && event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "ok",
          message: "API is running",
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Authentication endpoints
    if (path === "/auth/login" && event.httpMethod === "POST") {
      const { email, password } = body;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Email and password are required" }),
        };
      }

      const user = authenticateUser(email, password);

      if (user) {
        const token = generateToken(user);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: "Login successful",
            token,
            user,
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            message: "Authentication failed",
            error: "Invalid email or password",
          }),
        };
      }
    }

    // Events endpoints
    if (path === "/events" && event.httpMethod === "GET") {
      // Filter events based on query parameters
      let filteredEvents = [...db.events];

      if (queryParams.status) {
        filteredEvents = filteredEvents.filter(
          (e) => e.status === queryParams.status
        );
      }

      if (queryParams.upcoming === "true") {
        const now = new Date();
        filteredEvents = filteredEvents.filter((e) => new Date(e.date) > now);
      }

      if (queryParams.featured === "true") {
        filteredEvents = filteredEvents.filter((e) => e.featured);
      }

      // Sort by date (newest first by default)
      filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(filteredEvents),
      };
    }

    if (path === "/events" && event.httpMethod === "POST") {
      // Would normally check authentication here
      const newEvent = {
        id: generateId("event"),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.events.push(newEvent);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newEvent),
      };
    }

    if (path.match(/^\/events\/[\w-]+$/) && event.httpMethod === "GET") {
      const eventId = path.split("/")[2];
      const event = db.events.find((e) => e.id === eventId);

      if (event) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(event),
        };
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Event not found" }),
        };
      }
    }

    if (path.match(/^\/events\/[\w-]+$/) && event.httpMethod === "DELETE") {
      const eventId = path.split("/")[2];
      const eventIndex = db.events.findIndex((e) => e.id === eventId);

      if (eventIndex >= 0) {
        const deletedEvent = db.events.splice(eventIndex, 1)[0];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: "Event deleted",
            event: deletedEvent,
          }),
        };
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Event not found" }),
        };
      }
    }

    // Contact form endpoint
    if (path === "/contact" && event.httpMethod === "POST") {
      const { name, email, message } = body;

      if (!name || !email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            message: "Name, email, and message are required",
          }),
        };
      }

      const newContact = {
        id: generateId("contact"),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      };

      db.contacts.push(newContact);

      // In a real implementation, you would send an email notification here

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: "Contact form submitted successfully",
          contact: newContact,
        }),
      };
    }

    // If no route matches
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Endpoint not found" }),
    };
  } catch (error) {
    console.error("API Error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    };
  }
};
