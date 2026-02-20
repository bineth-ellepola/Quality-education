import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader2, CheckCircle2, AlertCircle, X, Edit2, Trash2, 
  MoreVertical, Search, Plus, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectCreation = () => {
  const [form, setForm] = useState({
    name: '', code: '', description: '', level: 'all', 
    categoryType: 'skill-based', isFeatured: false, sortOrder: 0
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      addToast('error', 'Database connection failed');
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  // Submit new or edited subject
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/subjects/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast('success', 'Changes saved successfully');
      } else {
        await axios.post('http://localhost:5001/api/subjects', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast('success', 'New subject published');
      }
      resetForm();
      fetchSubjects();
      setIsDrawerOpen(false);
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Action could not be completed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', code: '', description: '', level: 'all', categoryType: 'skill-based', isFeatured: false, sortOrder: 0 });
    setEditingId(null);
  };

  const handleEdit = (sub) => {
    setForm(sub);
    setEditingId(sub._id);
    setIsDrawerOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('success', 'Subject removed');
      fetchSubjects();
    } catch (err) { addToast('error', 'Delete failed'); }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100">
      
      {/* --- Toast System --- */}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div 
              key={t.id}
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
              className="bg-black text-white px-6 py-3 border-l-4 border-emerald-500 shadow-xl flex items-center gap-3 min-w-[300px]"
            >
              {t.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-rose-500" />}
              <span className="text-xs font-bold uppercase tracking-widest">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-zinc-100 pb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Management System</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-black">Catalog Subjects</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" placeholder="Filter subjects..." 
                className="pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm w-72 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { resetForm(); setIsDrawerOpen(true); }}
              className="flex items-center gap-2 bg-black hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-zinc-200"
            >
              <Plus size={20} /> Add Subject
            </button>
          </div>
        </div>

        {/* --- Subject Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(sub => {
            const isOwner = sub.createdBy?._id === currentUserId;
            return (
            <div 
              key={sub._id} 
              className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:border-black transition-all hover:shadow-2xl hover:shadow-zinc-100 flex flex-col relative"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-md tracking-tighter uppercase">
                  {sub.code || 'NO-CODE'}
                </span>
                
                {isOwner && (
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === sub._id ? null : sub._id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-black transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    <AnimatePresence>
                      {activeMenuId === sub._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-10 w-44 bg-black border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            <button onClick={() => handleEdit(sub)} className="w-full px-4 py-3 text-left text-xs text-white hover:bg-emerald-500 hover:text-black flex items-center gap-3 transition-colors">
                              <Edit2 size={14} /> Edit Subject
                            </button>
                            <button onClick={() => handleDelete(sub._id)} className="w-full px-4 py-3 text-left text-xs text-rose-400 hover:bg-rose-500 hover:text-white flex items-center gap-3 transition-colors border-t border-zinc-800">
                              <Trash2 size={14} /> Delete Entry
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-black mb-1 group-hover:text-emerald-600 transition-colors">
                {sub.name}
              </h3>
              <p className="text-[10px] text-zinc-400 mb-2">Created by: {sub.createdBy?.name || 'Unknown'}</p>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-6 h-10">
                {sub.description || 'No description available for this subject.'}
              </p>

              <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    sub.level === 'advanced' ? 'bg-black text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>{sub.level}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-0.5 rounded">{sub.categoryType}</span>
                </div>
                {sub.isFeatured && <Zap size={14} className="text-emerald-500 fill-emerald-500" />}
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* --- Drawer for Add/Edit --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[120] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h2 className="text-2xl font-bold tracking-tight">{editingId ? 'Modify Subject' : 'New Subject'}</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-zinc-200">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-8">
                {/* Subject Name */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase mb-2 block tracking-widest">Full Subject Name</label>
                  <input 
                    required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-4 focus:border-black focus:ring-4 focus:ring-zinc-50 outline-none transition-all text-lg font-medium"
                    placeholder="e.g. Advanced Thermodynamics"
                  />
                </div>

                {/* Code & Sort */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase mb-2 block tracking-widest">Reference Code</label>
                    <input 
                      type="text" value={form.code} onChange={(e) => setForm({...form, code: e.target.value})}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 focus:border-black outline-none transition-all font-mono"
                      placeholder="SUB-001"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase mb-2 block tracking-widest">Sort Weight</label>
                    <input 
                      type="number" value={form.sortOrder} onChange={(e) => setForm({...form, sortOrder: e.target.value})}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase mb-4 block tracking-widest">Difficulty Tier</label>
                  <div className="flex gap-2">
                    {['beginner', 'intermediate', 'advanced', 'all'].map(lvl => (
                      <button 
                        key={lvl} type="button" onClick={() => setForm({...form, level: lvl})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          form.level === lvl ? 'bg-black border-black text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400'
                        }`}
                      >{lvl}</button>
                    ))}
                  </div>
                </div>

                {/* Category Type */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase mb-4 block tracking-widest">Category Type</label>
                  <div className="flex gap-2">
                    {['skill-based', 'academic', 'professional', 'other'].map(cat => (
                      <button 
                        key={cat} type="button" onClick={() => setForm({...form, categoryType: cat})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          form.categoryType === cat ? 'bg-black border-black text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400'
                        }`}
                      >{cat}</button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase mb-2 block tracking-widest">Extended Summary</label>
                  <textarea 
                    rows="5" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-sm focus:border-black outline-none resize-none transition-all"
                    placeholder="Detail the curriculum objectives..."
                  />
                </div>

                {/* Featured & Actions */}
                <div className="pt-8 border-t border-zinc-100 mt-12 flex flex-col gap-4">
                  <button 
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-100"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Save Changes' : 'Publish to Catalog')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 py-4 rounded-xl font-bold text-sm transition-all"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectCreation;