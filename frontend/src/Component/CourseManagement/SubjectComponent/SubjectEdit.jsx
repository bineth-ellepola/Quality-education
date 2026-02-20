import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // JWT token

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    level: 'all',
    categoryType: 'skill-based',
    isFeatured: false,
    sortOrder: 0
  });

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // --- Toast notifications ---
  const addToast = (type, message) => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 5000);
  };

  // --- Fetch subject details ---
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/subjects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sub = res.data.subject;
        setForm({
          name: sub.name || '',
          code: sub.code || '',
          description: sub.description || '',
          level: sub.level || 'all',
          categoryType: sub.categoryType || 'skill-based',
          isFeatured: sub.isFeatured || false,
          sortOrder: sub.sortOrder || 0
        });
      } catch (err) {
        console.error(err);
        addToast('error', err.response?.data?.message || 'Failed to load subject');
      }
    };
    fetchSubject();
  }, [id]);

  // --- Handle form input changes ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- Submit updates ---
 // --- Submit updates ---
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.put(`http://localhost:5001/api/subjects/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    addToast('success', 'Subject updated successfully');
    navigate('/dashboard'); // redirect to dashboard
  } catch (err) {
    console.error(err);
    addToast('error', err.response?.data?.message || 'Update failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-white/95 border-emerald-100 shadow-emerald-500/10'
                  : 'bg-white/95 border-rose-100 shadow-rose-500/10'
              }`}
            >
              <div className="mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-black uppercase tracking-widest ${toast.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {toast.type === 'success' ? 'Success' : 'Error'}
                </p>
                <p className="text-sm text-slate-700 font-medium leading-tight mt-1">{toast.message}</p>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="code"
            placeholder="Subject Code (optional)"
            value={form.code}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <select name="level" value={form.level} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all">All Levels</option>
          </select>
          <select name="categoryType" value={form.categoryType} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="academic">Academic</option>
            <option value="professional">Professional</option>
            <option value="skill-based">Skill-based</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
            Featured
          </label>
          <input
            type="number"
            name="sortOrder"
            value={form.sortOrder}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Sort Order"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Update Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubjectEdit;