import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import ViewAssessments from "./Component/AssessmentManagement/ViewAssessments";
import CreateAssessment from "./Component/AssessmentManagement/CreateAssessment";
import UpdateAssessment from "./Component/AssessmentManagement/UpdateAssessment";
import "./App.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🎓</div>
        <div className="sidebar-brand-text">
          <h1>Quality Edu</h1>
          <span>Learning Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>

        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/view-assessments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">📝</span>
          <span>Assessments</span>
        </NavLink>

        <NavLink to="/add-assessment" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">➕</span>
          <span>New Assessment</span>
        </NavLink>

        <div className="sidebar-section-label">Manage</div>

        <div className="sidebar-link" style={{ opacity: 0.4, cursor: 'default' }}>
          <span className="sidebar-link-icon">📚</span>
          <span>Courses</span>
        </div>

        <div className="sidebar-link" style={{ opacity: 0.4, cursor: 'default' }}>
          <span className="sidebar-link-icon">👥</span>
          <span>Students</span>
        </div>

        <div className="sidebar-link" style={{ opacity: 0.4, cursor: 'default' }}>
          <span className="sidebar-link-icon">📖</span>
          <span>Content</span>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          <div className="sidebar-avatar">AD</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin User</span>
            <span className="sidebar-user-role">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="main-content">
      <div className="main-inner" key={location.pathname}>
        <Routes>
          <Route path="/" element={<ViewAssessments />} />
          <Route path="/view-assessments" element={<ViewAssessments />} />
          <Route path="/add-assessment" element={<CreateAssessment />} />
          <Route path="/edit-assessment/:id" element={<UpdateAssessment />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
