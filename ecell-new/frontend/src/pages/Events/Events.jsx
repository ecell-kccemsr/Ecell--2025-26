import { useState } from 'react'
import './Events.css'

const Events = () => {
  const [filter, setFilter] = useState('all')
  
  // Sample events data - in a real app this would come from an API
  const events = [
    {
      id: 1,
      title: 'Startup Summit 2023',
      date: 'Oct 15, 2023',
      time: '10:00 AM - 5:00 PM',
      location: 'Main Auditorium',
      description: 'A day-long summit featuring successful entrepreneurs and investors sharing their insights and experiences.',
      image: '/images/event-1.jpg',
      category: 'conference'
    },
    {
      id: 2,
      title: 'Ideathon Challenge',
      date: 'Nov 5, 2023',
      time: '9:00 AM - 9:00 PM',
      location: 'Innovation Hub',
      description: 'A 12-hour ideathon where participants brainstorm and pitch innovative solutions to real-world problems.',
      image: '/images/event-2.jpg',
      category: 'competition'
    },
    {
      id: 3,
      title: 'Entrepreneurship Workshop',
      date: 'Nov 20, 2023',
      time: '2:00 PM - 5:00 PM',
      location: 'Seminar Hall',
      description: 'An interactive workshop on business model canvas and startup validation techniques.',
      image: '/images/event-3.jpg',
      category: 'workshop'
    },
    {
      id: 4,
      title: 'Investor Networking Event',
      date: 'Dec 8, 2023',
      time: '6:00 PM - 9:00 PM',
      location: 'Business Center',
      description: 'Connect with angel investors and venture capitalists to pitch your startup idea and secure funding.',
      image: '/images/event-4.jpg',
      category: 'networking'
    },
    {
      id: 5,
      title: 'Product Design Masterclass',
      date: 'Dec 15, 2023',
      time: '11:00 AM - 4:00 PM',
      location: 'Design Studio',
      description: 'Learn product design principles and methodologies from industry experts in this hands-on masterclass.',
      image: '/images/event-5.jpg',
      category: 'workshop'
    },
    {
      id: 6,
      title: 'Annual Business Plan Competition',
      date: 'Jan 20, 2024',
      time: 'All Day',
      location: 'Main Campus',
      description: 'Our flagship business plan competition with cash prizes and incubation opportunities for the winners.',
      image: '/images/event-6.jpg',
      category: 'competition'
    }
  ]
  
  // Filter events based on selected category
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter)

  return (
    <div className="events-page">
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Discover and participate in our entrepreneurship events and programs</p>
        </div>
      </div>
      
      <div className="container">
        <div className="events-filter">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button 
            className={`filter-btn ${filter === 'conference' ? 'active' : ''}`}
            onClick={() => setFilter('conference')}
          >
            Conferences
          </button>
          <button 
            className={`filter-btn ${filter === 'workshop' ? 'active' : ''}`}
            onClick={() => setFilter('workshop')}
          >
            Workshops
          </button>
          <button 
            className={`filter-btn ${filter === 'competition' ? 'active' : ''}`}
            onClick={() => setFilter('competition')}
          >
            Competitions
          </button>
          <button 
            className={`filter-btn ${filter === 'networking' ? 'active' : ''}`}
            onClick={() => setFilter('networking')}
          >
            Networking
          </button>
        </div>
        
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div className="event-card" key={event.id}>
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className="event-date">{event.date}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-info">
                    <div className="event-info-item">
                      <i className="fas fa-clock"></i>
                      <span>{event.time}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="event-text">{event.description}</p>
                  <button className="btn btn-secondary">Register Now</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">
              <p>No events found in this category. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Events
