import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "./ui/AnimatedBackground";

const HeroSection = () => {
  return (
    <section className="hero-section relative min-h-screen overflow-hidden" id="home">
      <AnimatedBackground />
      <div className="hero-content relative z-10">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="hero-title">
            We are the  <span className="highlight">Entrepreneurs</span> of
            Tomorrow!!
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
