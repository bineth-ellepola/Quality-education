 import { Routes, Route } from "react-router-dom";
 
import Login from "../src/Component/CourseManagement/LoginComponent/Signin";
import Dashboard from "../src/Component/CourseManagement/DashBoard";
import SubjectCreation from "./Component/CourseManagement/SubjectComponent/SubjectCreation";
import SubjectEdit from "./Component/CourseManagement/SubjectComponent/SubjectEdit";
import Course from './Component/CourseManagement/CourseCreation/Course'
import CourseDetails from "./Component/CourseManagement/CourseCreation/CourseDetails";
import CourseEdit from "./Component/CourseManagement/CourseCreation/CourseEdit";
import CourseLeader from './Component/CourseManagement/CourseCreation/CourseLeader'
import Notice from './Component/CourseManagement/NoticeManagement/NoticePage'
import NoticeDetails from './Component/CourseManagement/NoticeManagement/Notice'
import AdminDashboard from './Component/CourseManagement/AdminDashboard'
import Home from './Pages/Home'
import CourseFetch from "./Component/CourseManagement/FrontPages/LandingSection/CourseFetch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
       <Route path="/subject" element={<SubjectCreation />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/instructor" element={<Dashboard />} />
       <Route path="/subject/:id" element={<SubjectEdit />} />
       <Route path="/course" element={<Course />} />
       <Route path="/notice" element={<Notice />} />
       <Route path="/courseDetails/:id" element={<CourseDetails />} />
       <Route path="/course/:id" element={<CourseEdit />} />
       <Route path="/instructors/:id" element={<CourseLeader />} />
       <Route path="/notices/:id" element={<NoticeDetails />} />
       <Route path="/courseFetch" element={<CourseFetch />} />
    </Routes>
  );
}

export default App;
