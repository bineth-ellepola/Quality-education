import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "../src/Component/UserManagement/LoginReg/AuthPage";
import StudentDashboard from "../src/Component/UserManagement/Dashborad/StudentDashboard/StudentDashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Login / Register Page */}
        <Route path="/" element={<AuthPage />} />

        {/* Student Dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;