import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, Users, BarChart3, Plus, Search, 
  GraduationCap, LogOut, Settings, Bell, 
  ChevronRight, X, Layers, Monitor, Globe, Mail
} from 'lucide-react';
import { useAppContext } from './AppProvider'; // Importing your context

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext(); // Get user and setter from context
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  
  // Real-world state management for subjects
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Computer Science', category: 'Engineering', students: 120, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, name: 'Digital Arts', category: 'Design', students: 85, color: 'text-orange-600', bg: 'bg-orange-50' }
  ]);

  const [newSubject, setNewSubject] = useState({ name: '', category: 'Engineering' });

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setUser) setUser(null);
    navigate('/');
  };

  // --- SUBJECT CREATION LOGIC ---
  const handleCreateSubject = (e) => {
    e.preventDefault();
    if(!newSubject.name) return;
    
    const createdSubject = {
      id: Date.now(),
      name: newSubject.name,
      category: newSubject.category,
      students: 0,
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    };

    setSubjects([...subjects, createdSubject]);
    setIsModalOpen(false);
    setNewSubject({ name: '', category: 'Engineering' });
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] text-[#1A1A1A] font-sans selection:bg-blue-100">
      
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

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1">
        <header className="h-16 bg-white/50 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Instructor Dashboard</span>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-gray-900 transition-colors relative">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Instructor'}&background=ebebeb&color=1a1a1a`} alt="user" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* WELCOME SECTION WITH USER NAME */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Welcome back, {user?.name || 'Instructor'}
              </h1>
              <p className="text-gray-500 text-sm mt-1 font-normal">
                Here is what's happening with your subjects today.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={16} /> Create Subject
            </button>
          </div>

          {/* TAB SYSTEM */}
          <div className="flex gap-8 border-b border-gray-100 mb-8">
            <TabButton label="Active Subjects" active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} count={subjects.length} />
            <TabButton label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} count={0} />
            <TabButton label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </div>

          {/* DYNAMIC CONTENT */}
          {activeTab === 'subjects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {subjects.map(sub => (
                <div key={sub.id} className="p-6 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all group relative">
                   <div className={`w-10 h-10 rounded-lg ${sub.bg} flex items-center justify-center mb-4`}>
                      <Globe size={20} className={sub.color} />
                   </div>
                   <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                   <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{sub.category}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-xs text-gray-400">{sub.students} Students</span>
                   </div>
                   <button className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors">
                    <ChevronRight size={18} />
                   </button>
                </div>
               ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor size={24} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium">No records found</h3>
              <p className="text-gray-400 text-sm mt-1">Select the Subjects tab to manage your curriculum.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- CREATE SUBJECT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px]" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98, y: 10 }} 
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">New Subject</h2>
                  <p className="text-xs text-gray-500">Add a new educational category to your portal.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateSubject} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subject Name</label>
                  <input 
                    autoFocus
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    type="text" placeholder="e.g. Machine Learning" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Group</label>
                  <select 
                    value={newSubject.category}
                    onChange={(e) => setNewSubject({...newSubject, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm font-medium appearance-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Business">Business</option>
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
    active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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