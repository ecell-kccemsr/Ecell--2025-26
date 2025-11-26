import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "./Header";

import HeroSection from "./HeroSection";
import WhyJoinSection from "./WhyJoinSection";
import AchievementsSection from "./AchievementsSection";
import GoalsSection from "./GoalsSection.jsx";
import Footer from "./Footer";
import WhyNot from "./whynot.jsx";

const LandingPage = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        parallaxRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <Header />
      <div className="parallax-bg" ref={parallaxRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        
        <HeroSection />
        <WhyNot />
        <WhyJoinSection />
        <AchievementsSection />
        <GoalsSection />
        <Footer />
      </motion.div>
    </div>
      </div>
     
  );
};

export default LandingPage;
