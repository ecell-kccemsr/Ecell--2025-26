import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./EventsPage.css";

const EventsPage = () => {
  return (
    <>
      <Header />
      <div className="events-page-container">
        <div className="events-page-content">
          <div className="work-under-progress">
            <div className="progress-icon">🚀</div>
            <h1>Work Under Progress</h1>
            <p className="subtitle">Events Page Coming Soon</p>
            <p className="description">
              We're building an amazing events experience for you. Our team is
              working hard to bring you the best events management platform.
            </p>
            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">📅</span>
                <span>Event Calendar</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎟️</span>
                <span>Event Registration</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎊</span>
                <span>Event Details</span>
              </div>
            </div>
            <Link to="/" className="back-button">
              ← Go Back Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
