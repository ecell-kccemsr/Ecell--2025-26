import { useState } from 'react'
import './Contact.css'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message should be at least 20 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      // Show success message
      setIsSubmitted(true)
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Failed to send message. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">Get in touch with us for any inquiries or collaborations</p>
        </div>
      </div>
      
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2 className="section-title">Get In Touch</h2>
            <p className="contact-text">
              Have questions about E-Cell or interested in collaborating with us? 
              We'd love to hear from you! Fill out the form or reach out to us directly.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="contact-item-title">Our Location</h3>
                  <p className="contact-item-text">
                    E-Cell Office, College Campus<br />
                    City, State, Pincode
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div>
                  <h3 className="contact-item-title">Call Us</h3>
                  <p className="contact-item-text">
                    +91 9876543210<br />
                    +91 9876543211
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="contact-item-title">Email Us</h3>
                  <p className="contact-item-text">
                    ecell@example.com<br />
                    info@ecell.example.com
                  </p>
                </div>
              </div>
            </div>
            
            <div className="contact-social">
              <h3 className="contact-social-title">Connect With Us</h3>
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
          </div>
          
          <div className="contact-form-container">
            {isSubmitted ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h2 className="success-title">Message Sent!</h2>
                <p className="success-text">
                  Thank you for reaching out to us. We have received your message 
                  and will get back to you shortly.
                </p>
                <button 
                  className="btn"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Send Us A Message</h2>
                
                {errors.general && (
                  <div className="error-message">{errors.general}</div>
                )}
                
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-input"
                    placeholder="Enter message subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  {errors.subject && (
                    <div className="error-message">{errors.subject}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder="Write your message here"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && (
                    <div className="error-message">{errors.message}</div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="btn contact-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30703867.071679905!2d64.4350946125!3d20.011408200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1685587385559!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="E-Cell Location"
        ></iframe>
      </div>
    </div>
  )
}

export default Contact
