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
        "The National Entrepreneurship Challenge (NEC) is a nationwide competition organized by the Entrepreneurship Cell (E-Cell) of IIT Bombay. It is a 5-6 month program designed to foster entrepreneurial spirit at the grassroots level by helping colleges establish and grow their own E-Cells. The challenge involves a series of tasks that guide student teams in building a strong entrepreneurial body on their campus, with a goal to make starting a company less intimidating. The competition has two main tracks, Basic and Advanced, to cater to colleges at different stages of E-Cell development. KC College was a runner up for the 2017 challenge.",
      image: "/img10.jpg",
      alt: "img10.jpg",
      year: "2017",
      category: "Award",
    },
    {
      id: 2,
      title: "Seminar on Mobile Computing and 4G/5G",
      description:
        "TA seminar at KCCOE, led by Dr. Alhad Kuwadekar, educated students and faculty on Mobile Computing and 4G/5G Network technology. The session covered the history of mobile phones, network features, and the effects of device portability. The highlight was an in-depth look at networking concepts like signal propagation and multiplexing, and a fascinating live demonstration of IoT (Internet of Things) applications, including smart home solutions. The seminar concluded with a live Android programming demonstration, inspiring new ideas and a passion for problem-solving. ",
      image: "/img11.jpg",
      alt: "img11.jpg",
      year: "2024",
      category: "Seminar",
    },
    {
      id: 3,
      title: "KED Talk on Intrapreneur to Entrepreneur",
      description:
        "a series of events organized by KC E-Cell, serves as a platform for experts to share knowledge. The recent KED Talk at KCCOE provided 73 students with valuable insights into intrapreneurship and entrepreneurship. The speakers, Mr. Sagar Bhosale and Mr. Ashok Karkera, discussed key differences, the importance of ideas, and practical advice on handling the journey.",
      image: "/img12.jpg",
      alt: "KED Talk on Intrapreneur to Entrepreneur",
      year: "2018",
      category: "Event",
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
