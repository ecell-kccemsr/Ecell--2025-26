import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Dashboard.css'
import { FaHome, FaCalendarAlt, FaUsers, FaBell, FaCog, FaSignOutAlt, FaChartBar, FaTasks, FaCheckCircle } from 'react-icons/fa'

const Dashboard = ({ isAuthenticated }) => {
  const [userName, setUserName] = useState('John Doe')
  const [userEmail, setUserEmail] = useState('john.doe@example.com')
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login')
    }
    
    // In a real app, fetch user data from API
    // For now, we'll use dummy data
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase()
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {getInitials(userName)}
            </div>
            <div>
              <div className="user-name">{userName}</div>
              <div className="user-email">{userEmail}</div>
            </div>
          </div>
          
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/dashboard" className="sidebar-menu-link active">
                <FaHome className="sidebar-icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/dashboard/events" className="sidebar-menu-link">
                <FaCalendarAlt className="sidebar-icon" />
                <span>My Events</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/dashboard/network" className="sidebar-menu-link">
                <FaUsers className="sidebar-icon" />
                <span>My Network</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/dashboard/notifications" className="sidebar-menu-link">
                <FaBell className="sidebar-icon" />
                <span>Notifications</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/dashboard/settings" className="sidebar-menu-link">
                <FaCog className="sidebar-icon" />
                <span>Settings</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/" className="sidebar-menu-link">
                <FaSignOutAlt className="sidebar-icon" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </aside>
        
        <main className="dashboard-content">
          <div className="dashboard-welcome">
            <h1 className="welcome-title">Welcome back, {userName.split(' ')[0]}!</h1>
            <p className="welcome-text">
              Here's an overview of your entrepreneurial journey with E-Cell.
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Events Attended</div>
              <div className="stat-value">12</div>
              <div className="stat-change positive">
                <FaChartBar /> +25% from last month
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title">Upcoming Events</div>
              <div className="stat-value">3</div>
              <div className="stat-change positive">
                <FaChartBar /> New event added
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title">Connections</div>
              <div className="stat-value">48</div>
              <div className="stat-change positive">
                <FaChartBar /> +5 this week
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title">Tasks Completed</div>
              <div className="stat-value">85%</div>
              <div className="stat-change positive">
                <FaChartBar /> +10% improvement
              </div>
            </div>
          </div>
          
          <div className="recent-activities">
            <div className="section-header">
              <h2 className="section-title">Recent Activities</h2>
              <Link to="/dashboard/activities" className="btn btn-secondary">View All</Link>
            </div>
            
            <ul className="activity-list">
              <li className="activity-item">
                <div className="activity-icon">
                  <FaCalendarAlt />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Registered for Startup Summit</div>
                  <div className="activity-time">2 days ago</div>
                </div>
              </li>
              
              <li className="activity-item">
                <div className="activity-icon">
                  <FaUsers />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Connected with 3 new mentors</div>
                  <div className="activity-time">1 week ago</div>
                </div>
              </li>
              
              <li className="activity-item">
                <div className="activity-icon">
                  <FaTasks />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Completed Business Model Canvas</div>
                  <div className="activity-time">2 weeks ago</div>
                </div>
              </li>
              
              <li className="activity-item">
                <div className="activity-icon">
                  <FaCheckCircle />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Submitted pitch deck for review</div>
                  <div className="activity-time">3 weeks ago</div>
                </div>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
