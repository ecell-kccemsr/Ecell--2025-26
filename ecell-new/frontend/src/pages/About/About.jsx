import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Learn about our mission, vision, and the team behind E-Cell</p>
        </div>
      </div>
      
      <div className="container">
        <section className="about-section">
          <h2 className="section-title">Our Story</h2>
          <p className="section-text">
            E-Cell was founded in 2015 with a mission to foster innovation and entrepreneurial spirit among college students. 
            What started as a small group of passionate students has now grown into one of the most active entrepreneurship cells
            in the region, with a network of successful alumni and mentors.
          </p>
          <p className="section-text">
            Over the years, we have organized various events, workshops, and competitions that have helped students transform
            their innovative ideas into successful businesses. Our initiatives have been recognized at both national and 
            international levels.
          </p>
        </section>
        
        <section className="mission-vision-section">
          <div className="mission-vision-container">
            <div className="mission-box">
              <h3 className="box-title">Our Mission</h3>
              <p className="box-text">
                To create a vibrant entrepreneurial ecosystem that encourages innovation, provides necessary resources, 
                and nurtures young entrepreneurs to build sustainable businesses that address real-world problems.
              </p>
            </div>
            
            <div className="vision-box">
              <h3 className="box-title">Our Vision</h3>
              <p className="box-text">
                To be the leading entrepreneurship cell in the country, fostering a culture of innovation and entrepreneurship
                that empowers students to create meaningful impact through their ventures.
              </p>
            </div>
          </div>
        </section>
        
        <section className="values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-text">
                We encourage thinking outside the box and exploring new ideas that challenge the status quo.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Collaboration</h3>
              <p className="value-text">
                We believe in the power of teamwork and collective wisdom to solve complex problems.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3 className="value-title">Excellence</h3>
              <p className="value-text">
                We strive for excellence in everything we do, pushing boundaries and raising standards.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3 className="value-title">Growth</h3>
              <p className="value-text">
                We foster personal and professional growth, helping individuals reach their full potential.
              </p>
            </div>
          </div>
        </section>
        
        <section className="achievements-section">
          <h2 className="section-title">Our Achievements</h2>
          <div className="achievements-timeline">
            <div className="timeline-item">
              <div className="timeline-date">2022</div>
              <div className="timeline-content">
                <h3 className="timeline-title">National Recognition</h3>
                <p className="timeline-text">
                  Recognized as one of the top 10 entrepreneurship cells in the country by a leading industry body.
                </p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">2021</div>
              <div className="timeline-content">
                <h3 className="timeline-title">Successful Startups</h3>
                <p className="timeline-text">
                  Three startups incubated by E-Cell received seed funding totaling over $500,000.
                </p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">2019</div>
              <div className="timeline-content">
                <h3 className="timeline-title">International Collaboration</h3>
                <p className="timeline-text">
                  Established partnership with international universities for exchange programs focused on entrepreneurship.
                </p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">2017</div>
              <div className="timeline-content">
                <h3 className="timeline-title">First Major Event</h3>
                <p className="timeline-text">
                  Successfully organized our first national-level business plan competition with over 200 participants.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
