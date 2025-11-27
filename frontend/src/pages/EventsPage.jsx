import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./EventsPage.css";

const EventsPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const events = [
    {
      id: 1,
      title: "Singularity Hackathon",
      description: "An Intra-College Hackathon. Push your limits, collaborate, and create innovative solutions.",
      date: "Announced Soon",
      theme: "Interstellar",
      image: "/public/singularity_hack_logo.png",
      logo: "/public/singularity_hack_logo.png",
    },
  ];

  return (
    <>
      <Header />
      <div className="events-page-container">
        <div className="events-header">
          <h1 className="events-title">Events Coming Soon</h1>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onMouseEnter={() => setHoveredCard(event.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Matrix Animation Background (visible on hover) */}
              {hoveredCard === event.id && (
                <div className="matrix-container">
                  <div className="matrix-pattern">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="matrix-column"></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Background Image */}
              <div
                className="event-card-background"
                style={{
                  backgroundImage: `url('${event.image}')`,
                  opacity: hoveredCard === event.id ? 1 : 0.3,
                }}
              />

              {/* Card Border */}
              <div className="event-card-border" />

              {/* Logo (appears on hover) */}
              <div className={`event-logo ${hoveredCard === event.id ? "visible" : ""}`}>
                <div className="logo-icon">
                  <img src={event.logo} alt="Event Logo" />
                </div>
              </div>

              {/* Content */}
              <div className="event-content">
                <h2 className="event-title-card">{event.title}</h2>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <div className="meta-item">
                    <span className="meta-label">Date:</span>
                    <span className="meta-value">{event.date}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Theme:</span>
                    <span className="meta-value">{event.theme}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="events-footer">
          <Link to="/" className="back-button">
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
