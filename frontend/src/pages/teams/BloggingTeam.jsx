import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaMedium, FaPen } from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./BloggingTeam.css";

const BloggingTeam = () => {
  const teamMembers = [
    {
      name: "Dhwani Tiwari",
      role: "Blogger",
      linkedin_profile_url: "https://www.linkedin.com/in/dhwani-tiwari",
      medium_url: "https://medium.com/@dhwanitiwari",
    },
  ];

  return (
    <TeamPageLayout>
      <div className="blogging-team-container">
        <motion.div
          className="floating-pen"
          animate={{
            rotate: [0, 15, -15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaPen />
        </motion.div>

        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Blogging & Documentation Team</h2>
          <p>
            Capturing stories and preserving knowledge through compelling
            narratives
          </p>
        </motion.div>

        <div className="content-preview">
          <motion.div
            className="preview-line"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          ></motion.div>
          <motion.div
            className="preview-line"
            initial={{ width: 0 }}
            whileInView={{ width: "80%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          ></motion.div>
          <motion.div
            className="preview-line"
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          ></motion.div>
        </div>

        <div className="members-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="blogging-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="member-image">
                <img
                  src={`/team/${member.name
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`}
                  alt={member.name}
                  onError={(e) => {
                    e.target.src = "/team/default-avatar.jpg";
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
                      href={member.medium_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link medium"
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaMedium />
                    </motion.a>
                  </div>
                </motion.div>
              </div>
              <div className="member-info">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {member.name}
                </motion.h3>
                <motion.p
                  className="member-role"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
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

export default BloggingTeam;
