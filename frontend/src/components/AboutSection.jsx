import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AboutSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="about-section" ref={ref}>
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="about-text">
            <motion.h2 className="section-title" variants={itemVariants}>
              About <span className="highlight">E-Cell</span>
            </motion.h2>
            <motion.p className="about-description" variants={itemVariants}>
              The Entrepreneurship Cell is a dynamic hub of innovation and
              creativity, dedicated to fostering entrepreneurial spirit among
              students. We provide a platform for budding entrepreneurs to
              transform their ideas into successful ventures through mentorship,
              resources, and networking opportunities.
            </motion.p>
            <motion.div className="about-features" variants={itemVariants}>
              <div className="feature-item">
                <div className="feature-icon">
                  <img src="/img5.jpg" alt="Mentorship program icon" />
                </div>
                <div className="feature-content">
                  <h4>Expert Mentorship</h4>
                  <p>
                    Learn from industry veterans and successful entrepreneurs
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <img src="/img6.jpg" alt="Networking events icon" />
                </div>
                <div className="feature-content">
                  <h4>Networking Events</h4>
                  <p>
                    Connect with like-minded individuals and potential
                    co-founders
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <img src="/img7.jpg" alt="Startup incubation icon" />
                </div>
                <div className="feature-content">
                  <h4>Startup Incubation</h4>
                  <p>
                    Get support to turn your ideas into successful businesses
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div className="about-image" variants={itemVariants}>
            <div className="image-container">
              <img
                src="/img8.jpg"
                alt="E-Cell team collaboration and innovation"
                className="main-image"
              />
              <div className="overlay-elements">
                <div className="overlay-stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years Active</span>
                </div>
                <div className="overlay-image">
                  <img src="/img9.jpg" alt="Startup success stories showcase" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
