import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaCheckCircle } from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./CoordinationTeam.css";

const CoordinationTeam = () => {
  const teamMembers = [
    {
      name: "Devanshi Thakur",
      role: "Overall Coordinator",
      linkedin_profile_url: "https://www.linkedin.com/in/devanshi-thakur",
      instagram_url: "https://www.instagram.com/devanshithakur",
    },
    {
      name: "Tanushree Karwatkar",
      role: "Deputy Overall Coordinator",
      linkedin_profile_url: "https://www.linkedin.com/in/tanushree-karwatkar",
      instagram_url: "https://www.instagram.com/tanushreekarwatkar",
    },
  ];

  return (
    <TeamPageLayout>
      <div className="coordination-team-container">
        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="intro-icon">
            <FaCheckCircle />
          </div>
          <h2>Discipline & Coordination Team</h2>
          <p>
            Ensuring seamless operations and maintaining organizational
            excellence
          </p>
        </motion.div>

        <motion.div className="structure-grid">
          {["Planning", "Organization", "Execution", "Coordination"].map(
            (item, index) => (
              <motion.div
                key={item}
                className="structure-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="structure-icon">
                  <FaCheckCircle />
                </div>
                <span>{item}</span>
              </motion.div>
            )
          )}
        </motion.div>

        <div className="members-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="coordination-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
            >
              <div className="efficiency-meter">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="meter-background" />
                  <circle cx="50" cy="50" r="45" className="meter-progress" />
                </svg>
              </div>

              <div className="member-image">
                <img
                  src={`/team/members/coordination/${member.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.jpg`}
                  alt={member.name}
                  onError={(e) => {
                    e.target.src = "/team/members/default-avatar.jpg";
                  }}
                />
                <motion.div
                  className="image-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="social-links">
                    <motion.a
                      href={member.linkedin_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaLinkedin />
                    </motion.a>
                    <motion.a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaInstagram />
                    </motion.a>
                  </div>
                </motion.div>
              </div>
              <div className="member-info">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  {member.name}
                </motion.h3>
                <motion.p
                  className="member-role"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  {member.role}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TeamPageLayout>
  );
};

export default CoordinationTeam;
