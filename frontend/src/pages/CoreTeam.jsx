import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaMedium,
  FaTwitter,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CoreTeam.css";

const CoreTeam = () => {
  // Team data organized by semester (newest first)
  const teamsBySemester = [
    {
      semester: "Odd Semester 2025-26",
      year: "2025-26",
      members: [
        // Leadership Team
        {
          name: "Vivek Pawar",
          role: "President",
          department: "Leadership",
          linkedin_profile_url:
            "https://www.linkedin.com/in/vivekapawar",
          github_url: "https://github.com/GDVivekPawarr",
          instagram_url:
            "https://www.instagram.com/vivekpawar5576",
          imagePath: "/team/members/lead/vivek-pawar.jpg",
        },
        {
          name: "Samrath Singh",
          role: "Vice President",
          department: "Leadership",
          linkedin_profile_url:
            "https://www.linkedin.com/in/samrath-singh-hayer-4aa643318",
          instagram_url: "https://www.instagram.com/s.samrath23/",
          github_url: "https://github.com/shadowcodesinjava",
          imagePath: "/team/members/lead/samrath-singh.jpg",
        },
        {
          name: "Daman Randhawa",
          role: "Secretary",
          department: "Leadership",
          linkedin_profile_url: "https://www.linkedin.com/in/damandeep-randhawa",
          instagram_url: "https://www.instagram.com/_damaaan_",
          imagePath: "/team/members/lead/daman-randhawa.jpg",
        },
        {
          name: "Vinay Vishwakarma",
          role: "Finance Secretary",
          department: "PR & Finance",
          linkedin_profile_url: "https://www.linkedin.com/in/vinay-vishwakarma",
          instagram_url: "https://www.instagram.com/itz_vinay_20_",
          imagePath: "/team/members/pr-finance/vinay-vishwakarma.jpg",
        },{
          name: "Aryan Yadav",
          role: "Head",
          department: "Game Development",
          linkedin_profile_url: "https://www.linkedin.com/in/aryan-yadav-4082ba298",
          github_url: "https://github.com/aryanyadavpro",
          imagePath: "/team/members/gamedev/aryan-yadav.jpg",
        },
        {
          name: "Dhwani Tiwari",
          role: "Blogger",
          department: "Blogging",
          linkedin_profile_url: "http://www.linkedin.com/in/dhwani-tiwari",
          medium_url: "https://medium.com/@kcecell",
          imagePath: "/team/members/blogging/dhwani-tiwari.jpg",

        },
        {
          name: "Medhali Bangera",
          role: "Head",
          department: "Events",
          linkedin_profile_url: "https://www.linkedin.com/in/medhali-bangera-5a8001297",
          instagram_url: "https://www.instagram.com/_.yours_truly5",
          imagePath: "/team/members/events/medhali-bangera.jpg",
        },
        {
          name: "Aayush Kashid",
          role: "Head",
          department: "IoT & Hardware",
          linkedin_profile_url: "https://www.linkedin.com/in/aayush-kashid-471790230",
          github_url: "https://github.com/aayush-kc28",
          instagram_url: "https://www.instagram.com/aayush_ak_77/",
          imagePath: "/team/members/iot/aayush-kashid.jpg",

        },
        {
          name: "Om Telgade",
          role: "Head",
          department: "Social Media",
          linkedin_profile_url: "https://www.linkedin.com/in/om-telgade-1100a025b",
          instagram_url: "https://www.instagram.com/om_telgade14",
          github_url: "https://github.com/omtelgade14",
          imagePath: "/team/members/social/om-telgade.jpg",
        },

        {
          name: "Aryan Wesavkar",
          role: "Co-head",
          department: "Game Development",
          linkedin_profile_url: "http://linkedin.com/in/aryan-w",
          github_url: "https://github.com/25-THEBEaST-25",
          imagePath: "/team/members/gamedev/aryan-wesavkar.jpg",
        },{
          name: "Shubham Gupta",
          role: "Co-head",
          department: "Social Media",
          linkedin_profile_url: "https://www.linkedin.com/in/shubham-gupta-4b274b299",
          instagram_url: "https://www.instagram.com/shubha.a.m",
          twitter_url: "https://twitter.com/shubhamgupta",
          imagePath: "/team/members/social/shubham-gupta.jpg",
        },

        {
          name: "Raaj Patkar",
          role: "Head",
          department: "Web Development",
          linkedin_profile_url: "https://www.linkedin.com/in/raaj-patkar",
          github_url: "https://github.com/iraajp",
          instagram_url: "https://www.instagram.com/raaj.builds",
          imagePath: "/team/members/webdev/raaj-patkar.jpg",
          badge: "Developer of this site",
        },
        {
          name: "Krishna Mundhara",
          role: "Co-head",
          department: "Web Development",
          linkedin_profile_url: "https://www.linkedin.com/in/krishna-mundhara-b6074933a/",
          github_url: "https://github.com/krishnamundhara",
          imagePath: "/team/members/webdev/krishna-mundhara.jpg",
        },
        // Game Development Team
        
        {
          name: "Daivik Pawar",
          role: "PR Head",
          department: "PR & Finance",
          linkedin_profile_url: "https://www.linkedin.com/in/daivik-pawar-6146892a8/",
          instagram_url: "https://www.instagram.com/sup.daivik/",
          imagePath: "/team/members/pr-finance/daivik-pawar.jpg",
        },
        
        
        {
          name: "Prathmesh Ghude",
          role: "Co-head",
          department: "IoT & Hardware",
          linkedin_profile_url: "https://www.linkedin.com/in/prathmesh-ghude-341b372b0/",
          github_url: "https://github.com/prathmeshghude",
          imagePath: "/team/members/iot/prathmesh-ghude.jpg",
        },
    
        
        {
          name: "Srishti Kotian",
          role: "Co-head",
          department: "Events",
          linkedin_profile_url: "https://www.linkedin.com/in/srishti-kotian-3a9b9130b",
          instagram_url: "https://www.instagram.com/_srishhhhhhh_",
          imagePath: "/team/members/events/srishti-kotian.jpg",
        },
        // Coordination Team
        {
          name: "Devanshi Thakur",
          role: "Overall Coordinator",
          department: "Coordination",
          
          imagePath: "/team/members/coordination/devanshi-thakur.jpg",
        },
        {
          name: "Tanushree Karwatkar",
          role: "Deputy Overall Coordinator",
          department: "Coordination",
          linkedin_profile_url:
            "https://www.linkedin.com/in/tanushree-karwatkar-8341382a3",
          instagram_url: "https://www.instagram.com/tanushreekarwatkar111",
          github_url: "https://github.com/tanushreekarwatkar",
          imagePath: "/team/members/coordination/tanushree-karwatkar.jpg",
        },
        // Social Media Team
        
        
        // PR & Finance Team
        
        
      ],
    },
    // Add new semesters here - they will appear at the top
    // Example structure for future semesters:
    // {
    //   semester: "Even Semester 2025-26",
    //   year: "2025-26",
    //   members: [
    //     // Add new members here
    //   ],
    // },
  ];

  return (
    <div className="core-team-page">
      <Header />

      <motion.section
        className="core-team-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <motion.div
            className="core-team-hero-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="core-team-hero-title">
              Our <span className="highlight">Core Team</span>
            </h1>
            <p className="core-team-hero-subtitle">
              Meet the passionate individuals driving innovation and
              entrepreneurship at E-Cell KCCEMSR
            </p>
          </motion.div>
        </div>
      </motion.section>

      <section className="core-team-content">
        <div className="container">
          {/* Semester Groups */}
          {teamsBySemester.map((semesterGroup, semesterIndex) => (
            <motion.div
              key={semesterGroup.semester}
              className="semester-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: semesterIndex * 0.2 }}
            >
              {/* Semester Header */}
              <motion.div
                className="semester-header"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="semester-title">{semesterGroup.semester}</h2>
                <div className="semester-divider"></div>
              </motion.div>

              {/* Members Grid */}
              <motion.div
                className="members-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {semesterGroup.members.map((member, index) => (
                  <motion.div
                    key={member.name}
                    className="core-member-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="member-image">
                      <img
                        src={member.imagePath}
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
                          {member.linkedin_profile_url && (
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
                          )}
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
                          {member.twitter_url && (
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
                          )}
                          {member.medium_url && (
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
                          )}
                        </div>
                      </motion.div>
                    </div>
                    <div className="member-info">
                      {member.badge && (
                        <motion.div
                          className="member-badge"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                            delay: 0.5,
                          }}
                        >
                          {member.badge}
                        </motion.div>
                      )}
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
                      <motion.p
                        className="member-department"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        {member.department}
                      </motion.p>
                    </div>
                    <div className="card-decorations">
                      <div className="decoration-dot dot-1"></div>
                      <div className="decoration-dot dot-2"></div>
                      <div className="decoration-dot dot-3"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoreTeam;
