import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "../src/Component/UserManagement/LoginReg/AuthPage";
import StudentDashboard from "../src/Component/UserManagement/Dashborad/StudentDashboard/StudentDashboard";
import InstructorDashboard from "../src/Component/UserManagement/Dashborad/InstructorDashboard/InstructorDashboard";
import AdminDashboard from "../src/Component/UserManagement/Dashborad/AdminDashboard/AdminDashboard";
function App() {
  return (
    <Router>
      <Routes>

        {/* Login / Register Page */}
        <Route path="/" element={<AuthPage />} />

        
        <Route path="/student-dashboard" element={<StudentDashboard />} />
       
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />  
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;