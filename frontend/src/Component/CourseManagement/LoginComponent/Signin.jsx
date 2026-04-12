import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle, X, ArrowRight, Eye, EyeOff, Github } from 'lucide-react';
import { useAppContext } from '../AppProvider';

const Signin = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addToast = (type, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/users/login", form);
      const { token, user } = response.data;

      addToast('success', 'Welcome back. Redirecting...');
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        const routes = { admin: "/insManage", instructor: "/instructor" };
        navigate(routes[user.role] || "/");
      }, 1500);

    } catch (error) {
      addToast('error', error.response?.data?.message || 'Invalid credentials provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-blue-100 text-[#1d1d1f]">
      
      {/* --- Notification Hub --- */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3 w-full max-w-[340px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
                toast.type === 'success' 
                  ? 'bg-black/90 text-white border-white/10' 
                  : 'bg-white/90 border-red-100 text-black'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-[#ff3b30]" />}
              <p className="text-[13px] font-medium flex-1 tracking-tight">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Visual Branding Panel (Apple Dark Style) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#000] p-16 flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-clip-text text-transparent font-bold tracking-tight text-2xl"
              style={{ backgroundImage: "linear-gradient(97deg, #ff073a, #ff073a 42%, #ff073a 74%, #ff073a)" }}>
              Studly
            </span>
            <span className="text-white/40 font-medium text-sm ml-1 tracking-widest uppercase">Corporation</span>
          </div>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[56px] font-bold text-white leading-[1.1] mb-8 tracking-tight"
          >
            Empowering the <br /> next generation <br /> of leaders.
          </motion.h1>
          <p className="text-[#86868b] text-xl max-w-md font-medium leading-relaxed">
            Join 10,000+ educators worldwide in a workspace designed for clarity and speed.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
           <div>
             <p className="text-white font-semibold text-3xl tracking-tight">99.9%</p>
             <p className="text-[#86868b] text-xs uppercase tracking-[0.1em] font-bold mt-1">Uptime</p>
           </div>
           <div>
             <p className="text-white font-semibold text-3xl tracking-tight">24/7</p>
             <p className="text-[#86868b] text-xs uppercase tracking-[0.1em] font-bold mt-1">Global Support</p>
           </div>
        </div>
      </div>

      {/* --- Authentic Form Panel (Clean Apple White) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-12">
            <h2 className="text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight"><span className='text-[#615d90]'>Welcome</span>  <span className="bg-clip-text text-transparent font-bold tracking-tight text-2xl"
              style={{ backgroundImage: "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)",fontSize:"40px" }}>
              Back
            </span> </h2>
            <p className="text-[#6e6e73] mt-3 text-lg font-medium">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-[#1d1d1f] ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@example.com"
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[12px] font-semibold text-[#1d1d1f]">Password</label>
                <button type="button" className="text-[12px] font-semibold text-[#0066cc] hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-4 rounded-[12px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-4 shadow-sm shadow-blue-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="text-[17px]">Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#d2d2d7]"></span></div>
            <div className="relative flex justify-center text-[12px] font-medium"><span className="bg-white px-4 text-[#86868b]">Or continue with</span></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-[#d2d2d7] rounded-[12px] font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all active:scale-[0.97]">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
              <span className="text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-[#d2d2d7] rounded-[12px] font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all active:scale-[0.97]">
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <p className="mt-12 text-center text-[#6e6e73] text-[14px] font-medium">
            Don't have an account? 
            <Link to="/signup" className="text-[#0066cc] font-semibold hover:underline ml-1">Create an Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;