import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaCalendarAlt } from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./EventsTeam.css";

const EventsTeam = () => {
  const teamMembers = [
    {
      name: "Medhali Bangera",
      role: "Head",
      linkedin_profile_url: "https://www.linkedin.com/in/medhali-bangera",
      instagram_url: "https://www.instagram.com/medhalibangera",
    },
    {
      name: "Srishti Kotian",
      role: "Co-head",
      linkedin_profile_url: "https://www.linkedin.com/in/srishti-kotian",
      instagram_url: "https://www.instagram.com/srishtikotian",
    },
  ];

  const floatingIcons = [
    { icon: <FaCalendarAlt />, delay: 0 },
    { icon: <FaCalendarAlt />, delay: 2 },
    { icon: <FaCalendarAlt />, delay: 4 },
  ];

  return (
    <TeamPageLayout>
      <div className="events-team-container">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="floating-icon"
            style={{
              left: `${25 + index * 25}%`,
              top: `${20 + (index % 2) * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 5,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Events Team</h2>
          <p>Creating unforgettable experiences and bringing ideas to life</p>
        </motion.div>

        <div className="members-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="events-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="member-image">
                <img
                  src={`/team/members/events/${member.name
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
              <div className="card-decorations">
                <div className="decoration-dot dot-1"></div>
                <div className="decoration-dot dot-2"></div>
                <div className="decoration-dot dot-3"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TeamPageLayout>
  );
};

export default EventsTeam;
