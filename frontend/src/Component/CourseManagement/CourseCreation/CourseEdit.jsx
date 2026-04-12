import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, Check, AlertCircle, Globe, ChevronRight, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import s1 from '../../../assets/s1.mp3'
import s2 from '../../../assets/s2.mp3'

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 0,
    level: 'beginner',
    price: '',
    currency: '',
    enrollmentLimit: 100,
    status: 'published',
    isFeatured: false,
    subject: '',
    coverImage: '',
    prerequisites: [],
    tags: []
  });

  const [allSubjects, setAllSubjects] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [instructor , setInstrutor] = useState("")
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [file, setFile] = useState(null); // For new cover image upload

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch course & options
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setToast({ type: 'error', message: 'No auth token' });

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data || res.data.course || res.data;
        const instructor = data.instructor?.name
        setInstrutor(instructor)

        setForm({
          title: data.title || '',
          description: data.description || '',
          duration: data.duration || 0,
          level: data.level || 'beginner',
          price: data.price || '',
          currency: data.currency || '',
          enrollmentLimit: data.enrollmentLimit || 100,
          status: data.status || 'published',
          isFeatured: !!data.isFeatured,
          subject: data.subject?._id || '',
          coverImage: data.coverImage || '',
          prerequisites: data.prerequisites || [],
          tags: data.tags || []
        });
      } catch (err) {
        console.error(err);
        setToast({ type: 'error', message: 'Failed to fetch course' });
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setFetching(false);
      }
    };

    const fetchOptions = async () => {
      try {
        const subsRes = await axios.get('http://localhost:5001/api/subjects/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllSubjects(subsRes.data.subjects || []);
        // TODO: fetch instructors if needed
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
    fetchOptions();
  }, [id, navigate]);

  // Handle submit with optional file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
    const formData = new FormData();

Object.keys(form).forEach(key => {
  if (key === "coverImage") return; // ❌ skip old image

  if (Array.isArray(form[key])) {
    formData.append(key, JSON.stringify(form[key]));
  } else {
    formData.append(key, form[key]);
  }
});

// ✅ only send ONE coverImage
if (file) {
  formData.append('coverImage', file);
}

      await axios.put(`http://localhost:5001/api/courses/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setToast({ type: 'success', message: 'Course updated successfully' });
      // Play a success sound
const audio = new Audio(s1); // path to your sound file
audio.play().catch(err => console.error('Audio play failed:', err));
      setTimeout(() => navigate('/instructor'), 1500);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.message || 'Update failed' });
      const audios = new Audio(s2); // path to your sound file
audios.play().catch(err => console.error('Audio play failed:', err));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-zinc-900" size={24} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans flex flex-col">
      

      {/* Header */}
      <nav className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="hover:bg-zinc-100 p-1.5 rounded-md">
            <ArrowLeft size={16} className="text-zinc-500" />
          </button>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <span className="text-zinc-400">Dashboard</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-zinc-400">Courses</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-zinc-900 truncate max-w-[150px]">{form.title || 'Edit Course'}</span>
          </div>
        </div>
        <button 
          onClick={handleSubmit} disabled={loading}
          className="h-8 px-4 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Changes'}
        </button>
      </nav>
    
      {/* Form */}
      <div className="flex-1 flex flex-col items-center py-12 px-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-[640px] space-y-8">

          {/* Title & Description */}
          <div>
            <label>Title</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
 
          <div>
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded px-3 py-2" rows={4} />
          </div>
           <div>
            <label w-full border border-gray-300 rounded-md px-3 py-2>Instructor (you are not allowed to change this value)</label>
            <textarea value={instructor}  className="w-full border rounded px-3 py-2" rows={1} readOnly />
          </div>

          {/* Subject & Instructor */}
          <div>
            <label>Subject</label>
            <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border rounded px-3 py-2">
              <option value="">Select subject</option>
              {allSubjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
            </select>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label>Cover Image</label>
            <div className="flex items-center gap-3">
              {(file || form.coverImage) && (
  <img
    src={file ? URL.createObjectURL(file) : form.coverImage}
    alt="cover"
    className="w-32 h-20 object-cover rounded border"
  />
)}
              <label className="flex items-center gap-2 cursor-pointer border rounded px-3 py-2 bg-zinc-50 hover:bg-zinc-100">
                <UploadCloud size={16} /> Upload New Image
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </div>

          {/* Remaining fields (duration, level, price, etc.) */}
          <div>
            <label>Duration (hours)</label>
            <input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label>Level</label>
            <select value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="w-full border rounded px-3 py-2">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          {/* Price & Currency */}
          <div>
            <label>Price</label>
            <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          

          <div>
            <label>Currency</label>
            <input type="text" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>

          {/* Enrollment & Lists */}
          <div>
            <label>Enrollment Limit</label>
            <input type="number" value={form.enrollmentLimit} onChange={e => setForm({...form, enrollmentLimit: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>

       <div>
  <label>Prerequisites (comma separated)</label>
  <input
    type="text"
    value={form.prerequisites.map(p => p.toString()).join(', ')} 
    onChange={e => setForm({
      ...form,
      prerequisites: e.target.value
        .split(',')
        .map(p => p.trim())
        .filter(p => p) // remove empty values
    })}
    className="w-full border rounded px-3 py-2"
  />
</div>

<div>
  <label>Tags (comma separated)</label>
  <input
    type="text"
    value={form.tags.map(t => t.toString()).join(', ')} 
    onChange={e => setForm({
      ...form,
      tags: e.target.value
        .split(',')
        .map(t => t.trim())
        .filter(t => t) // remove empty values
    })}
    className="w-full border rounded px-3 py-2"
  />
</div>
          {/* Featured */}
          <div className="flex items-center justify-between mt-4 p-3 border rounded bg-zinc-50">
            <div className="flex items-center gap-3">
              <Globe size={18} />
              <span>Featured on Homepage</span>
            </div>
            <button type="button" onClick={() => setForm({...form, isFeatured: !form.isFeatured})} className={`w-9 h-5 rounded-full transition-all relative ${form.isFeatured ? 'bg-zinc-900' : 'bg-zinc-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isFeatured ? 'left-[18px]' : 'left-[2px]'}`} />
            </button>
          </div>

        </form>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-10 right-10 z-[100] flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-lg">
            {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CourseEdit;