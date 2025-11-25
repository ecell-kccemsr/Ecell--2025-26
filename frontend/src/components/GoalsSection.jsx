import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GoalsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const goals = [
    {
      id: 1,
      title: "Expand the talent pools",
      description:
        "Picking the best talent from the college and nurturing them to become future leaders.",
      icon: "/img16.jpg",
      alt: "Innovation and creative thinking symbol",
      metrics: "100+ active Members",
      color: "primary",
      percentageCompleted: 100,
    },
    {
      id: 2,
      title: "A Startup Ecosystem",
      description:
        "Establish a comprehensive support system for startups from ideation to successful market launch",
      icon: "/img17.jpg",
      alt: "Startup ecosystem development illustration",
      metrics: "5+ Startups Supported",
      color: "secondary",
      percentageCompleted: 60,
    },
    {
      id: 3,
      title: "Social Media Expansion",
      description:
        "Create a strong online presence to engage with a wider audience and promote entrepreneurial initiatives",
      icon: "/img17.jpg",
      alt: "Social media expansion illustration",
      metrics: "5000+ across platforms",
      color: "tertiary",
      percentageCompleted: 15,
    },
    {
      id: 4,
      title: "Industry Integration",
      description:
        "Bridge the gap between academia and industry through strategic partnerships and collaborations",
      icon: "/img17.jpg",
      alt: "Global entrepreneurship network expansion",
      metrics: "10+ Industries Reached",
      color: "quaternary",
      percentageCompleted: 40,
    },
    {
      id: 5,
      title: "Raise Funds",
      description:
        "raise over 200k+ funds to support entrepreneurial ventures and initiatives",
      icon: "/img17.jpg",
      alt: "Sustainable funding illustration",
      metrics: "INR 200k+",
      color: "primary",
      percentageCompleted: 2.5,
    },
    {
      id: 6,
      title: "Community Development",
      description:
        "Build a strong alumni network and create a lasting community of successful entrepreneurs",
      icon: "/img17.jpg",
      alt: "Entrepreneurship community building illustration",
      metrics: "2000+ Alumni Network",
      color: "secondary",
      percentageCompleted: 90,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="goals-section" ref={ref}>
      <div className="goals-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Our <span className="highlight">Goals</span>
          </h2>
          <p className="section-subtitle">
            Shaping the future of entrepreneurship through strategic initiatives
            and impactful programs
          </p>
        </motion.div>

        <motion.div
          className="goals-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              className={`goal-card ${goal.color}`}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
              }}
              transition={{ duration: 0.1 }}
            >
              <div className="goal-header">
                <div className="goal-icon">
                  <img src={goal.icon} alt={goal.alt} />
                </div>
                <div className="goal-number">
                  <span>0{goal.id}</span>
                </div>
              </div>

              <div className="goal-content">
                <h3 className="goal-title">{goal.title}</h3>
                <p className="goal-description">{goal.description}</p>
                <div className="goal-metrics">
                  <span className="metrics-label">Target:</span>
                  <span className="metrics-value">{goal.metrics}</span>
                </div>
              </div>

              <div className="goal-progress">
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={
                      inView
                        ? { width: `${goal.percentageCompleted}%` }
                        : { width: 0 }
                    }
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  ></motion.div>
                </div>
                <span className="progress-text">
                  {goal.percentageCompleted}% Progress
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="goals-vision"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="vision-content">
            <div className="vision-text">
              <h3>Our Vision for 2030</h3>
              <p>
                To become the leading entrepreneurship cell in Asia, fostering a
                generation of innovative leaders who create sustainable
                solutions for global challenges. We envision a world where every
                student has the opportunity to transform their ideas into
                impactful ventures.
              </p>
              <div className="vision-stats">
                <div className="vision-stat">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Students Impacted</span>
                </div>
                <div className="vision-stat">
                  <span className="stat-number">1,000+</span>
                  <span className="stat-label">Startups Launched</span>
                </div>
                <div className="vision-stat">
                  <span className="stat-number">₹1B+</span>
                  <span className="stat-label">Funding Facilitated</span>
                </div>
              </div>
            </div>
            <div className="vision-image">
              <img
                src="/img22.jpg"
                alt="Vision 2030 entrepreneurship future landscape"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoalsSection;
