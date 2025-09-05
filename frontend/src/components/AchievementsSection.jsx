import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AchievementsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const achievements = [
    {
      id: 1,
      title: "Runner-up at National Entrepreneurship Challenge",
      description:
        "Runner up in the prestigious national competition among 500+ teams",
      image: "/img10.jpg",
      alt: "img10.jpg",
      year: "2017",
      category: "Award",
    },
    {
      id: 2,
      title: "Seminar on Mobile Computing and 4G/5G",
      description:
        "The ever-enthusiastic crowd of KCCOE witnessed a revolutionary seminar, which gave an insight into Mobile Computing and 4G/5G Network, which was organised by IQAC and KC E-cell. The featured speaker of this fantastic seminar was Dr Alhad Kuwadekar, PhD- Mobile Computing, University of Glamorgan, UK (2010). ",
      image: "/img11.jpg",
      alt: "img11.jpg",
      year: "2024",
      category: "Seminar",
    },
    {
      id: 3,
      title: "GitHub Workshop",
      description:
        "Conducted a workshop on GitHub, enhancing version control skills among participants",
      image: "/img12.jpg",
      alt: "GitHub Workshop",
      year: "2022",
      category: "Workshop",
    },
    {
      id: 4,
      title: "500+ Students Impacted",
      description:
        "Transformed the entrepreneurial journey of over 500 students through our programs",
      image: "/img13.jpg",
      alt: "Students participating in entrepreneurship programs",
      year: "2024",
      category: "Impact",
    },
    {
      id: 5,
      title: "Industry Partnership Program",
      description:
        "Bringing up industry parternerships to foster innovation and collaboration amongst students",
      image: "/img14.jpg",
      alt: "img14",
      year: "2024",
      category: "Partnership",
    },
    {
      id: 6,
      title: "Robotics Workshop",
      description:
        "The Robotics Workshop focused on hands-on learning and innovation in robotics technology.",
      image: "/img15.jpg",
      alt: "Robotics Workshop",
      year: "2024",
      category: "Innovation",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="achievements-section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Our <span className="highlight">Achievements</span>
          </h2>
          <p className="section-subtitle">
           <span className="highlight">Celebrating</span> our milestones 
          </p>
        </motion.div>

        <motion.div
          className="achievements-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className="achievement-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 255, 157, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="achievement-image">
                <img
                  src={achievement.image}
                  alt={achievement.alt}
                  loading="lazy"
                />
                <div className="achievement-overlay">
                  <span className="achievement-category">
                    {achievement.category}
                  </span>
                  <span className="achievement-year">{achievement.year}</span>
                </div>
              </div>
              <div className="achievement-content">
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">
                  {achievement.description}
                </p>
                <div className="achievement-stats">
                  <div className="stat-indicator">
                    <div className="indicator-dot"></div>
                    <span>Verified Achievement</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
