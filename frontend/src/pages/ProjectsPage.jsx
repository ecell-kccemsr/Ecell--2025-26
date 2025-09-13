import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "./ProjectsPage.css";
import Header from "../components/Header";

const ProjectsPage = () => {
  const projects = [
    {
      name: "E-Cell Website",
      description: "Redesigning the Ecells Website 2025-20206 ",
      image: "projects/ecell-website.jpg",
      github_url: "https://github.com/ecell-kccemsr/Ecell--2025-26",
      live_url: "https://kcecell.org",
      tech_stack: ["MERN"],
    },
    {
      name: "Classroom Streamer ",
      description:
        "Classroom Monitoring Platform A scalable, live video streaming platform for classroom monitoring. Manages thousands of streams with a resilient microservices architecture. Features include intelligent agents, one-command deployment, and a 30-40% increase in lecture quality.",
      image: "/img/projects/ecell-website.jpg",
      github_url: "https://github.com/ecell-kccemsr/CMP",

      tech_stack: ["FastAPI", "FFmpeg", "Docker", "React"],
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

      <div className="projects-grid">
        {projects.map((project, index) => (
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
                  e.target.src = "/img/projects/default-project.jpg";
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
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
