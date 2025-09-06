import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./LeadTeam.css";

const LeadTeam = () => {
  const members = [
    {
      name: "Vivek Pawar",
      role: "President",
      linkedin_profile_url: "https://www.linkedin.com/in/vivek-pawar",
      instagram_url: "https://instagram.com/vivekpawar",
    },
    {
      name: "Samrath Singh",
      role: "Vice President",
      linkedin_profile_url: "https://www.linkedin.com/in/samrath-singh",
      instagram_url: "https://instagram.com/samrathsingh",
    },
    {
      name: "Daman Randhawa",
      role: "Secretary",
      linkedin_profile_url: "https://www.linkedin.com/in/daman-randhawa",
      instagram_url: "https://instagram.com/damanrandhawa",
    },
  ];

  return (
    <TeamPageLayout>
      <div className="lead-team-container">
        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Leadership Team</h2>
          <p>
            Driving innovation and entrepreneurship forward with passion and
            vision
          </p>
        </motion.div>

        <div className="members-grid">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              className="lead-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="member-image">
               <img
                  src={`/team/members/lead/${member.name
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
                    {member.instagram_url && (
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
                    )}
                    {member.github_url && (
                      <motion.a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link github"
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGithub />
                      </motion.a>
                    )}
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

export default LeadTeam;
