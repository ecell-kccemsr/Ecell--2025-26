import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
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
      // For demo purposes, we'll simulate a successful registration after a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store token in localStorage
      localStorage.setItem('token', 'sample-token')
      
      // Update authentication state
      setIsAuthenticated(true)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Registration failed. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = (provider) => {
    // In a real application, this would redirect to the OAuth provider
    alert(`Register with ${provider} will be implemented in the future`)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src="/logo.png" alt="E-Cell Logo" />
        </div>
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Join our community of entrepreneurs</p>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>
          
          <div className="form-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                className="checkbox-input"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label className="checkbox-label" htmlFor="agreeTerms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <div className="error-message">{errors.agreeTerms}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-divider">or</div>
        
        <div className="social-auth-btns">
          <button 
            className="social-auth-btn" 
            onClick={() => handleSocialLogin('Google')}
          >
            <FaGoogle />
          </button>
          <button 
            className="social-auth-btn" 
            onClick={() => handleSocialLogin('Facebook')}
          >
            <FaFacebook />
          </button>
        </div>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
