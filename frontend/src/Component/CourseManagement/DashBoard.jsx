import React, { useState, useMemo, useEffect } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, Users, BarChart3, Plus, Search, 
  GraduationCap, LogOut, Settings, Bell, 
  ChevronRight, X, Layers, Monitor, Globe, Filter,
  CheckCircle2, Clock, AlertCircle, Edit2, Trash2
} from 'lucide-react';
import { useAppContext } from './AppProvider';
import axios from 'axios';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const token = localStorage.getItem('token'); // JWT token

  const [subjects, setSubjects] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // --- Fetch subjects from backend ---
  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // --- FILTER LOGIC ---
  const filteredSubjects = useMemo(() => {
    return subjects.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === 'All' || sub.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [subjects, searchQuery, filterCategory]);

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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
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
            <TabButton label="Active Subjects" active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} count={filteredSubjects.length} />
            <TabButton label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} count={0} />
            <TabButton label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </div>

          {/* DYNAMIC CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredSubjects.map(sub => {
    const isOwner = sub.createdBy?._id === user._id;

    return (
      <div
        key={sub._id}
        className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all group"
      >
        {/* 3-Dots Menu */}
        {isOwner && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSubjects(prev =>
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

              {/* Dropdown menu */}
              {sub.showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Icon / Thumbnail */}
        <div className={`w-12 h-12 rounded-lg ${sub.bg || 'bg-gray-50'} flex items-center justify-center mb-4 transition-colors`}>
          <Globe size={24} className={sub.color || 'text-gray-400'} />
        </div>

        {/* Subject Name */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{sub.name}</h3>

        {/* Created By */}
        <p className="text-xs text-gray-400 mb-2">Created by: {sub.createdBy?.name || 'Unknown'}</p>

        {/* Category / Students */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>{sub.category || sub.categoryType}</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full" />
          <span>{sub.students || 0} Students</span>
        </div>

        {/* Last Update */}
        <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
  <Clock size={12} /> {sub.updatedAt ? dayjs(sub.updatedAt).fromNow() : 'Just now'}
</div>
      </div>
    );
  })}

  {filteredSubjects.length === 0 && (
    <div className="col-span-full py-20 text-center">
      <p className="text-gray-400 text-sm">No subjects found matching your criteria.</p>
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