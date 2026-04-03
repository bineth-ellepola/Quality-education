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
import AllCourses from "./Component/CourseManagement/FrontPages/LandingSection/AllCourses";
 import CourseDetailss from './Pages/CourseDe'
 import Help from "./Component/CourseManagement/FrontPages/Help";
 import University from "./Component/CourseManagement/FrontPages/LandingSection/University";
 import Business from "./Pages/Business";
 import DataScience from "./Pages/DataScience";
import BusinessPage from "./Pages/BusinessPage";
import SignUp from "./Component/CourseManagement/LoginComponent/SignUp";
import OTPVerification from "./Component/CourseManagement/LoginComponent/Otp";
import UserProfile from "./Component/CourseManagement/LoginComponent/UserProfile";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
       <Route path="/userprofile/:id" element={<UserProfile />} />
      
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
       <Route path="/allCourses" element={<AllCourses />} />
       <Route path="/courses/:id" element={<CourseDetailss />} />
       <Route path="/help" element={<Help />} />
       <Route path="/campus" element={<University />} />
       <Route path="/business" element={<Business />} />
       <Route path="/datScience" element={<DataScience />} />
       <Route path="/businessSection" element={<BusinessPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
    </Routes>
  );
}

export default App;
