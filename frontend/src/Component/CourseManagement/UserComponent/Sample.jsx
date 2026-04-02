import React, { useState, useMemo, useEffect } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/img1.svg';
import img2 from '../../assets/img2.svg';
import img3 from '../../assets/img3.svg';
import img4 from '../../assets/img4.svg';
import img5 from '../../assets/img5.svg';
import img6 from '../../assets/img6.svg';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, Users, BarChart3, Plus, Search, 
  LogOut, Settings, Bell, ChevronRight, Layers, Clock, Filter
} from 'lucide-react';
import { useAppContext } from './AppProvider';
import axios from 'axios';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();
  const token = localStorage.getItem('token');

  const [subjects, setSubjects] = useState([]);
  const [subjectsWithImages, setSubjectsWithImages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const bgImages = [img1, img2, img3, img4, img5, img6];

  // ---------------- FETCH SUBJECTS ----------------
  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedSubjects = res.data.subjects || [];
      const subjectsWithRandomImages = fetchedSubjects.map(sub => ({
        ...sub,
        randomImage: bgImages[Math.floor(Math.random() * bgImages.length)]
      }));
      setSubjects(fetchedSubjects);
      setSubjectsWithImages(subjectsWithRandomImages);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/courses?limit=1000', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  // ---------------- FILTERS ----------------
  const filteredSubjectsWithImages = useMemo(() => {
    return subjectsWithImages.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === 'All' || sub.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [subjectsWithImages, searchQuery, filterCategory]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // ---------------- ACTIONS ----------------
  const handleLogout = () => {
    localStorage.clear();
    if (setUser) setUser(null);
    navigate('/');
  };

  const handleCreateSubject = () => navigate('/subject');
  const handleCreateCourse = () => navigate('/course');

  const handleEditSubject = (sub) => navigate(`/subject/${sub._id}`);
  const handleEditCourse = (course) => navigate(`/course/${course._id}`);

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to archive this subject?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubjects();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to archive this course?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] text-[#1A1A1A] font-sans selection:bg-blue-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <span className="font-semibold tracking-tight text-gray-900">Studly CMS</span>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          <NavItem icon={<LayoutGrid size={18}/>} label="Dashboard" active />
          <NavItem icon={<Layers size={18}/>} label="Subjects" />
          <NavItem icon={<BookOpen size={18}/>} label="Curriculum" />
          <NavItem icon={<Users size={18}/>} label="Students" />
          <div className="my-4 border-t border-gray-50 mx-3" />
          <NavItem icon={<BarChart3 size={18}/>} label="Reports" />
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </nav>
        <div className="p-4 border-t border-gray-50">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="h-16 bg-white/50 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-5">
            <Bell size={20} />
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Instructor'}`} alt="user" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">

          {/* WELCOME */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Welcome back, {user?.name || 'Instructor'}
              </h1>
              <p className="text-gray-500 text-sm mt-1 font-normal">
                {activeTab === 'subjects' 
                  ? <>You have <span className="text-blue-600 font-medium">{subjects.length} active subjects</span>.</>
                  : <>You have <span className="text-blue-600 font-medium">{courses.length} courses</span>.</>
                }
              </p>
            </div>

            {activeTab === 'subjects' 
              ? <button onClick={handleCreateSubject} className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2"><Plus size={16} /> Create Subject</button>
              : <button onClick={handleCreateCourse} className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2"><Plus size={16} /> Create Course</button>
            }
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
            <div className="relative w-full max-w-sm flex items-center gap-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="text"
                placeholder={`Search ${activeTab === 'subjects' ? 'subjects' : 'courses'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-gray-200 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 border border-transparent">
              <Filter size={14} />
              <select className="bg-transparent outline-none cursor-pointer" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-8 border-b border-gray-100 mb-6">
            <TabButton label="Active Subjects" active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} count={filteredSubjectsWithImages.length} />
            <TabButton label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} count={filteredCourses.length} />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* SUBJECTS */}
            {activeTab === 'subjects' && filteredSubjectsWithImages.map(sub => {
              const isOwner = sub.createdBy?._id === user?._id;
              return (
                <div key={sub._id} className="relative bg-white border rounded-2xl shadow-sm hover:shadow-lg overflow-hidden">
                  <div className="h-40 w-full" style={{ backgroundImage: `url(${sub.randomImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="p-6">
                    {isOwner && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => handleEditSubject(sub)} className="text-sm text-gray-500 hover:text-black">Edit</button>
                        <button onClick={() => handleDeleteSubject(sub._id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{sub.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">Created by: {sub.createdBy?.name || 'Unknown'}</p>
                    <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {sub.updatedAt ? dayjs(sub.updatedAt).fromNow() : 'Just now'}</div>
                  </div>
                </div>
              );
            })}

            {/* COURSES */}
            {activeTab === 'courses' && filteredCourses.map(course => (
              <div key={course._id} className="bg-white border rounded-2xl shadow-sm hover:shadow-lg overflow-hidden">
                <img src={course.coverImage} alt={course.title} className="h-40 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">Course ID: {course.courseId}</p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <div>Subject: {course.subject?.name}</div>
                    <div>Instructor: {course.instructor?.name}</div>
                    <div>Level: {course.level}</div>
                    <div>Duration: {course.duration} hours</div>
                    <div>Price: {course.price} {course.currency}</div>
                    <div>Enrollment: {course.enrolledStudentsCount}/{course.enrollmentLimit}</div>
                    <div>Rating: {course.averageRating} ({course.totalRatings})</div>
                    <div>Status: {course.isPublished ? 'Published' : 'Draft'}</div>
                  </div>
                  <div className="text-[11px] text-gray-400">Created {dayjs(course.createdAt).fromNow()}</div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const TabButton = ({ label, active, onClick, count }) => (
  <button onClick={onClick} className={`pb-4 text-sm font-medium relative ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
    <div className="flex items-center gap-2">
      {label}
      {count !== undefined && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>{count}</span>}
    </div>
    {active && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
  </button>
);

export default InstructorDashboard;