import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle, X, ChevronRight } from 'lucide-react';
import s3 from '../../../assets/s3.jpg'

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]); 
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your actual endpoint
      const response = await axios.post("http://localhost:5001/api/users/signin", form);
      addToast('success', 'Authentication successful. Welcome back!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Unauthorized. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-indigo-100">
      
      {/* --- REAL WORLD STACKED NOTIFICATIONS (Bottom-Right) --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
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
                  {toast.type === 'success' ? 'Success' : 'System Error'}
                </p>
                <p className="text-sm text-slate-700 font-medium leading-tight mt-1">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- LEFT SIDE: THE IMAGE & OVERLAY --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src={s3}
          alt="Professional Background"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end p-20 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 w-12 bg-indigo-500 rounded-full" />
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">Enterprise Edition</span>
            </div>
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
              Manage your <br />
              <span className="text-indigo-400">digital assets</span> <br />
              like a pro.
            </h1>
            <p className="mt-8 text-xl text-slate-300 max-w-md font-medium leading-relaxed">
              Experience the next generation of cloud management with our unified AI-driven dashboard.
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- RIGHT SIDE: THE SIGN-IN FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Sign In</h2>
            <p className="text-slate-500 mt-3 font-medium">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@company.com"
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="tracking-tight">Authorize Access</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Social Login</span>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>

          <button className="w-full mt-8 flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.97]">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="text-center mt-12 text-sm text-slate-500 font-medium">
            Not registered yet? 
            <button className="ml-2 font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">Create Account</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;