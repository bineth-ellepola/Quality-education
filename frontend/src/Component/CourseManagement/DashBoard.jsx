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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, Users, BarChart3, Plus, Search, 
  GraduationCap, LogOut, Settings, Bell, 
  ChevronRight, X, Layers, Monitor, Clock, Filter
} from 'lucide-react';
import { useAppContext } from './AppProvider';
import axios from 'axios';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const token = localStorage.getItem('token'); // JWT token

  const [subjects, setSubjects] = useState([]);
  const [subjectsWithImages, setSubjectsWithImages] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const bgImages = [img1, img2, img3, img4, img5, img6];

  // --- Fetch subjects from backend ---
  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedSubjects = res.data.subjects || [];

      // Assign a random image once per subject
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

  // --- FILTER LOGIC ---
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

  const handleLogout = () => {
    localStorage.clear();
    if (setUser) setUser(null);
    navigate('/');
  };

  const handleCreateSubject = () => navigate('/subject');

  const handleEdit = (sub) => navigate(`/subject/${sub._id}`);

  const handleDelete = async (id) => {
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

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] text-[#1A1A1A] font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
            <GraduationCap className="text-white w-5 h-5" />
          </div> */}
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

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="h-16 bg-white/50 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="text-gray-400 hover:text-gray-900 transition-colors relative p-2"
            >
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Instructor'}&background=ebebeb&color=1a1a1a`} alt="user" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* WELCOME SECTION */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Welcome back, {user?.name || 'Instructor'}
              </h1>
              <p className="text-gray-500 text-sm mt-1 font-normal">
                Everything looks good. You have <span className="text-blue-600 font-medium">{subjects.length} active subjects</span>.
              </p>
            </div>
            <button 
              onClick={ handleCreateSubject }
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={16} /> Create Subject
            </button>
          </div>

          {/* ADVANCED FILTER BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-gray-200 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 border border-transparent">
                <Filter size={14} />
                <select 
                  className="bg-transparent outline-none cursor-pointer"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>
            </div>
          </div>

          {/* TAB SYSTEM */}
          <div className="flex gap-8 border-b border-gray-100 mb-8">
            <TabButton label="Active Subjects" active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} count={filteredSubjectsWithImages.length} />
            <TabButton label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} count={filteredCourses.length} />
            <TabButton label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </div>
          

          {/* DYNAMIC CONTENT */}
         {/* DYNAMIC CONTENT */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
  {/* 1. SUBJECTS TAB - Only show if activeTab is 'subjects' */}
  {activeTab === 'subjects' && (
    <>
      {filteredSubjectsWithImages.map(sub => {
        const isOwner = sub.createdBy?._id === user._id;
        return (
          <div
            key={sub._id}
            className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all group overflow-hidden"
          >
            {/* Top Image Banner */}
            <div
              className="h-40 w-full object-cover"
              style={{
                backgroundImage: `url(${sub.randomImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Content */}
            <div className="p-6">
              {/* 3-Dots Menu */}
              {isOwner && (
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubjectsWithImages(prev =>
                          prev.map(s =>
                            s._id === sub._id
                              ? { ...s, showMenu: !s.showMenu }
                              : { ...s, showMenu: false }
                          )
                        );
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>

                    {sub.showMenu && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <button onClick={() => handleEdit(sub)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Update</button>
                        <button onClick={() => handleDelete(sub._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h3 className="font-semibold text-gray-900 text-lg mb-1">{sub.name}</h3>
              <p className="text-xs text-gray-400 mb-2">Created by: {sub.createdBy?.name || 'Unknown'}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{sub.category || sub.categoryType}</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <span>{sub.students || 0} Students</span>
              </div>

              <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Clock size={12} /> {sub.updatedAt ? dayjs(sub.updatedAt).fromNow() : 'Just now'}
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty State for Subjects */}
      {filteredSubjectsWithImages.length === 0 && (
        <div className="col-span-full py-20 text-center">
          <p className="text-gray-400 text-sm">No subjects found matching your criteria.</p>
        </div>
      )}
    </>
  )}

 {activeTab === 'courses' && filteredCourses.map((course) => (
  <div 
    key={course._id} 
    className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
  >
    {/* IMAGE HEADER */}
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={course.coverImage} 
        alt={course.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      {/* Floating Price Badge */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
        <span className="text-sm font-bold text-gray-900">
          {course.price} {course.currency}
        </span>
      </div>
      {/* Status Badge */}
      <div className="absolute bottom-4 left-4">
        <span
  className={`px-2 py-1 text-xs rounded-full font-medium ${
    course.status === "published"
      ? "bg-green-100 text-green-700"
      : course.status === "draft"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-200 text-gray-600"
  }`}
>
  {course.status === "published"
    ? "Live"
    : course.status === "draft"
    ? "Draft"
    : "Unpublished"}
</span>
      </div>
    </div>

    {/* BODY CONTENT */}
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          {course.subject?.name}
        </span>
        <span className="text-[10px] text-gray-400 font-mono">#{course.courseId}</span>
      </div>

      <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
        {course.title}
      </h3>
      
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
        {course.description}
      </p>

      {/* ATTRIBUTE GRID */}
      <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-50 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-tight">Instructor</span>
          <span className="text-xs font-medium text-gray-700 truncate">{course.instructor?.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-tight">Level</span>
          <span className="text-xs font-medium text-gray-700">{course.level}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-tight">Duration</span>
          <span className="text-xs font-medium text-gray-700">{course.duration} hrs</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-tight">Rating</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-800">{course.averageRating}</span>
            <span className="text-[10px] text-gray-400 font-normal">({course.totalRatings})</span>
          </div>
        </div>
      </div>
    </div>

    {/* FOOTER INFO */}
    <div className="px-5 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[11px] font-medium text-gray-600">
          {course.enrolledStudentsCount} / {course.enrollmentLimit} Enrolled
        </span>
      </div>
      <span className="text-[10px] text-gray-400">
        {dayjs(course.createdAt).fromNow()}
      </span>
    </div>
  </div>
))}

  {/* 3. ANALYTICS TAB */}
  {activeTab === 'analytics' && (
    <div className="col-span-full py-20 text-center">
      <p className="text-gray-500">Analytics Dashboard Coming Soon...</p>
    </div>
  )}

</div>
        </div>
      </main>
    </div>
  );
};

// --- MINI SUB-COMPONENTS ---
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${
    active ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm shadow-blue-500/10' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
  }`}>
    <span className={`${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </div>
);

const TabButton = ({ label, active, onClick, count }) => (
  <button onClick={onClick} className={`pb-4 text-sm font-medium transition-all relative ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
    <div className="flex items-center gap-2">
      {label}
      {count !== undefined && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>{count}</span>}
    </div>
    {active && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
  </button>
);

export default InstructorDashboard;