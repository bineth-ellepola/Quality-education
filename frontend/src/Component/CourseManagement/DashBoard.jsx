import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, Users, BarChart3, Plus, Search, 
  GraduationCap, LogOut, Settings, Bell, 
  ChevronRight, X, Layers, Monitor, Globe, Filter,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { useAppContext } from './AppProvider';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  
  // Real-world state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Computer Science', category: 'Engineering', students: 120, color: 'text-blue-600', bg: 'bg-blue-50', lastUpdate: '2h ago' },
    { id: 2, name: 'Digital Arts', category: 'Design', students: 85, color: 'text-orange-600', bg: 'bg-orange-50', lastUpdate: '1d ago' },
    { id: 3, name: 'Quantum Physics', category: 'Mathematics', students: 42, color: 'text-purple-600', bg: 'bg-purple-50', lastUpdate: '3h ago' }
  ]);

  const notifications = [
    { id: 1, title: 'New Student', message: 'Sarah Jenkins enrolled in Computer Science', time: '5m ago', type: 'info' },
    { id: 2, title: 'Course Review', message: 'You received a 5-star rating on Digital Arts', time: '1h ago', type: 'success' },
    { id: 3, title: 'System Update', message: 'Studly CMS v2.4 is now live.', time: '4h ago', type: 'alert' },
  ];

  // --- FILTER LOGIC ---
  const filteredSubjects = useMemo(() => {
    return subjects.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === 'All' || sub.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [subjects, searchQuery, filterCategory]);

  const [newSubject, setNewSubject] = useState({ name: '', category: 'Engineering' });

  const handleLogout = () => {
    localStorage.clear();
    if (setUser) setUser(null);
    navigate('/');
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if(!newSubject.name) return;
    const createdSubject = {
      id: Date.now(),
      name: newSubject.name,
      category: newSubject.category,
      students: 0,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      lastUpdate: 'Just now'
    };
    setSubjects([...subjects, createdSubject]);
    setIsModalOpen(false);
    setNewSubject({ name: '', category: 'Engineering' });
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
              onClick={() => setIsModalOpen(true)}
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
          {activeTab === 'subjects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredSubjects.map(sub => (
                <div key={sub.id} className="p-6 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group relative cursor-pointer">
                   <div className={`w-10 h-10 rounded-lg ${sub.bg} flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-600 group-hover:text-white`}>
                      <Globe size={20} className={sub.color === 'text-blue-600' ? 'group-hover:text-white' : sub.color} />
                   </div>
                   <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                   <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 font-medium">{sub.category}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-xs text-gray-400">{sub.students} Students</span>
                   </div>
                   <div className="mt-6 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                        <Clock size={12} /> {sub.lastUpdate}
                     </div>
                     <span className="p-1.5 bg-gray-50 rounded-md text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <ChevronRight size={14} />
                     </span>
                   </div>
                </div>
               ))}
               {filteredSubjects.length === 0 && (
                 <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 text-sm">No subjects found matching your criteria.</p>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Monitor size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">Coming Soon</h3>
              <p className="text-gray-400 text-sm mt-1">The {activeTab} feature is currently under development.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- NOTIFICATION PANEL --- */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNotifOpen(false)} className="fixed inset-0 bg-black/5 z-[40]" />
            <motion.div 
              initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-100 z-[50] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button onClick={() => setIsNotifOpen(false)} className="text-gray-400 hover:text-gray-900 p-1"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {notif.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500" /> : 
                         notif.type === 'alert' ? <AlertCircle size={16} className="text-orange-500" /> : 
                         <Clock size={16} className="text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-snug">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Mark all as read</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CREATE SUBJECT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px]" />
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">New Subject</h2>
                  <p className="text-xs text-gray-500">Categorize your teaching workspace.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateSubject} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subject Name</label>
                  <input 
                    autoFocus value={newSubject.name} onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    type="text" placeholder="e.g. Machine Learning" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Group</label>
                  <select 
                    value={newSubject.category} onChange={(e) => setNewSubject({...newSubject, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm font-medium"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md">Create Subject</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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