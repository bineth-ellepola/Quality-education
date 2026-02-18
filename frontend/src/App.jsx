import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewAssessments from "./Component/AssessmentManagement/ViewAssessments";
import CreateAssessment from "./Component/AssessmentManagement/CreateAssessment";
import UpdateAssessment from "./Component/AssessmentManagement/UpdateAssessment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ViewAssessments />} />
        <Route path="/view-assessments" element={<ViewAssessments />} />
        <Route path="/add-assessment" element={<CreateAssessment />} />
        <Route path="/edit-assessment/:id" element={<UpdateAssessment />} />
      </Routes>
    </Router>
  );
}

export default App;
