import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
      // For demo purposes, we'll simulate a successful login after a delay
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
        general: 'Invalid credentials. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = (provider) => {
    // In a real application, this would redirect to the OAuth provider
    alert(`Login with ${provider} will be implemented in the future`)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src="/logo.png" alt="E-Cell Logo" />
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          
          <div className="remember-forgot">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="checkbox-input"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label className="checkbox-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
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
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
