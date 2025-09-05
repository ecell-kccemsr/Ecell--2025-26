import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const IntroSequence = ({ onComplete }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isAnimating) return;

      if (e.deltaY > 0) {
        // Scrolling down
        setIsAnimating(true);
        setScrollProgress(1);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
          window.scrollTo({ top: 0, behavior: "smooth" });
          document.body.style.overflow = "auto";
        }, 1000);
      }
    };

    // Hide scrollbar
    const style = document.createElement("style");
    style.textContent = `
      body::-webkit-scrollbar {
        display: none !important;
      }
      body {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
    `;
    document.head.appendChild(style);

    // Add wheel event listener
    window.addEventListener("wheel", handleWheel);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.head.removeChild(style);
      document.body.style.overflow = "auto";
    };
  }, [isAnimating, onComplete]);

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
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          scale: 1 + scrollProgress * 1.5,
          opacity: 1 - scrollProgress,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
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
