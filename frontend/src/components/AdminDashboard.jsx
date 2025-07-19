import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimes,
  FaFlag,
  FaClock,
} from "react-icons/fa";
import Header from "./Header";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    department: "",
    position: "",
    bio: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    type: "workshop",
    category: "entrepreneurship",
    startDate: "",
    endDate: "",
    location: {
      type: "offline",
      venue: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      onlineLink: "",
      platform: "",
    },
    registration: {
      required: true,
      deadline: "",
      maxParticipants: 50,
      fees: {
        amount: 0,
        currency: "INR",
      },
      rsvp: {
        enabled: true,
        type: "luma",
        externalLink: "",
        buttonText: "Register on Luma",
      },
    },
    featured: false,
    visibility: "public",
    tags: "",
    image: "",
    imageFile: null,
  });

  useEffect(() => {
    fetchEvents();
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const API_URL = "/.netlify/functions/events";
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/.netlify/functions/auth-admin-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "/.netlify/functions/auth-admin-create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(userFormData),
        }
      );

      if (response.ok) {
        const newUser = await response.json();
        setUsers((prev) => [newUser.user, ...prev]);
        setShowCreateUserForm(false);
        resetUserForm();
        alert(
          "User created successfully! Verification email has been sent to the user."
        );
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      department: "",
      position: "",
      bio: "",
    });
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `/.netlify/functions/auth-admin-users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        alert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.includes("location.")) {
      const field = name.replace("location.", "");
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.includes("registration.")) {
      const field = name.replace("registration.", "");
      if (field.includes("rsvp.")) {
        const rsvpField = field.replace("rsvp.", "");
        setFormData((prev) => ({
          ...prev,
          registration: {
            ...prev.registration,
            rsvp: {
              ...prev.registration.rsvp,
              [rsvpField]: type === "checkbox" ? checked : value,
            },
          },
        }));
      } else if (field.includes("fees.")) {
        const feesField = field.replace("fees.", "");
        setFormData((prev) => ({
          ...prev,
          registration: {
            ...prev.registration,
            fees: {
              ...prev.registration.fees,
              [feesField]: feesField === "amount" ? Number(value) : value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          registration: {
            ...prev.registration,
            [field]:
              type === "checkbox"
                ? checked
                : type === "number"
                ? Number(value)
                : value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/.netlify/functions/events-upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          image: data.imageUrl,
          imageFile: file,
        }));
      } else {
        const errorData = await response.json();
        alert(`Error uploading image: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registration: {
          ...formData.registration,
          deadline: formData.registration.deadline
            ? new Date(formData.registration.deadline).toISOString()
            : null,
        },
      };

      const API_URL = "/.netlify/functions/events";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents((prev) => [newEvent, ...prev]);
        setShowCreateForm(false);
        resetForm();
        alert("Event created successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      type: "workshop",
      category: "entrepreneurship",
      startDate: "",
      endDate: "",
      location: {
        type: "offline",
        venue: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        onlineLink: "",
        platform: "",
      },
      registration: {
        required: true,
        deadline: "",
        maxParticipants: 50,
        fees: {
          amount: 0,
          currency: "INR",
        },
        rsvp: {
          enabled: true,
          type: "luma",
          externalLink: "",
          buttonText: "Register on Luma",
        },
      },
      featured: false,
      visibility: "public",
      tags: "",
      image: "",
      imageFile: null,
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <FaCheckCircle style={{ color: "#00ff9d" }} />;
      case "draft":
        return <FaClock style={{ color: "#ffc107" }} />;
      case "cancelled":
        return <FaTimes style={{ color: "#ff6b35" }} />;
      case "completed":
        return <FaFlag style={{ color: "#6c757d" }} />;
      default:
        return <FaClock style={{ color: "#6c757d" }} />;
    }
  };

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const response = await fetch(
        `/.netlify/functions/events-status/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setEvents((prev) =>
          prev.map((event) =>
            event._id === eventId ? { ...event, status: newStatus } : event
          )
        );
        alert(`Event status updated to ${newStatus.toUpperCase()}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      alert("Failed to update event status.");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/.netlify/functions/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setEvents((prev) => prev.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Admin Dashboard</h1>
        <p>Manage E-Cell events and activities</p>
      </motion.div>

      <div className="dashboard-content">
        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            📅 Events Management
          </button>
          <button
            className={`tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers /> Users Management
          </button>
        </div>

        {/* Events Management Tab */}
        {activeTab === "events" && (
          <>
            <div className="dashboard-actions">
              <button
                className="create-event-btn"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <FaPlus />
                {showCreateForm ? "Cancel" : "Create New Event"}
              </button>
            </div>
          </>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <>
            <div className="dashboard-actions">
              <button
                className="create-user-btn"
                onClick={() => setShowCreateUserForm(!showCreateUserForm)}
              >
                <FaPlus />
                {showCreateUserForm ? "Cancel" : "Create New User"}
              </button>
            </div>
          </>
        )}

        {showCreateForm && (
          <motion.div
            className="create-event-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3>Create New Event</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Event Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <div className="image-upload-status">
                      <span>Uploading image...</span>
                    </div>
                  )}
                  {formData.image && (
                    <div className="image-preview">
                      <img
                        src={formData.image}
                        alt="Event banner preview"
                        style={{
                          width: "200px",
                          height: "100px",
                          objectFit: "cover",
                          marginTop: "10px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: "",
                            imageFile: null,
                          }))
                        }
                        className="remove-image-btn"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Event Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                    <option value="networking">Networking</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="entrepreneurship">Entrepreneurship</option>
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="innovation">Innovation</option>
                    <option value="startup">Startup</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location Type *</label>
                  <select
                    name="location.type"
                    value={formData.location.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {(formData.location.type === "offline" ||
                  formData.location.type === "hybrid") && (
                  <>
                    <div className="form-group">
                      <label>Venue</label>
                      <input
                        type="text"
                        name="location.venue"
                        value={formData.location.venue}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {(formData.location.type === "online" ||
                  formData.location.type === "hybrid") && (
                  <>
                    <div className="form-group">
                      <label>Platform</label>
                      <input
                        type="text"
                        name="location.platform"
                        value={formData.location.platform}
                        onChange={handleInputChange}
                        placeholder="Zoom, Teams, Meet, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label>Online Link</label>
                      <input
                        type="url"
                        name="location.onlineLink"
                        value={formData.location.onlineLink}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Max Participants</label>
                  <input
                    type="number"
                    name="registration.maxParticipants"
                    value={formData.registration.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Registration Deadline</label>
                  <input
                    type="datetime-local"
                    name="registration.deadline"
                    value={formData.registration.deadline}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Luma RSVP Link</label>
                  <input
                    type="url"
                    name="registration.rsvp.externalLink"
                    value={formData.registration.rsvp.externalLink}
                    onChange={handleInputChange}
                    placeholder="https://lu.ma/your-event"
                  />
                </div>

                <div className="form-group">
                  <label>RSVP Button Text</label>
                  <input
                    type="text"
                    name="registration.rsvp.buttonText"
                    value={formData.registration.rsvp.buttonText}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength="200"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="workshop, technology, programming"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    Featured Event
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Creating..." : "Create Event"}
                </button>
                <button type="button" onClick={resetForm} className="reset-btn">
                  Reset Form
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Create User Form */}
        {activeTab === "users" && showCreateUserForm && (
          <motion.div
            className="create-user-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={userFormData.name}
                    onChange={handleUserInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={userFormData.password}
                    onChange={handleUserInputChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={userFormData.department}
                    onChange={handleUserInputChange}
                    placeholder="e.g., Computer Engineering"
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={userFormData.position}
                    onChange={handleUserInputChange}
                    placeholder="e.g., Web Developer"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={userFormData.bio}
                    onChange={handleUserInputChange}
                    rows="3"
                    placeholder="Brief description about the user..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={resetUserForm}
                  className="reset-btn"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Users List */}
        {activeTab === "users" && (
          <div className="users-list">
            <h3>All Users ({users.length})</h3>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : (
              <div className="admin-users-grid">
                {users.map((user) => (
                  <div key={user._id} className="admin-user-card">
                    <div className="admin-user-header">
                      <h4>{user.name}</h4>
                      <div className="admin-user-actions">
                        <button
                          className="delete-btn"
                          onClick={() => deleteUser(user._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="admin-user-details">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Role:</strong>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </p>
                      {user.profile?.department && (
                        <p>
                          <strong>Department:</strong> {user.profile.department}
                        </p>
                      )}
                      {user.profile?.position && (
                        <p>
                          <strong>Position:</strong> {user.profile.position}
                        </p>
                      )}
                      <p>
                        <strong>Joined:</strong>{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Verified:</strong>
                        <span
                          className={`verification-badge ${
                            user.isVerified ? "verified" : "unverified"
                          }`}
                        >
                          {user.isVerified ? "✅ Verified" : "⏳ Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events List */}
        {activeTab === "events" && (
          <div className="events-list">
            <h3>All Events ({events.length})</h3>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading events...</p>
              </div>
            ) : (
              <div className="admin-events-grid">
                {events.map((event) => (
                  <div key={event._id} className="admin-event-card">
                    <div className="admin-event-header">
                      <h4>{event.title}</h4>
                      <div className="admin-event-actions">
                        <button className="edit-btn">
                          <FaEdit />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteEvent(event._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="admin-event-details">
                      <p>
                        <strong>Type:</strong> {event.type}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span className={`status ${event.status}`}>
                          {getStatusIcon(event.status)}
                          {event.status.toUpperCase()}
                        </span>
                      </p>
                      <div className="status-actions">
                        {event.status === "draft" && (
                          <button
                            className="status-btn publish-btn"
                            onClick={() =>
                              updateEventStatus(event._id, "published")
                            }
                            title="Publish Event"
                          >
                            <FaCheckCircle /> Publish
                          </button>
                        )}
                        {event.status === "published" && (
                          <button
                            className="status-btn cancel-btn"
                            onClick={() =>
                              updateEventStatus(event._id, "cancelled")
                            }
                            title="Cancel Event"
                          >
                            <FaTimes /> Cancel
                          </button>
                        )}
                        {(event.status === "published" ||
                          event.status === "cancelled") && (
                          <button
                            className="status-btn complete-btn"
                            onClick={() =>
                              updateEventStatus(event._id, "completed")
                            }
                            title="Mark as Completed"
                          >
                            <FaFlag /> Complete
                          </button>
                        )}
                      </div>
                      <p>
                        <strong>Participants:</strong>{" "}
                        {event.participantCount || 0}
                      </p>
                      {event.featured && (
                        <span className="featured-tag">Featured</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
