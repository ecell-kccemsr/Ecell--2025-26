import { Link } from 'react-router-dom'
import './Footer.css'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <img src="/logo-white.png" alt="E-Cell Logo" />
              <span className="footer-logo-text">E-Cell</span>
            </Link>
            <p className="footer-about">
              E-Cell is the Entrepreneurship Cell of our college, dedicated to fostering innovation and entrepreneurial spirit among students.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/">Home</Link>
              </li>
              <li className="footer-link">
                <Link to="/about">About Us</Link>
              </li>
              <li className="footer-link">
                <Link to="/events">Events</Link>
              </li>
              <li className="footer-link">
                <Link to="/team">Our Team</Link>
              </li>
              <li className="footer-link">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/blogs">Blog</Link>
              </li>
              <li className="footer-link">
                <Link to="/startup-resources">Startup Resources</Link>
              </li>
              <li className="footer-link">
                <Link to="/mentorship">Mentorship</Link>
              </li>
              <li className="footer-link">
                <Link to="/faqs">FAQs</Link>
              </li>
              <li className="footer-link">
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>ecell@example.com</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+91 9876543210</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>College Campus, City, State, India</span>
            </div>
            
            <div className="newsletter">
              <h3 className="footer-heading">Newsletter</h3>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  className="newsletter-input" 
                  placeholder="Enter your email" 
                  required 
                />
                <button type="submit" className="newsletter-btn">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} E-Cell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
