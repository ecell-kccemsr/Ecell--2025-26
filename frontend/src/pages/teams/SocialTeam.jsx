import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaHeart,
  FaComment,
  FaShare,
} from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./SocialTeam.css";

const SocialTeam = () => {
  const teamMembers = [
    {
      name: "Shubham Gupta",
      role: "cohead",
      linkedin_profile_url: "https://www.linkedin.com/in/shubham-gupta",
      instagram_url: "https://www.instagram.com/shubhamgupta",
      twitter_url: "https://twitter.com/shubhamgupta",
    },
    {
      name: "Om Telgade",
      role: "head",
      linkedin_profile_url: "https://www.linkedin.com/in/om-telgade",
      instagram_url: "https://www.instagram.com/omtelgade",
      twitter_url: "https://twitter.com/omtelgade",
    },
  ];

  const socialIcons = [
    { Icon: FaInstagram, color: "#E1306C", delay: 0 },
    { Icon: FaFacebook, color: "#4267B2", delay: 0.2 },
    { Icon: FaTwitter, color: "#1DA1F2", delay: 0.4 },
    { Icon: FaYoutube, color: "#FF0000", delay: 0.6 },
  ];

  return (
    <TeamPageLayout>
      <div className="social-team-container">
        <div className="floating-socials">
          {socialIcons.map(({ Icon, color, delay }, index) => (
            <motion.div
              key={index}
              className="floating-icon"
              style={{ color }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: delay,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
            >
              <Icon />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Social Media Team</h2>
          <p>
            Crafting engaging content and building vibrant online communities
          </p>
        </motion.div>

        <div className="members-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="social-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="member-image">
                <img
                  src={`/team/members/social/${member.name
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
                    <motion.a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link twitter"
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTwitter />
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
              <div className="social-stats">
                <div className="stat">
                  <FaHeart />
                  <span>2.5K</span>
                </div>
                <div className="stat">
                  <FaComment />
                  <span>1.2K</span>
                </div>
                <div className="stat">
                  <FaShare />
                  <span>800</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TeamPageLayout>
  );
};

export default SocialTeam;
