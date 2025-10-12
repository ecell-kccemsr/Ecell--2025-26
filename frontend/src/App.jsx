import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import IntroSequence from "./components/IntroSequence";
import LandingPage from "./components/LandingPage";
import EventsPage from "./components/EventsPage";
import ContactPage from "./components/ContactPage";
import LoginPage from "./components/LoginPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import EmailVerificationPage from "./components/EmailVerificationPage";
import AboutPage from "./pages/AboutPage";
import MentorPage from "./pages/MentorPage";
import ProjectsPage from "./pages/ProjectsPage";
import WallOfFame from "./pages/WallOfFame";
import CoreTeam from "./pages/CoreTeam";

import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function AppContent() {
  const [showIntro, setShowIntro] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this is the first visit (intro not shown in this session)
    const introShown = sessionStorage.getItem("introShown");

    // Show intro only on root path and if not shown before
    if (location.pathname === "/" && !introShown) {
      setShowIntro(true);
      sessionStorage.setItem("introShown", "true");
    }
  }, [location.pathname]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="App">
      {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/wall-of-fame" element={<WallOfFame />} />

        {/* Core Team Route */}
        <Route path="/team" element={<CoreTeam />} />

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
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
