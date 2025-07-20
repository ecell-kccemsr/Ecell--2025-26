import { Link } from 'react-router-dom'
import './HeroSection.css'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Empowering Future Entrepreneurs</h1>
            <p className="hero-subtitle">
              Join E-Cell to explore the world of entrepreneurship, innovation, and start your journey to becoming a successful entrepreneur.
            </p>
            <div className="hero-buttons">
              <Link to="/events" className="cta-btn primary">Explore Events</Link>
              <Link to="/register" className="cta-btn secondary">Join Us</Link>
            </div>
          </div>
          
          <div className="hero-image">
            <img 
              src="/images/hero-image.jpg" 
              alt="Students working on startup ideas" 
              className="hero-img"
            />
            <div className="floating-elements">
              <div className="floating-element element-1">
                <img 
                  src="/images/element-1.jpg" 
                  alt="Entrepreneurship workshop" 
                />
              </div>
              <div className="floating-element element-2">
                <img 
                  src="/images/element-2.jpg" 
                  alt="Startup pitch" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
