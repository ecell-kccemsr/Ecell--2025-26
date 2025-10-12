import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AboutPage.css";

const AboutPage = () => {
  const [missionRef, missionInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [visionRef, visionInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [valuesRef, valuesInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [statsRef, statsInView] = useInView({
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

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "50+", label: "Events Organized" },
    { number: "100+", label: "Startups Mentored" },
    { number: "20+", label: "Industry Partners" },
  ];

  const values = [
    {
      icon: "💡",
      title: "Innovation",
      description:
        "We encourage creative thinking and innovative solutions to real-world problems.",
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description:
        "We believe in the power of teamwork and building strong networks.",
    },
    {
      icon: "🎯",
      title: "Excellence",
      description:
        "We strive for excellence in everything we do and help others achieve their best.",
    },
    {
      icon: "🚀",
      title: "Growth",
      description:
        "We foster continuous learning and personal development for all members.",
    },
    {
      icon: "🌟",
      title: "Impact",
      description:
        "We aim to create meaningful impact in our community and beyond.",
    },
    {
      icon: "💪",
      title: "Resilience",
      description:
        "We teach entrepreneurs to persevere through challenges and learn from failures.",
    },
  ];

  const features = [
    {
      icon: "👨‍🏫",
      title: "Expert Mentorship",
      description:
        "Learn from industry veterans and successful entrepreneurs who guide you through your entrepreneurial journey.",
      image: "/img5.jpg",
    },
    {
      icon: "🌐",
      title: "Networking Events",
      description:
        "Connect with like-minded individuals, potential co-founders, and investors at our regular networking events.",
      image: "/img6.jpg",
    },
    {
      icon: "🏢",
      title: "Startup Incubation",
      description:
        "Get comprehensive support to turn your ideas into successful businesses with our incubation program.",
      image: "/img7.jpg",
    },
  ];

  return (
    <div className="about-page">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <motion.div
            className="about-hero-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="about-hero-title">
              About <span className="highlight">E-Cell KCCEMSR</span>
            </h1>
            <p className="about-hero-subtitle">
              Empowering the next generation of entrepreneurs and innovators
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="about-mission" ref={missionRef}>
        <div className="container">
          <motion.div
            className="mission-content"
            variants={containerVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
          >
            <motion.div className="mission-text" variants={itemVariants}>
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-description">
                The Entrepreneurship Cell at KCCEMSR is dedicated to fostering
                an entrepreneurial mindset among students. We provide a
                comprehensive platform that nurtures innovative ideas,
                facilitates startup development, and connects aspiring
                entrepreneurs with industry experts and resources.
              </p>
              <p className="mission-description">
                Through workshops, seminars, competitions, and mentorship
                programs, we aim to create a vibrant ecosystem where creativity
                meets opportunity, and ideas transform into impactful ventures.
              </p>
            </motion.div>
            <motion.div className="mission-image" variants={itemVariants}>
              <img
                src="/img.png"
                alt="E-Cell Mission"
                className="rounded-image"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-vision" ref={visionRef}>
        <div className="container">
          <motion.div
            className="vision-content"
            variants={containerVariants}
            initial="hidden"
            animate={visionInView ? "visible" : "hidden"}
          >
            <motion.div className="vision-image" variants={itemVariants}>
              <img
                src="/img1.png"
                alt="E-Cell Vision"
                className="rounded-image"
              />
            </motion.div>
            <motion.div className="vision-text" variants={itemVariants}>
              <h2 className="section-title">Our Vision</h2>
              <p className="vision-description">
                To be recognized as a leading entrepreneurship cell that shapes
                the future of business innovation in India. We envision a
                community where every student has the confidence, skills, and
                resources to turn their entrepreneurial dreams into reality.
              </p>
              <p className="vision-description">
                We strive to build a culture where failure is seen as a stepping
                stone to success, and where innovation is celebrated and
                supported at every level.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="about-features">
        <div className="container">
          <motion.h2
            className="section-title text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What We <span className="highlight">Offer</span>
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-image-wrapper">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="feature-image"
                  />
                  <div className="feature-icon-overlay">{feature.icon}</div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values" ref={valuesRef}>
        <div className="container">
          <motion.h2
            className="section-title text-center"
            variants={itemVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            Our Core <span className="highlight">Values</span>
          </motion.h2>
          <motion.div
            className="values-grid"
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="about-stats" ref={statsRef}>
        <div className="container">
          <motion.div
            className="stats-grid"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
              >
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-description">
              Join us in building the next generation of entrepreneurs and
              innovators. Be part of a community that believes in your vision.
            </p>
            <motion.a
              href="mailto:kccell@kccemsr.edu.in"
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
