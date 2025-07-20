import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Header.css'
import { FaBars, FaTimes } from 'react-icons/fa'

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = () => {
    // Clear local storage or cookies
    localStorage.removeItem('token')
    // Update authentication state
    setIsAuthenticated(false)
    // Redirect to home page
    navigate('/')
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="E-Cell Logo" />
          <span className="logo-text">E-Cell</span>
        </Link>

        <nav className="nav-menu">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/events" 
            className={({ isActive }) => 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Events
          </NavLink>
          <NavLink 
            to="/team" 
            className={({ isActive }) => 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Team
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <NavLink 
          to="/" 
          className="mobile-nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className="mobile-nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          About
        </NavLink>
        <NavLink 
          to="/events" 
          className="mobile-nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Events
        </NavLink>
        <NavLink 
          to="/team" 
          className="mobile-nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Team
        </NavLink>
        <NavLink 
          to="/contact" 
          className="mobile-nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact
        </NavLink>

        <div className="mobile-auth-buttons">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button 
                className="btn" 
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
