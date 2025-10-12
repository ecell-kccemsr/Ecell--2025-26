import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="hero-title">
            We are the <span className="highlight">Entrepreneurs</span> of
            Tomorrow
          </h1>
          <p className="hero-subtitle">
            Doing what we <span className="highlight-subtitle">love</span>, building what we need
          </p>

          <div className="hero-buttons">
            <Link to="https://events.kcecell.org/" className="cta-btn primary">
              Explore Events
            </Link>
           <a
                       href="#about"
                       className="cta-btn primary"
                       onClick={(e) => {
                         e.preventDefault();
                         const aboutSection = document.getElementById("about");
                         if (aboutSection) {
                           aboutSection.scrollIntoView({ behavior: "smooth" });
                         }
                       }}
                     >
                       Learn More
                     </a>
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


            <div className="floating-element element-2">
              <img src="/img4.jpg" alt="Business networking event" />
            </div>
          </div>
        </motion.div>
      </div>
     
    </section>
  );
};

export default HeroSection;
