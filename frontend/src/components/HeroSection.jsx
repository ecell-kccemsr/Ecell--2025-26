import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="hero-title">
            Empowering <span className="highlight">Entrepreneurs</span> of
            Tomorrow
          </h1>
          <p className="hero-subtitle">
            doing what we love, building what we need
          </p>

          <div className="hero-buttons">
            <Link to="/events" className="cta-btn primary">
              Explore Events
            </Link>
            <motion.button
              className="cta-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <img
            src="/img2.jpg"
            alt="Entrepreneurs collaborating in modern workspace"
            className="hero-img"
          />
          <div className="floating-elements">
            <div className="floating-element element-1">
              <img src="/img3.jpg" alt="Innovation and startup culture" />
            </div>
            <div className="floating-element element-2">
              <img src="/img4.png" alt="Business networking event" />
            </div>
          </div>
        </motion.div>
      </div>
      <div className="hero-stats">
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3>500+</h3>
          <p>Students Mentored</p>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h3>10+</h3>
          <p>Startups Launched</p>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <h3>100+</h3>
          <p>Events Organized</p>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <h3>100+</h3>
          <p>developers enabled</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
