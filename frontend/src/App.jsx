import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AboutPage from "./pages/AboutPage";
import MentorPage from "./pages/MentorPage";
import ProjectsPage from "./pages/ProjectsPage";
import WallOfFame from "./pages/WallOfFame";
import CoreTeam from "./pages/CoreTeam";
import EventsPage from "./pages/EventsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Stairs from "./components/Stairs";

function AppContent() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/wall-of-fame" element={<WallOfFame />} />

        {/* Core Team Route */}
        <Route path="/team" element={<CoreTeam />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Stairs>
        <AppContent />
      </Stairs>
    </Router>
  );
}

export default App;
