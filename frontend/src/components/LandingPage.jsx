import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "./Header";
import IntroSequence from "./IntroSequence";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import AchievementsSection from "./AchievementsSection";
import GoalsSection from "./GoalsSection";
import Footer from "./Footer";

const LandingPage = () => {
  const parallaxRef = useRef(null);
  const [introComplete, setIntroComplete] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);

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

  useEffect(() => {
    if (introComplete) {
      setTimeout(() => setShowContent(true), 500);
    }
  }, [introComplete]);

  return (
    <div className="landing-page">
      <IntroSequence onComplete={() => setIntroComplete(true)} />
      <div className="parallax-bg" ref={parallaxRef}></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <HeroSection />
        <AboutSection />
        <AchievementsSection />
        <GoalsSection />
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;
