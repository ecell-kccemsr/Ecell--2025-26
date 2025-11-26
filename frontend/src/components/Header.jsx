import React, { useState, useEffect } from "react";
import Logo from "./Logo.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        backgroundColor: "rgba(10, 10, 10, 0.7)",
        borderBottom: "1px solid rgba(0, 255, 157, 0.15)",
        boxShadow: "0 4px 20px rgba(0, 255, 157, 0.05)",
      }}
    >
      <nav
        className="navbar centered-navbar"
        style={{
          padding: isMobile ? "0.75rem 1rem" : "0.8rem 2rem",
          position: "relative",
          display: "flex",
          justifyContent: isMobile ? "space-between" : "flex-start",
          alignItems: "center",
          maxWidth: "100%",
          margin: "0 auto",
          width: "100%",
          height: "auto",
          minHeight: isMobile ? "60px" : "70px",
          gap: "2rem",
        }}
      >
        {/* Logo Block */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <motion.div
              className="brand center-logo"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              style={{
                cursor: "pointer",
              }}
            >
              <Logo
                style={{
                  width: isMobile ? "48px" : "64px",
                  height: isMobile ? "48px" : "64px",
                  background: "transparent",
                  borderRadius: "12px",
                }}
              />
              <span className="brand-text"></span>
            </motion.div>
          </Link>
        </div>

        {/* Left Navigation Block */}
        {!isMobile && (
          <div
            className="nav-links left-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              position: "relative",
              left: "0",
              flex: "1 1 auto",
              justifyContent: "left",
            }}
          >
            <Link to="/" className="nav-link highlighted-link">
              Home
            </Link>

            <Link to="/about" className="nav-link">
              About
            </Link>

            <Link to="/events" className="nav-link">
              Events
            </Link>

            <Link to="/projects" className="nav-link">
              Projects
            </Link>

            <Link to="/wall-of-fame" className="nav-link">
              Wall of Fame
            </Link>
          </div>
        )}

        {/* Right Navigation Block */}
        {!isMobile && (
          <div
            className="nav-links right-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              position: "relative",
              right: "0",
              flex: "0 0 auto",
              marginLeft: "auto",
            }}
          >
            <Link to="/mentor" className="nav-link">
              Our Mentors
            </Link>

            <Link to="/team" className="nav-link">
              Team
            </Link>

            <a
              href="mailto:kccell@kccemsr.edu.in"
              className="nav-link"
            >
              Contact Us
            </a>
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        {isMobile && (
          <motion.button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "12px",
              zIndex: 1002,
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "50px",
              height: "50px",
              minHeight: "48px",
              minWidth: "48px",
              justifyContent: "center",
              alignItems: "center",
              touchAction: "manipulation",
            }}
          >
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: "0px" }}
            >
              {[1, 2, 3].map((_, i) => (
                <motion.span
                  key={i}
                  style={{
                    width: "35px",
                    height: "3px",
                    background: isMobileMenuOpen ? "#00ff9d" : "#fff",
                    display: "block",
                    transition: "all 0.3s ease",
                    transformOrigin: "center",
                    opacity: i === 1 && isMobileMenuOpen ? 0 : 1,
                    transform:
                      isMobileMenuOpen && i === 0
                        ? "rotate(45deg) translate(7px, 7px)"
                        : isMobileMenuOpen && i === 2
                        ? "rotate(-45deg) translate(5px, -5px)"
                        : "none",
                  }}
                />
              ))}
            </motion.div>
          </motion.button>
        )}
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-dropdown"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              zIndex: 1001,
              overflowY: "auto",
            }}
          >
            <div
              className="mobile-menu-content"
              style={{
                padding: "2rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <motion.div
                className="mobile-menu-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "3rem",
                }}
              >
                <div
                  className="mobile-brand"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <img
                    src="/img2.png"
                    alt="E-Cell logo"
                    className="mobile-logo"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "10px",
                    }}
                  />
                  <span
                    className="mobile-brand-text"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#00ff9d",
                    }}
                  >
                    We Build !!
                  </span>
                </div>
              </motion.div>

              <div
                className="mobile-menu-links"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  flex: 1,
                }}
              >
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/events", label: "Events" },
                  { to: "/projects", label: "Projects" },
                  { to: "/wall-of-fame", label: "Wall of Fame" },
                  { to: "/mentor", label: "Our Mentors" },
                  { to: "/team", label: "Team" },
                ].map((link, index) => (
                  <motion.div
                    key={link.to}
                    variants={menuItemVariants}
                    custom={index}
                    className="mobile-menu-item"
                  >
                    <Link
                      to={link.to}
                      className={`mobile-nav-link ${link.className || ""}`}
                      onClick={closeMobileMenu}
                      style={{
                        fontSize: "1.5rem",
                        color: "#fff",
                        textDecoration: "none",
                        padding: "1rem",
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(5px)",
                        display: "block",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(0, 255, 157, 0.1)";
                        e.target.style.transform = "translateX(10px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.05)";
                        e.target.style.transform = "translateX(0)";
                      }}
                    >
                      {link.label}
                    </Link>
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
                style={{
                  marginTop: "auto",
                  textAlign: "center",
                  padding: "2rem 0",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: "1rem",
                  }}
                >
                  Empowering Entrepreneurs
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  © 2025 E-Cell KCCEMSR
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
