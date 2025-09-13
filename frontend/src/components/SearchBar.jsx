import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({ projects, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of the search component
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      onSearch("");
      return;
    }

    // Generate suggestions based on project names and tech stack
    const newSuggestions = projects.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.tech_stack.some((tech) =>
          tech.toLowerCase().includes(searchLower)
        ) ||
        project.description.toLowerCase().includes(searchLower)
      );
    });

    setSuggestions(newSuggestions);
    onSearch(searchTerm);
  }, [searchTerm, projects, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (projectName) => {
    setSearchTerm(projectName);
    setShowSuggestions(false);
    onSearch(projectName);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <motion.div
        className="search-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search projects by name, technology, or description..."
          className="search-input"
          onFocus={() => setShowSuggestions(true)}
        />
      </motion.div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className="suggestions-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((project, index) => (
              <motion.div
                key={project.name}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(project.name)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{
                  backgroundColor: "var(--tertiary-bg)",
                  x: 5,
                }}
              >
                <div className="suggestion-content">
                  <span className="suggestion-name">{project.name}</span>
                  <div className="suggestion-tech-stack">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="tech-tag-small">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
