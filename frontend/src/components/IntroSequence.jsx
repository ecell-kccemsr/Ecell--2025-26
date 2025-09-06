import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const IntroSequence = ({ onComplete }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Prevent scrolling during intro
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrolled / windowHeight, 1);
      setScrollProgress(progress);

      // Auto-complete the intro if user tries to scroll
      if (progress > 0) {
        setScrollProgress(1);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
          window.scrollTo({ top: 0, behavior: "smooth" });
          document.body.style.overflow = "auto";
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      animate={{
        opacity: 1 - scrollProgress,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{
          scale: 1 + scrollProgress * 2,
          opacity: 1 - scrollProgress,
        }}
        transition={{ duration: 0.3 }}
      >
        <Logo
          style={{
            width: "120px",
            height: "120px",
            filter: `blur(${scrollProgress * 10}px)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default IntroSequence;
