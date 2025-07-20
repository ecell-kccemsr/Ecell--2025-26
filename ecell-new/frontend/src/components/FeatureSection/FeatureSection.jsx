import { Link } from 'react-router-dom'
import './FeatureSection.css'
import { FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa'

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <div className="container">
        <h2 className="section-title">What We Offer</h2>
        <p className="section-subtitle">
          E-Cell provides a platform for aspiring entrepreneurs to learn, innovate, and grow
          with our comprehensive programs and resources.
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaLightbulb />
            </div>
            <h3 className="feature-title">Workshops & Seminars</h3>
            <p className="feature-text">
              Regular workshops and seminars conducted by industry experts and successful entrepreneurs
              to provide insights into the entrepreneurial world.
            </p>
            <Link to="/events" className="btn btn-secondary">Learn More</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3 className="feature-title">Mentorship Programs</h3>
            <p className="feature-text">
              Connect with experienced mentors who guide you through your entrepreneurial journey
              and provide valuable feedback on your ideas.
            </p>
            <Link to="/mentorship" className="btn btn-secondary">Learn More</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket />
            </div>
            <h3 className="feature-title">Startup Incubation</h3>
            <p className="feature-text">
              Resources and support for early-stage startups, including workspace, funding opportunities,
              and access to a network of investors.
            </p>
            <Link to="/incubation" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
