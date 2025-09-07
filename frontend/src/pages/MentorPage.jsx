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
      expertise: "Blockchain & Startups",
      company: "KC College of Engineering",
      image: "/img1.png", // Using placeholder image
      bio: "Dedicated faculty advisor guiding students in their entrepreneurial journey. Experienced in mentoring innovative projects and startups.",
      linkedin: "https://linkedin.com/in/trupti-dharmik",
    },
    
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
          >
    
          </motion.div>
        </div>

        <div className="mentors-grid">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              className="mentor-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="mentor-image">
                <img src={mentor.image} alt={mentor.name} />
                <div className="mentor-social">
                  {mentor.linkedin && (
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {mentor.twitter && (
                    <a
                      href={mentor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link twitter"
                    >
                      <FaTwitter />
                    </a>
                  )}
                  {mentor.github && (
                    <a
                      href={mentor.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link github"
                    >
                      <FaGithub />
                    </a>
                  )}
                </div>
              </div>
              <div className="mentor-info">
                <h3>{mentor.name}</h3>
                <div className="mentor-role">{mentor.role}</div>
                <div className="mentor-company">{mentor.company}</div>
                <div className="mentor-expertise">
                  <span className="expertise-label">Expertise:</span>
                  {mentor.expertise}
                </div>
                <p className="mentor-bio">{mentor.bio}</p>
              </div>
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
