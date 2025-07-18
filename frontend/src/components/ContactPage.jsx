import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Header from "./Header";
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="contact-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>
            Have questions or want to collaborate? We'd love to hear from you!
          </p>
        </div>
      </motion.section>

      <div className="contact-content">
        {/* Contact Information */}
        <motion.section
          className="contact-info"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Contact Information</h2>
          <div className="contact-cards">
            <motion.div
              className="contact-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>ce24.raaj.patkar@kccemsr.edu.in</p>
              <p>Kcecell@kccemsr.edu.in</p>
            </motion.div>

            <motion.div
              className="contact-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="contact-icon">
                <FaPhone />
              </div>
              <h3>Phone</h3>
              <p>+91 77100 22591</p>
              <p>+91 8356860005</p>
            </motion.div>

            <motion.div
              className="contact-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Address</h3>
              <p>
                3rd floor,
                <span className="highlight"> E-cell Workstation</span>, KC
                college of engineering and management studies
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          className="contact-form-section"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Send Us a Message</h2>

          {success && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheckCircle />
              <p>Message sent successfully! We'll get back to you soon.</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaExclamationTriangle />
              <p>{error}</p>
            </motion.div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <motion.div
                className="input-group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <span className="input-high light"></span>
              </motion.div>

              <motion.div
                className="input-group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <span className="input-highlight"></span>
              </motion.div>
            </div>

            <div className="form-row">
              <motion.div
                className="input-group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <span className="input-highlight"></span>
              </motion.div>

              <motion.div
                className="input-group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
                <span className="input-highlight"></span>
              </motion.div>
            </div>

            <motion.div
              className="input-group message-group"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <span className="input-highlight"></span>
            </motion.div>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{
                scale: loading ? 1 : 1.05,
                boxShadow: loading
                  ? "none"
                  : "0 10px 30px rgba(0, 255, 157, 0.3)",
              }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <FaPaperPlane />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;
