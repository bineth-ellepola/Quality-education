import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, Check, AlertCircle, Trash2, Globe, Command, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '', code: '', description: '', level: 'all', 
    categoryType: 'skill-based', isFeatured: false, sortOrder: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/subjects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data.subject);
      } catch (err) {
        setToast({ type: 'error', message: 'Failed to sync with server' });
      } finally {
        setFetching(false);
      }
    };
    fetchSubject();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5001/api/subjects/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ type: 'success', message: 'Subject updated successfully' });
      setTimeout(() => navigate('/instructor'), 1000);
    } catch (err) {
      setToast({ type: 'error', message: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-zinc-900" size={20} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans antialiased flex flex-col">
      
      {/* Universal Header */}
      <nav className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="hover:bg-zinc-100 p-1.5 rounded-md transition-colors">
            <ArrowLeft size={16} className="text-zinc-500" />
          </button>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <span className="text-zinc-400">Dashboard</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-zinc-400">Subjects</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-zinc-900">{form.name || 'Edit Subject'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-zinc-50 rounded border border-zinc-100 mr-2">
            <Command size={12} className="text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-400">S</span>
          </div>
          <button 
            onClick={handleSubmit} disabled={loading}
            className="h-8 px-4 bg-zinc-900 text-white text-[13px] font-medium rounded-md hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center py-12 px-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-[640px] space-y-12">
          
          {/* Section: Title & Metadata */}
          <div className="pb-8 border-b border-zinc-100">
            <h1 className="text-2xl font-semibold tracking-tight">General Settings</h1>
            <p className="text-zinc-500 text-[14px] mt-1">Update the core identity and reference data for this subject.</p>
          </div>

          <div className="space-y-8">
            {/* Field: Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <label className="text-[13px] font-medium pt-2">Subject Name</label>
              <div className="md:col-span-2">
                <input 
                  type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[14px] focus:border-zinc-900 focus:ring-[3px] focus:ring-zinc-900/5 transition-all outline-none"
                  placeholder="e.g. Advanced Calculus"
                />
                <p className="text-[12px] text-zinc-400 mt-2 font-normal">This name will be visible to all students in the catalog.</p>
              </div>
            </div>

            {/* Field: Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <label className="text-[13px] font-medium pt-2">Course Code</label>
              <div className="md:col-span-2">
                <input 
                  type="text" value={form.code} onChange={(e) => setForm({...form, code: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[14px] font-mono focus:bg-white focus:border-zinc-900 transition-all outline-none"
                />
              </div>
            </div>

            {/* Field: Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <label className="text-[13px] font-medium pt-2">Description</label>
              <div className="md:col-span-2">
                <textarea 
                  rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[14px] leading-relaxed focus:border-zinc-900 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Logic & Placement */}
          <div className="pt-12 pb-8 border-b border-zinc-100">
            <h2 className="text-lg font-semibold">Classification</h2>
            <p className="text-zinc-500 text-[14px] mt-1">Control how this subject is categorized and sorted.</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[13px] font-medium">Difficulty Level</label>
                <select 
                  value={form.level} onChange={(e) => setForm({...form, level: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[14px] outline-none hover:border-zinc-300 transition-colors"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium">Category</label>
                <select 
                  value={form.categoryType} onChange={(e) => setForm({...form, categoryType: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[14px] outline-none hover:border-zinc-300 transition-colors"
                >
                  <option value="academic">Academic</option>
                  <option value="professional">Professional</option>
                  <option value="skill-based">Skill-based</option>
                </select>
              </div>
            </div>

            {/* Toggle Card */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                  <Globe size={18} className="text-zinc-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold">Featured on Homepage</p>
                  <p className="text-[12px] text-zinc-500 font-normal">Push to global discovery view.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setForm({...form, isFeatured: !form.isFeatured})}
                className={`w-9 h-5 rounded-full transition-all relative border ${form.isFeatured ? 'bg-zinc-950 border-zinc-950' : 'bg-zinc-200 border-zinc-300'}`}
              >
                <div className={`absolute top-0.5 w-[14px] h-[14px] bg-white rounded-full transition-all ${form.isFeatured ? 'left-[18px]' : 'left-[3px]'}`} />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-20">
            <div className="p-6 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-red-900">Danger Zone</p>
                <p className="text-[13px] text-red-600/70 font-normal">Permanently remove this subject and its data.</p>
              </div>
              <button type="button" className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-50 transition-colors">
                Delete Subject
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modern Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-lg shadow-2xl border border-white/10"
          >
            {toast.type === 'success' ? <Check size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-red-400" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectEdit;