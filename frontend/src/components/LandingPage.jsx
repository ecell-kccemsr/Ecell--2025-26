import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "./Header";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import AchievementsSection from "./AchievementsSection";
import GoalsSection from "./GoalsSection";
import Footer from "./Footer";

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
      <div className="parallax-bg" ref={parallaxRef}></div>
      <Header />
      <HeroSection />
      <AboutSection />
      <AchievementsSe       ction />
      <GoalsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
