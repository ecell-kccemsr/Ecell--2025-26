# E-Cell Admin Panel API Documentation

## 🎯 Overview

This document outlines the admin panel functionality for the E-Cell website. Admins can create, manage, and monitor events with comprehensive features including sponsor management and external RSVP integration.

## 🔐 Authentication

All admin panel endpoints require:

- Valid JWT token in Authorization header: `Bearer <token>`
- User role must be `admin`

## 📅 Event Management

### Create Event

**POST** `/api/events`

**Admin Panel Features:**

- Complete event creation with all details
- Sponsor management with tier system
- External RSVP integration (Luma, Google Forms, etc.)
- Rich media support (banners, thumbnails, gallery)

**Request Body:**

```json
{
  "title": "Startup Pitch Competition 2025",
  "description": "Annual startup pitch competition for emerging entrepreneurs",
  "shortDescription": "Compete with the best startup ideas",
  "type": "competition",
  "category": "entrepreneurship",
  "startDate": "2025-08-15T10:00:00.000Z",
  "endDate": "2025-08-15T18:00:00.000Z",
  "location": {
    "type": "offline",
    "venue": "E-Cell Auditorium",
    "address": "College Campus, Main Building",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "registration": {
    "required": true,
    "deadline": "2025-08-10T23:59:59.000Z",
    "maxParticipants": 100,
    "fees": {
      "amount": 500,
      "currency": "INR"
    },
    "rsvp": {
      "enabled": true,
      "type": "luma",
      "externalLink": "https://lu.ma/startup-pitch-2025",
      "buttonText": "Register on Luma"
    }
  },
  "speakers": [
    {
      "name": "John Doe",
      "designation": "CEO",
      "company": "TechCorp",
      "bio": "Serial entrepreneur with 15+ years experience",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  ],
  "sponsors": [
    {
      "name": "TechCorp India",
      "logo": "https://example.com/logos/techcorp.png",
      "website": "https://techcorp.in",
      "tier": "title",
      "description": "Leading technology company",
      "featured": true
    },
    {
      "name": "StartupHub",
      "logo": "https://example.com/logos/startuphub.png",
      "website": "https://startuphub.com",
      "tier": "gold",
      "description": "Startup incubator and accelerator"
    }
  ],
  "media": {
    "banner": "https://example.com/banners/event-banner.jpg",
    "thumbnail": "https://example.com/thumbnails/event-thumb.jpg",
    "gallery": [
      "https://example.com/gallery/img1.jpg",
      "https://example.com/gallery/img2.jpg"
    ]
  },
  "agenda": [
    {
      "time": "10:00 AM",
      "title": "Registration & Welcome",
      "duration": 30
    },
    {
      "time": "10:30 AM",
      "title": "Keynote Speech",
      "speaker": "John Doe",
      "duration": 60
    }
  ],
  "tags": ["startup", "pitch", "competition", "entrepreneurs"],
  "status": "draft",
  "featured": true,
  "visibility": "public"
}
```

**Response:**

```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "event_id",
    "title": "Startup Pitch Competition 2025"
    // ... full event object
  }
}
```

### RSVP Types Supported

1. **Internal** (`internal`): Use built-in registration system
2. **Luma** (`luma`): Link to Luma event page
3. **Google Forms** (`google_forms`): Link to Google Forms
4. **External** (`external`): Any other external registration link

### Sponsor Tiers

- `title` - Title Sponsor (highest tier)
- `presenting` - Presenting Sponsor
- `gold` - Gold Sponsor
- `silver` - Silver Sponsor
- `bronze` - Bronze Sponsor
- `partner` - Partner
- `supporter` - Supporter (lowest tier)

### Update Event

**PUT** `/api/events/:id`

Same request body structure as create, all fields optional.

### Update Event Status

**PUT** `/api/events/:id/status`

**Request Body:**

```json
{
  "status": "published"
}
```

**Status Options:**

- `draft` - Event is being created/edited
- `published` - Event is live and visible to users
- `cancelled` - Event is cancelled
- `completed` - Event is finished

### Duplicate Event

**POST** `/api/events/:id/duplicate`

Creates a copy of an existing event with "draft" status.

### Delete Event

**DELETE** `/api/events/:id`

Permanently deletes an event.

## 📊 Admin Dashboard

### Get Dashboard Overview

**GET** `/api/events/admin/dashboard`

**Response:**

```json
{
  "overview": {
    "totalEvents": 45,
    "publishedEvents": 32,
    "draftEvents": 8,
    "upcomingEvents": 12,
    "thisMonthEvents": 5,
    "thisWeekEvents": 2,
    "totalRegistrations": 1250
  },
  "recentEvents": [
    {
      "_id": "event_id",
      "title": "Recent Event",
      "status": "published",
      "startDate": "2025-08-15T10:00:00.000Z",
      "participants": [],
      "analytics": {
        "views": 150,
        "registrations": 45
      }
    }
  ],
  "eventTypesDistribution": [
    { "_id": "workshop", "count": 15 },
    { "_id": "seminar", "count": 12 },
    { "_id": "competition", "count": 8 }
  ],
  "topEventsByRegistration": [
    {
      "_id": "event_id",
      "title": "Popular Event",
      "participantCount": 120,
      "startDate": "2025-08-01T10:00:00.000Z",
      "status": "published"
    }
  ]
}
```

### Get All Events (Admin View)

**GET** `/api/events?admin=true`

Returns all events including drafts and cancelled events.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status
- `type` - Filter by event type
- `category` - Filter by category
- `search` - Search in title/description

### Get Event Participants

**GET** `/api/events/:id/participants`

**Response:**

```json
{
  "participants": [
    {
      "user": {
        "_id": "user_id",
        "name": "John Smith",
        "email": "john@example.com",
        "profile": {
          "college": "ABC University"
        }
      },
      "registeredAt": "2025-07-15T10:30:00.000Z",
      "attended": false,
      "formData": {
        "phone": "+91-9876543210",
        "year": "Final Year"
      }
    }
  ],
  "count": 45
}
```

## 👥 User Management

### Get All Users

**GET** `/api/users`

**Query Parameters:**

- `page` - Page number
- `limit` - Items per page
- `role` - Filter by role (`user`, `admin`)
- `verified` - Filter by verification status
- `search` - Search in name/email

### Update User Role

**PUT** `/api/users/:id/role`

**Request Body:**

```json
{
  "role": "admin"
}
```

### Verify User

**PUT** `/api/users/:id/verify`

**Request Body:**

```json
{
  "verified": true
}
```

### Get User Statistics

**GET** `/api/users/stats/overview`

**Response:**

```json
{
  "totalUsers": 1250,
  "verifiedUsers": 1100,
  "adminUsers": 5,
  "recentUsers": 45,
  "recentLogins": 320,
  "verificationRate": 88
}
```

## 🔔 Notification Management

### Send Broadcast Notification

**POST** `/api/notifications/broadcast`

**Request Body:**

```json
{
  "type": "admin_announcement",
  "title": "Important Announcement",
  "message": "New events have been added to the platform!",
  "priority": "high",
  "sendEmail": true,
  "userFilter": {
    "isVerified": true
  }
}
```

### Send Bulk Notifications

**POST** `/api/notifications/bulk`

**Request Body:**

```json
{
  "notifications": [
    {
      "recipient": "user_id_1",
      "type": "event_reminder",
      "title": "Event Reminder",
      "message": "Don't forget about tomorrow's event!"
    }
  ]
}
```

### Get Notification Statistics

**GET** `/api/notifications/admin/stats`

## 📈 Analytics & Reports

### Event Analytics

Each event includes analytics:

- View count
- Registration count
- Attendance rate
- Feedback ratings

### User Engagement

- Total active users
- Recent registrations
- Login statistics

## 🛡️ Security Features

- Role-based access control
- Input validation on all endpoints
- Rate limiting
- CORS protection
- JWT token verification

## 📱 Frontend Integration

### Admin Panel Components Needed

1. **Event Creation Form**

   - Rich text editor for descriptions
   - Date/time pickers
   - Sponsor management interface
   - RSVP configuration
   - Media upload components

2. **Event Management Dashboard**

   - Event list with filters
   - Status update controls
   - Analytics overview
   - Participant management

3. **User Management Interface**

   - User list with search/filter
   - Role assignment controls
   - Verification management

4. **Notification Center**
   - Broadcast notification form
   - Notification templates
   - Delivery status tracking

### Sample Frontend API Calls

```javascript
// Create event
const createEvent = async (eventData) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  return response.json();
};

// Get dashboard data
const getDashboard = async () => {
  const response = await fetch("/api/events/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Update event status
const updateEventStatus = async (eventId, status) => {
  const response = await fetch(`/api/events/${eventId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
};
```

This admin panel provides comprehensive event management capabilities with sponsor integration and flexible RSVP options, exactly as requested!
