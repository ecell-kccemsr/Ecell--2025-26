import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroSequence from "./components/IntroSequence";
import LandingPage from "./components/LandingPage";
import EventsPage from "./components/EventsPage";
import ContactPage from "./components/ContactPage";
import LoginPage from "./components/LoginPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import EmailVerificationPage from "./components/EmailVerificationPage";
import MentorPage from "./pages/MentorPage";
import ProjectsPage from "./pages/ProjectsPage";
// Team Pages
import LeadTeam from "./pages/teams/LeadTeam";
import WebDevTeam from "./pages/teams/WebDevTeam";
import GameDevTeam from "./pages/teams/GameDevTeam";
import IoTTeam from "./pages/teams/IoTTeam";
import EventsTeam from "./pages/teams/EventsTeam";
import CoordinationTeam from "./pages/teams/CoordinationTeam";
import BloggingTeam from "./pages/teams/BloggingTeam";
import SocialTeam from "./pages/teams/SocialTeam";
import PRFinanceTeam from "./pages/teams/PRFinanceTeam";

import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/intro" element={<IntroSequence />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/projects" element={<ProjectsPage />} />

          {/* Team Routes */}
          <Route path="/teams/lead" element={<LeadTeam />} />
          <Route path="/teams/web-development" element={<WebDevTeam />} />
          <Route path="/teams/game-development" element={<GameDevTeam />} />
          <Route path="/teams/iot" element={<IoTTeam />} />
          <Route path="/teams/events" element={<EventsTeam />} />
          <Route path="/teams/coordination" element={<CoordinationTeam />} />
          <Route path="/teams/blogging" element={<BloggingTeam />} />
          <Route path="/teams/social-media" element={<SocialTeam />} />
          <Route path="/teams/pr-finance" element={<PRFinanceTeam />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
