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
            WE ARE THE  <span className="highlight">ENTREPRENEURS</span> OF
            TOMORROW 
          </h1>
          <p className="hero-subtitle">
            Doing what we <span className="highlight-subtitle">love</span>, building what we need
          </p>

          
        </motion.div>
        
      </div>
     
    </section>
  );
};

export default HeroSection;
