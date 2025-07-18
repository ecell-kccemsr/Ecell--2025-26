import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-background">
        <div className="footer-shapes">
          <div className="footer-shape shape-1"></div>
          <div className="footer-shape shape-2"></div>
        </div>
      </div>

      <div className="container">
        <div className="footer-content">
          <div className="footer-section brand-section">
            <div className="footer-brand">
              <img
                src="/img23.jpg"
                alt="E-Cell footer logo"
                className="footer-logo"
              />
              <span className="footer-brand-text">E-CELL</span>
            </div>
            <p className="footer-description">
              Empowering the next generation of entrepreneurs through
              innovation, mentorship, and transformative experiences.
            </p>
            <div className="social-links">
              <a
                href="https://linkedin.com/company/ecell"
                className="social-link"
                aria-label="Follow us on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com/ecell"
                className="social-link"
                aria-label="Follow us on Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/ecell"
                className="social-link"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/ecell"
                className="social-link"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://youtube.com/ecell"
                className="social-link"
                aria-label="Subscribe to our YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="footer-section links-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/programs">Programs</Link>
              </li>
              <li>
                <Link to="/mentorship">Mentorship</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section programs-section">
            <h4 className="footer-title">Programs</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Startup Incubation</a>
              </li>
              <li>
                <a href="#">Innovation Workshops</a>
              </li>
              <li>
                <a href="#">Pitch Competitions</a>
              </li>
              <li>
                <a href="#">Mentorship Program</a>
              </li>
              <li>
                <a href="#">Industry Connect</a>
              </li>
              <li>
                <a href="#">Alumni Network</a>
              </li>
            </ul>
          </div>

          <div className="footer-section contact-section">
            <h4 className="footer-title">Get In Touch</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-label">Address</span>
                  <span className="contact-value">
                    3rd floor, Ecell Lab
                    <br />
                    KC college of engineering, Mithbandar road, Kopri Thane E
                  </span>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">kcecell@kccemsr.edu.in</span>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">+91 77100 22591</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content justify center">
            <p className="copyright">
              © 2025 E-Cell. All rights reserved. | Built with ❤️ by Raaj Patkar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
