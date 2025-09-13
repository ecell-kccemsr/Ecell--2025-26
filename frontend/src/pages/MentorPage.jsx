import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import TeamPageLayout from "../components/shared/TeamPageLayout";
import "./MentorPage.css";

const MentorPage = () => {
  const mentors = [
    {
      name: "Prof. Vedika Patil",
      role: "E-Cell Faculty Advisor",
      expertise: ["Blockchain", "Startups", "Innovation"],
      company: "KC College of Engineering",
      experience: "15+ years",
      image: "/img1.png",
      bio: "Dedicated faculty advisor guiding students in their entrepreneurial journey. Experienced in mentoring innovative projects and startups.",
      achievements: [
        "Mentored 20+ successful startups",
        "Published research on blockchain innovation",
        "Best Faculty Mentor Award 2024",
      ],
      availableFor: [
        "Technical Guidance",
        "Startup Mentoring",
        "Project Development",
      ],
      linkedin: "https://linkedin.com/in/trupti-dharmik",
      email: "vedika.patil@kccemsr.edu.in",
    },
    // Add more mentors here
  ];

  return (
    <TeamPageLayout
      pageTitle={
        <>
          Our <span className="highlight">Mentors</span>
        </>
      }
      pageDescription="Learn from industry experts who have been there, done that, and are ready to guide you through your entrepreneurial journey."
    >
      <div className="mentor-container">
        <div className="mentor-filters">
          <motion.div
            className="filter-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
        </div>

        <div className="mentors-grid">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              className="mentor-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <motion.div className="mentor-image-wrapper" whileHover="hover">
                <div className="mentor-image">
                  <motion.img
                    src={mentor.image}
                    alt={mentor.name}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "tween" }}
                  />
                  <motion.div
                    className="mentor-social"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {mentor.linkedin && (
                      <motion.a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link linkedin"
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaLinkedin />
                      </motion.a>
                    )}
                    {mentor.email && (
                      <motion.a
                        href={`mailto:${mentor.email}`}
                        className="social-link email"
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTwitter />
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="mentor-info"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mentor-header">
                  <h3>{mentor.name}</h3>
                  <span className="experience-badge">{mentor.experience}</span>
                </div>
                <div className="mentor-role">{mentor.role}</div>
                <div className="mentor-company">{mentor.company}</div>

                <div className="mentor-expertise">
                  <span className="expertise-label">Expertise</span>
                  <div className="expertise-tags">
                    {mentor.expertise.map((skill, idx) => (
                      <motion.span
                        key={skill}
                        className="expertise-tag"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="mentor-bio">
                  <p>{mentor.bio}</p>
                </div>

                <div className="mentor-achievements">
                  <span className="achievements-label">Key Achievements</span>
                  <ul>
                    {mentor.achievements.map((achievement, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + 0.1 * idx }}
                      >
                        {achievement}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mentor-available">
                  <span className="available-label">Available For</span>
                  <div className="available-tags">
                    {mentor.availableFor.map((item, idx) => (
                      <motion.span
                        key={item}
                        className="available-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + 0.1 * idx }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.a
                  href={`mailto:${mentor.email}`}
                  className="connect-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Connect with {mentor.name.split(" ")[0]}
                </motion.a>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mentor-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2>Want to become a mentor?</h2>
          <p>
            Share your expertise and help shape the next generation of
            entrepreneurs.
          </p>
          <a href="mailto:kccell@kccemsr.edu.in" className="cta-btn primary">
            Join Our Mentor Network
          </a>
        </motion.div>
      </div>
    </TeamPageLayout>
  );
};

export default MentorPage;
