import { Link } from 'react-router-dom'
import './EventsSection.css'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

const EventsSection = () => {
  // Sample events data - in a real app this would come from an API
  const events = [
    {
      id: 1,
      title: 'Startup Summit 2023',
      date: 'Oct 15, 2023',
      time: '10:00 AM - 5:00 PM',
      location: 'Main Auditorium',
      description: 'A day-long summit featuring successful entrepreneurs and investors sharing their insights and experiences.',
      image: '/images/event-1.jpg'
    },
    {
      id: 2,
      title: 'Ideathon Challenge',
      date: 'Nov 5, 2023',
      time: '9:00 AM - 9:00 PM',
      location: 'Innovation Hub',
      description: 'A 12-hour ideathon where participants brainstorm and pitch innovative solutions to real-world problems.',
      image: '/images/event-2.jpg'
    },
    {
      id: 3,
      title: 'Entrepreneurship Workshop',
      date: 'Nov 20, 2023',
      time: '2:00 PM - 5:00 PM',
      location: 'Seminar Hall',
      description: 'An interactive workshop on business model canvas and startup validation techniques.',
      image: '/images/event-3.jpg'
    }
  ]

  return (
    <section className="events-section">
      <div className="container">
        <h2 className="section-title">Upcoming Events</h2>
        <p className="section-subtitle">
          Join our events to learn, network, and grow your entrepreneurial skills
          through interactive sessions and competitions.
        </p>
        
        <div className="events-grid">
          {events.map(event => (
            <div className="event-card" key={event.id}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-date">{event.date}</div>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-info">
                  <div className="event-info-item">
                    <FaClock />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-info-item">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-text">{event.description}</p>
                <Link to={`/events/${event.id}`} className="btn btn-secondary">Register Now</Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="see-all-btn-container">
          <Link to="/events" className="btn">View All Events</Link>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
