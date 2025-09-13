import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaMedal, FaAward, FaFilter } from "react-icons/fa";
import Header from "../components/Header";
import "./WallOfFame.css";

const WallOfFame = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const achievements = [
    {
      id: 1,
      studentName: "Team Innovators",
      members: ["John Doe", "Jane Smith", "Alex Johnson"],
      achievement: "First Place - Smart India Hackathon 2025",
      category: "hackathon",
      description:
        "Developed an AI-powered solution for rural healthcare accessibility",
      image: "/achievements/sih-2025.jpg",
      year: "2025",
      prize: "₹1,00,000",
      organization: "Government of India",
      projectLink: "https://github.com/team-innovators/rural-health",
    },
    {
      id: 2,
      studentName: "Sarah Wilson",
      achievement: "Winner - E-Cell National Entrepreneurship Challenge",
      category: "entrepreneurship",
      description: "Business plan for sustainable fashion marketplace",
      image: "/achievements/nec-2025.jpg",
      year: "2025",
      prize: "₹50,000",
      organization: "E-Cell IIT Bombay",
    },
    // Add more achievements here
  ];

  const categories = [
    { id: "all", label: "All Achievements", icon: FaAward },
    { id: "hackathon", label: "Hackathons", icon: FaTrophy },
    { id: "entrepreneurship", label: "Entrepreneurship", icon: FaMedal },
    { id: "innovation", label: "Innovation", icon: FaAward },
  ];

  const years = ["all", "2025", "2024", "2023"];

  const filteredAchievements = achievements.filter((achievement) => {
    if (
      selectedCategory !== "all" &&
      achievement.category !== selectedCategory
    ) {
      return false;
    }
    if (selectedYear !== "all" && achievement.year !== selectedYear) {
      return false;
    }
    return true;
  });

  return (
    <div className="wall-of-fame">
      <Header />
      <div className="wall-of-fame-content">
        <motion.div
          className="wall-of-fame-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Wall of Fame</h1>
          <p>Celebrating excellence and innovation at E-Cell KCCEMSR</p>
        </motion.div>

        <div className="filters-section">
          <div className="categories-filter">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="category-icon" />
                {category.label}
              </motion.button>
            ))}
          </div>

          <div className="years-filter">
            <FaFilter className="filter-icon" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              <option value="all">All Years</option>
              {years
                .filter((year) => year !== "all")
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <motion.div layout className="achievements-grid">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className="achievement-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="achievement-image">
                  <img
                    src={achievement.image}
                    alt={achievement.achievement}
                    onError={(e) => {
                      e.target.src = "/achievements/default.jpg";
                    }}
                  />
                  <div className="achievement-overlay">
                    <span className="achievement-category">
                      {achievement.category.charAt(0).toUpperCase() +
                        achievement.category.slice(1)}
                    </span>
                    <span className="achievement-year">{achievement.year}</span>
                  </div>
                </div>

                <div className="achievement-content">
                  <h3>{achievement.achievement}</h3>

                  {achievement.members ? (
                    <div className="team-members">
                      <h4>Team Members:</h4>
                      <ul>
                        {achievement.members.map((member, index) => (
                          <li key={index}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="student-name">{achievement.studentName}</p>
                  )}

                  <p className="achievement-description">
                    {achievement.description}
                  </p>

                  <div className="achievement-details">
                    <div className="detail-item">
                      <span className="detail-label">Prize:</span>
                      <span className="detail-value">{achievement.prize}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Organization:</span>
                      <span className="detail-value">
                        {achievement.organization}
                      </span>
                    </div>
                  </div>

                  {achievement.projectLink && (
                    <motion.a
                      href={achievement.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Project
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default WallOfFame;
