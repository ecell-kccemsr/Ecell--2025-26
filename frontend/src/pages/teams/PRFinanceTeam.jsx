import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaChartLine,
  FaHandshake,
  FaBalanceScale,
  FaBullseye,
} from "react-icons/fa";
import TeamPageLayout from "../../components/shared/TeamPageLayout";
import "./PRFinanceTeam.css";

const PRFinanceTeam = () => {
  const teamMembers = [
    {
      name: "Vinay Vishwakarma",
      role: "Finance Secretary",
      linkedin_profile_url: "https://www.linkedin.com/in/vinay-vishwakarma",
    },
    {
      name: "Daivik Pawar",
      role: "PR Head",
      linkedin_profile_url: "https://www.linkedin.com/in/daivik-pawar",
    },
  ];

  const statistics = [
    { icon: <FaChartLine />, label: "Growth", value: "+45%" },
    { icon: <FaHandshake />, label: "Partnerships", value: "20+" },
    { icon: <FaBalanceScale />, label: "Budget Managed", value: "₹2M+" },
    { icon: <FaBullseye />, label: "PR Reach", value: "50K+" },
  ];

  return (
    <TeamPageLayout>
      <div className="prfinance-team-container">
        <motion.div
          className="team-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>PR & Finance Team</h2>
          <p>
            Managing relationships and resources with precision and
            professionalism
          </p>
        </motion.div>

        <motion.div
          className="statistics-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="members-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="prfinance-member-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="card-accent"></div>
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
                <div className="role-accent"></div>
              </div>

              <div className="member-expertise">
                {member.role.includes("Finance") ? (
                  <div className="expertise-tags">
                    <span>Budget Planning</span>
                    <span>Financial Analysis</span>
                    <span>Resource Management</span>
                  </div>
                ) : (
                  <div className="expertise-tags">
                    <span>Media Relations</span>
                    <span>Brand Strategy</span>
                    <span>Communications</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="values-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="value-card transparency">
            <h4>Transparency</h4>
            <p>Clear communication and open financial reporting</p>
          </div>
          <div className="value-card integrity">
            <h4>Integrity</h4>
            <p>Maintaining highest standards of professional conduct</p>
          </div>
          <div className="value-card excellence">
            <h4>Excellence</h4>
            <p>Striving for perfection in every initiative</p>
          </div>
        </motion.div>
      </div>
    </TeamPageLayout>
  );
};

export default PRFinanceTeam;
