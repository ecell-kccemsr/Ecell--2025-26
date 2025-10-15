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
                src="/ecelllogo.jpg"
                alt="E-Cell footer logo"
                className="footer-logo"
              />
              
            </div>
            <p className="footer-description">
              Empowering the next generation of entrepreneurs through
              innovation, mentorship, and transformative experiences.
            </p>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/company/kcecell/"
                className="social-link"
                aria-label="Follow us on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              
              
              <a
                href="https://instagram.com/kcecell_"
                className="social-link"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              
              <a
                href="https://www.youtube.com/@kc-ecell"
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
                <Link to="https://events.kcecell.org/">Events</Link>
              </li>
              <li>
                <Link to="/programs">Programs</Link>
              </li>
              <li>
                <Link to="/mentor">Mentorship</Link>
              </li>
              <li>
                <Link to="mailto:kccell@kccemsr.edu.in">Contact</Link>
              </li>
            </ul>
          </div>

          <div>

          </div>
          

          <div className="footer-section contact-section">
            <h2 >Say <span className="highlight">hello!</span></h2>
              <p className="contact-label">K.C. Ecell a team of student developers</p>
            <div className="contact-info">
              <div className="contact-item">
                
                <div className="contact-details">
                  <span className="contact-label">Address</span>
                  <span className="contact-value">
                    Mith Bunder Road, Near Sadguru Garden, Kopri, Thane (E) 400603.
                  </span>
                </div>
              </div>
              
              <div className="contact-item">
                
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">kcecell@kccemsr.edu.in</span>
                </div>
              </div>
              <div className="contact-item">
                
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
              © 2025 E-Cell. All rights reserved. | Built with ❤️ by <a href="https://github.com/iraajp" target="_blank" rel="noopener noreferrer">Raaj Patkar</a>, <a href="https://github.com/krishnamundhara" target="_blank" rel="noopener noreferrer">Krishna Mundhara</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
