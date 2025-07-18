import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLaptop,
  FaGlobe,
  FaUsers,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import Header from "./Header";

const EventCard = ({ event, isAdmin, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRSVP = () => {
    if (event.registration?.rsvp?.externalLink) {
      window.open(event.registration.rsvp.externalLink, "_blank");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(event);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event._id);
    }
  };

  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="event-card-header">
        {isAdmin && (
          <div className="event-admin-actions">
            <button
              className="edit-icon-btn"
              onClick={handleEdit}
              title="Edit Event"
            >
              <FaEdit />
            </button>
            <button
              className="delete-icon-btn"
              onClick={handleDelete}
              title="Delete Event"
            >
              <FaTrash />
            </button>
          </div>
        )}
        {(event.image || event.media?.thumbnail) && (
          <img
            src={event.image || event.media.thumbnail}
            alt={event.title}
            className="event-thumbnail"
          />
        )}
        <div className="event-badge">
          <span className={`event-type ${event.type}`}>{event.type}</span>
          {event.featured && <span className="featured-badge">Featured</span>}
        </div>
      </div>

      <div className="event-card-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">
          {event.shortDescription || event.description}
        </p>

        <div className="event-details">
          <div className="event-date">
            <FaCalendarAlt />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="event-time">
            <FaClock />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>
          <div className="event-location">
            {event.location.type === "online" ? (
              <FaLaptop />
            ) : event.location.type === "hybrid" ? (
              <FaGlobe />
            ) : (
              <FaMapMarkerAlt />
            )}
            <span>
              {event.location.type === "online"
                ? "Online Event"
                : event.location.type === "hybrid"
                ? "Hybrid Event"
                : event.location.venue}
            </span>
          </div>
        </div>

        <div className="event-tags">
          {event.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="event-tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="event-footer">
          <div className="event-participants">
            <FaUsers />
            <span>{event.participantCount || 0} participants</span>
          </div>
          <button className="rsvp-button" onClick={handleRSVP}>
            {event.registration?.rsvp?.buttonText || "RSVP Now"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/events?upcoming=true&status=published"
      );
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Fallback to mock data if API fails
      setEvents([
        {
          _id: "1",
          title: "Orientation @",
          description:
            "E-cell members will be briefed about the objective and the future events with introduction to the core team",
          shortDescription: "Introduction to E-Cell objectives and core team",
          type: "seminar",
          category: "entrepreneurship",
          startDate: "2025-07-15T10:00:00.000Z",
          endDate: "2025-07-15T12:00:00.000Z",
          location: { type: "offline", venue: "Seminar Hall" },
          registration: {
            rsvp: {
              enabled: true,
              externalLink: "https://lu.ma/ecell-orientation",
              buttonText: "Register on Luma",
            },
          },
          featured: true,
          tags: ["orientation", "introduction", "networking"],
          participantCount: 45,
        },
        {
          _id: "2",
          title: "Git-Github @",
          description:
            "Basics of Git and Github, its importance, Github Education Plan & practice on git-github",
          shortDescription: "Hands-on workshop on Git and Github fundamentals",
          type: "workshop",
          category: "technology",
          startDate: "2025-07-20T14:00:00.000Z",
          endDate: "2025-07-20T17:00:00.000Z",
          location: { type: "offline", venue: "Computer Lab" },
          registration: {
            rsvp: {
              enabled: true,
              externalLink: "https://lu.ma/ecell-git-github",
              buttonText: "Register on Luma",
            },
          },
          featured: true,
          tags: ["git", "github", "programming"],
          participantCount: 32,
        },
        {
          _id: "3",
          title: "LinkedIn and Networking",
          description:
            "Teaching how to make and optimize your linkedin profile, how to post things, free tools which work like linked in navigator tools",
          shortDescription:
            "Master LinkedIn optimization and professional networking",
          type: "seminar",
          category: "business",
          startDate: "2025-07-25T15:00:00.000Z",
          endDate: "2025-07-25T17:00:00.000Z",
          location: { type: "online" },
          registration: {
            rsvp: {
              enabled: true,
              externalLink: "https://lu.ma/ecell-linkedin-networking",
              buttonText: "Register on Luma",
            },
          },
          featured: true,
          tags: ["linkedin", "networking", "portfolio"],
          participantCount: 78,
        },
        {
          _id: "4",
          title: "Introduction to GameDev",
          description:
            "Basic of graphics, tools used in gamedev, making simple games using unity",
          shortDescription: "Learn game development basics with Unity",
          type: "workshop",
          category: "technology",
          startDate: "2025-08-05T14:00:00.000Z",
          endDate: "2025-08-05T17:00:00.000Z",
          location: { type: "hybrid", venue: "Computer Lab" },
          registration: {
            rsvp: {
              enabled: true,
              externalLink: "https://lu.ma/ecell-gamedev-intro",
              buttonText: "Register on Luma",
            },
          },
          featured: true,
          tags: ["gamedev", "unity", "graphics"],
          participantCount: 28,
        },
        {
          _id: "5",
          title: "Ideathon & B-plan Auctions",
          description:
            "An ideathon presentation in group to present your ideas & A panel of judges who will decide the winner",
          shortDescription: "Present your innovative ideas and business plans",
          type: "competition",
          category: "entrepreneurship",
          startDate: "2025-08-15T10:00:00.000Z",
          endDate: "2025-08-15T18:00:00.000Z",
          location: { type: "offline", venue: "Seminar Hall" },
          registration: {
            rsvp: {
              enabled: true,
              externalLink: "https://lu.ma/ecell-ideathon-bplan",
              buttonText: "Register on Luma",
            },
          },
          featured: true,
          tags: ["ideathon", "business-plan", "competition"],
          participantCount: 56,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.type === filter;
  });

  const eventTypes = [
    "all",
    "workshop",
    "seminar",
    "competition",
    "networking",
  ];

  return (
    <div className="events-page">
      <Header />
      <motion.div
        className="events-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Upcoming Events</h1>
        <p>Discover amazing entrepreneurship events and workshops</p>
      </motion.div>

      <div className="events-filters">
        {eventTypes.map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="events-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="no-events">
            <h3>No events found</h3>
            <p>Check back later for upcoming events!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
