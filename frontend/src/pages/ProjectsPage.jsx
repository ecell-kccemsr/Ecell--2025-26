import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "./ProjectsPage.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    {
      name: "E-Cell Website",
      description: "Redesigning the Ecells Website 2025-20206",
      image: "projects/ecell-website.jpg",
      github_url: "https://github.com/ecell-kccemsr/Ecell--2025-26",
      live_url: "https://kcecell.org",
      tech_stack: ["MERN"],
      team: {
        type: "solo",
        name: "Raaj Patkar",
        role: "Full Stack Developer",
        github: "https://github.com/raajpatkar",
      },
    },
    {
      name: "CMP",
      description:
        "Classroom Monitoring Platform A scalable, live video streaming platform for classroom monitoring. Manages thousands of streams with a resilient microservices architecture. Features include intelligent agents, one-command deployment, and a 30-40% increase in lecture quality.",
      image: "/projects/CMP.jpg",
      github_url: "https://github.com/ecell-kccemsr/CMP",
      tech_stack: ["FastAPI", "FFmpeg", "Docker", "React"],
      team: {
        type: "team",
        name: "Project CMP Team",
        members: [
          
        ],
      },
    },
    {
      name: "ClusterKnox",
      description:
        "A Clustering service providing the best computing power to the ecell students in a centralized way.",
      image: "/projects/clusterknox.jpg",
      tech_stack: ["Python", "Docker", "Kubernetes"],
      team: {
        type: "solo",
        name: "Raaj Patkar",
        role: "Full Stack Developer",
        github: "https://github.com/raajpatkar",
      },
    },
    // Add more projects here
  ];

  return (
    <div className="projects-page">
      <Header />
      <motion.div
        className="projects-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Our Projects</h1>
        <p>Showcasing innovation through technology</p>
      </motion.div>

      <SearchBar projects={projects} onSearch={setSearchTerm} />

      <div className="projects-grid">
        {projects
          .filter((project) => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();

            // Check if it's a team project
            const teamMemberMatch =
              project.team.type === "team" &&
              project.team.members.some(
                (member) =>
                  member.name.toLowerCase().includes(searchLower) ||
                  member.role.toLowerCase().includes(searchLower)
              );

            // Check if it's a solo project
            const soloAuthorMatch =
              project.team.type === "solo" &&
              (project.team.name.toLowerCase().includes(searchLower) ||
                project.team.role.toLowerCase().includes(searchLower));

            return (
              project.name.toLowerCase().includes(searchLower) ||
              project.tech_stack.some((tech) =>
                tech.toLowerCase().includes(searchLower)
              ) ||
              project.description.toLowerCase().includes(searchLower) ||
              teamMemberMatch ||
              soloAuthorMatch
            );
          })
          .map((project, index) => (
            <motion.div
              key={project.name}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="project-image">
                <img
                  src={project.image}
                  alt={project.name}
                  onError={(e) => {
                    e.target.src = "/projects/default-project.jpg";
                  }}
                />
                <motion.div
                  className="image-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="project-links">
                    <motion.a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link github"
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGithub />
                      <span>View Code</span>
                    </motion.a>
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link live"
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExternalLinkAlt />
                        <span>Live Demo</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </div>
              <div className="project-info">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  {project.name}
                </motion.h3>
                <motion.p
                  className="project-description"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  {project.description}
                </motion.p>
                <motion.div
                  className="tech-stack"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  className="project-team"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  {project.team.type === "team" ? (
                    <>
                      <div className="team-header">
                        <span className="team-label">Team</span>
                        <h4>{project.team.name}</h4>
                      </div>
                      <div className="solo-author">
                        {project.team.members.map((member, idx) => (
                          <motion.div
                            key={member.name}
                            className="author-label"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                          >
                            <div className="author-label]">
                              <span className="team-member"><h4>{member.name} </h4></span>
                              <span className="author-role">{member.role}</span>
                            
                            
                      </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="solo-author">
                      <div className="author-header">
                        <span className="author-label">Developer</span>
                        <div className="author-info">
                          <h4>{project.team.name}</h4>
                          <span className="author-role">
                            {project.team.role}
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
