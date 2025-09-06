import React, { useState, useEffect } from "react";
import Logo from "./Logo.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTeamsDropdownOpen, setIsTeamsDropdownOpen] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".navbar")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <nav className="navbar">
        <a href="/" className="brand">
          <Logo
            style={{ width: "64px", height: "64px", background: "transparent" }}
          />
          <span className="brand-text"></span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-nav">
          <Link to="https://events.kcecell.org/" className="nav-link">
            Events
          </Link>

          <Link to="/mentor" className="nav-link">
            Our Mentors
          </Link>

          <div
            className="nav-link teams-dropdown"
            onMouseEnter={() => setIsTeamsDropdownOpen(true)}
            onMouseLeave={() => setIsTeamsDropdownOpen(false)}
          >
            <span>Teams</span>
            {isTeamsDropdownOpen && (
              <motion.div
                className="dropdown-content"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/teams/lead" className="dropdown-item">
                  Leadership Team
                </Link>
                <Link to="/teams/web-development" className="dropdown-item">
                  Web Development Team
                </Link>
                <Link to="/teams/game-development" className="dropdown-item">
                  Game Development Team
                </Link>
                <Link to="/teams/iot" className="dropdown-item">
                  IoT & Hardware Team
                </Link>
                <Link to="/teams/coordination" className="dropdown-item">
                  Content & Coordination
                </Link>
                <Link to="/teams/events" className="dropdown-item">
                  Events Team
                </Link>
                <Link to="/teams/social-media" className="dropdown-item">
                  Social Media Team
                </Link>
              </motion.div>
            )}
          </div>

          <Link to="https://contact.kcecell.org/" className="nav-link">
            Contact Us
          </Link>
          <Link
            to="https://failurscafe.kcecell.org/"
            className="nav-link admin-link"
          >
            Failurs's Cafe
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <motion.div
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="mobile-menu-dropdown"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-content">
                <motion.div
                  className="mobile-menu-header"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mobile-brand">
                    <img
                      src="/img1.jpg"
                      alt="E-Cell logo"
                      className="mobile-logo"
                    />
                    <span className="mobile-brand-text">E-CELL</span>
                  </div>
                  <button
                    className="mobile-menu-close"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                  >
                    ×
                  </button>
                </motion.div>

                <div className="mobile-menu-links">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/events", label: "Events" },
                    {
                      label: "Teams",
                      submenu: [
                        { to: "/teams/lead", label: "the lead" },
                        { to: "/teams/web-development", label: "Web Development Team" },
                        {
                          to: "/teams/game-development",
                          label: "Game Development Team",
                        },
                        { to: "/teams/iot", label: "IoT & Hardware Team" },
                        {
                          to: "/teams/coordination",
                          label: "Content & Coordination",
                        },
                        { to: "/teams/events", label: "Events Team" },
                        { to: "/teams/social", label: "Social Media Team" },
                      ],
                    },
                    { to: "#about", label: "About", scroll: true },
                    { to: "/contact", label: "Contact" },
                    { to: "/admin", label: "Admin", className: "admin-link" },
                  ].map((link, index) => (
                    <motion.div
                      key={link.to}
                      variants={menuItemVariants}
                      custom={index}
                      className="mobile-menu-item"
                    >
                      {link.submenu ? (
                        <div className="mobile-submenu">
                          <div className="mobile-nav-link submenu-label">
                            {link.label}
                          </div>
                          <div className="submenu-items">
                            {link.submenu.map((sublink, subIndex) => (
                              <Link
                                key={subIndex}
                                to={sublink.to}
                                className="mobile-nav-link submenu-item"
                                onClick={closeMobileMenu}
                              >
                                {sublink.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : link.scroll ? (
                        <a
                          href="#about"
                          className={`mobile-nav-link ${link.className || ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            closeMobileMenu();
                            const aboutSection =
                              document.getElementById("about");
                            if (aboutSection) {
                              aboutSection.scrollIntoView({
                                behavior: "smooth",
                              });
                            }
                          }}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className={`mobile-nav-link ${link.className || ""}`}
                          onClick={closeMobileMenu}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  <motion.div
                    variants={menuItemVariants}
                    custom={6}
                    className="mobile-menu-item login-item"
                  ></motion.div>
                </div>

                <motion.div
                  className="mobile-menu-footer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p>Empowering Entrepreneurs</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
