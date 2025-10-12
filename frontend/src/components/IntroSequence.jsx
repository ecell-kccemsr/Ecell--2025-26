import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./IntroSequence.css";

const IntroSequence = ({ onComplete }) => {
  const [stage, setStage] = useState("logo"); // logo -> video -> fade
  const [isVisible, setIsVisible] = useState(true);

  // Prevent scrolling during intro
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Stage progression
  useEffect(() => {
    // Logo stage (2 seconds)
    const logoTimer = setTimeout(() => {
      setStage("video");
    }, 2000);

    return () => clearTimeout(logoTimer);
  }, []);

  // Handle video end
  const handleVideoEnd = () => {
    setStage("fade");
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
      document.body.style.overflow = "auto";
    }, 800);
  };

  // Allow skip with click or key press
  const handleSkip = () => {
    setStage("fade");
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
      document.body.style.overflow = "auto";
    }, 500);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="intro-sequence"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        onClick={handleSkip}
      >
        {/* Skip Hint */}
        <motion.div
          className="skip-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Click anywhere or press Enter to skip
        </motion.div>

        {/* Logo Stage */}
        <AnimatePresence>
          {stage === "logo" && (
            <motion.div
              className="logo-stage"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src="/ecelllogo.jpg"
                alt="E-Cell Logo"
                className="intro-logo"
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="logo-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Stage */}
        <AnimatePresence>
          {stage === "video" && (
            <motion.div
              className="video-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <video
                className="intro-video"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
              >
                <source src="/video.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fade Stage */}
        {stage === "fade" && (
          <motion.div
            className="fade-stage"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroSequence;
