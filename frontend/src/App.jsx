 import { Routes, Route } from "react-router-dom";
 
import Login from "../src/Component/CourseManagement/LoginComponent/Signin";
import Dashboard from "../src/Component/CourseManagement/DashBoard";
import SubjectCreation from "./Component/CourseManagement/SubjectComponent/SubjectCreation";
import SubjectEdit from "./Component/CourseManagement/SubjectComponent/SubjectEdit";
import Course from './Component/CourseManagement/CourseCreation/Course'
import CourseDetails from "./Component/CourseManagement/CourseCreation/CourseDetails";
import CourseEdit from "./Component/CourseManagement/CourseCreation/CourseEdit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/subject" element={<SubjectCreation />} />
       <Route path="/subject/:id" element={<SubjectEdit />} />
       <Route path="/course" element={<Course />} />
       <Route path="/courseDetails/:id" element={<CourseDetails />} />
       <Route path="/course/:id" element={<CourseEdit />} />
    </Routes>
  );
}

export default App;
