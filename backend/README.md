# E-Cell Backend

A comprehensive backend service for the E-Cell website, built with Node.js, Express, and MongoDB.

## Architecture Overview

This backend implements the architecture shown in the provided diagram with the following components:

### Core Features

- **Authentication Service**: JWT-based authentication with email verification
- **User Management**: Profile management, role-based access control
- **Event Management**: Create, manage, and participate in entrepreneurship events
- **Meeting Management**: Schedule and manage meetings with calendar integration
- **Todo Management**: Personal task management system
- **Notification Service**: Multi-channel notifications (in-app, email)
- **Calendar Integration**: Google Calendar and Outlook Calendar sync

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Email**: Nodemailer with customizable templates
- **Calendar APIs**: Google Calendar API, Microsoft Graph API
- **Validation**: Express-validator
- **Security**: Helmet, CORS, rate limiting

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email service)
- Google/Outlook API credentials (for calendar integration)

### Installation

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   - MongoDB connection string
   - JWT secret
   - Email service credentials
   - Google/Outlook API credentials

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id/role` - Update user role (admin)

### Events

- `GET /api/events` - Get events with filters
- `POST /api/events` - Create event (admin)
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/feedback` - Submit feedback

### Meetings

- `GET /api/meetings` - Get user's meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get single meeting
- `PUT /api/meetings/:id` - Update meeting
- `PUT /api/meetings/:id/participants/:participantId/status` - Update participation status

### Todos

- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/stats/overview` - Get todo statistics

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `POST /api/notifications/broadcast` - Broadcast to all users (admin)

### Calendar Integration

- `POST /api/calendar/google/connect` - Connect Google Calendar
- `POST /api/calendar/outlook/connect` - Connect Outlook Calendar
- `GET /api/calendar/status` - Get integration status
- `POST /api/calendar/sync/event/:eventId` - Sync event to calendars

## Database Models

### User

- Authentication and profile information
- Calendar integration preferences
- Email notification settings

### Event

- Event details and metadata
- Participant registration and feedback
- Analytics and external integrations

### Meeting

- Meeting scheduling and management
- Participant management with roles
- Action items and notes

### Todo

- Personal task management
- Priority levels and categories
- Subtasks and reminders

### Notification

- Multi-channel notification system
- Scheduled notifications
- Read/unread status tracking

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Email Templates

The system includes responsive email templates for:

- Account verification
- Password reset
- Event reminders
- Meeting invitations
- Todo reminders
- Admin notifications

## Calendar Integration

### Google Calendar

- OAuth2 authentication
- Event creation and updates
- Automatic reminders

### Outlook Calendar

- Microsoft Graph API integration
- Event synchronization
- Meeting integration

## Monitoring and Health Check

- Health check endpoint: `GET /health`
- Error logging and monitoring
- Request/response logging

## Development

### Project Structure

```
backend/
├── models/          # Mongoose models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── services/        # Business logic services
├── utils/           # Helper utilities
├── uploads/         # File upload directory
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Environment Variables

See `.env.example` for all required environment variables.

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB instance
3. Set up email service (Gmail/SendGrid)
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure monitoring and logging

## API Documentation

For detailed API documentation, import the provided Postman collection or visit the health endpoint for basic server information.

## Support

For issues and questions, please refer to the main project documentation or create an issue in the repository.
