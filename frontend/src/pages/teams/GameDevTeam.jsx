import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaGamepad } from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./GameDevTeam.css";

const GameDevTeam = () => {
  const teamMembers = [
    {
      name: "Aryan Yadav",
      role: "Head",
      linkedin_profile_url: "https://www.linkedin.com/in/aryan-yadav",
      github_url: "https://github.com/aryanyadav",
    },
    {
      name: "Aryan Wesavkar",
      role: "Co-head",
      linkedin_profile_url: "https://www.linkedin.com/in/aryan-wesavkar",
      github_url: "https://github.com/aryanwesavkar",
    },
  ];

  return (
    <TeamPageLayout>
      <div className="gamedev-team-container">
        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Game Development Team</h2>
          <p>
            Creating immersive experiences and pushing the boundaries of
            interactive entertainment
          </p>
        </motion.div>

        <motion.div
          className="floating-gamepad"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaGamepad />
        </motion.div>

        <div className="members-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="gamedev-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="member-image">
                <img
                  src={`/team/members/gamedev/${member.name
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
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link github"
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGithub />
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

export default GameDevTeam;
