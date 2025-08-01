import React, { useState, useEffect } from "react";
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
    >
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/img1.png" alt="E-Cell logo" className="logo" />
          <span className="brand-text">E-CELL</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/events" className="nav-link">
            Events
          </Link>
          <Link to="/team" className="nav-link">
            Team
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          <Link to="/admin" className="nav-link admin-link">
            Admin
          </Link>
          <Link to="/login" className="login-btn">
            Login
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
                    { to: "/team", label: "Team" },
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" },
                    { to: "/admin", label: "Admin", className: "admin-link" },
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
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={menuItemVariants}
                    custom={6}
                    className="mobile-menu-item login-item"
                  >
                    <Link
                      to="/login"
                      className="mobile-login-btn"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                  </motion.div>
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
