import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
      const response = await axios.post("http://localhost:5001/api/users/signin", form);
      const { token, user } = response.data;

      addToast('success', 'Welcome to Studly. Redirecting...');
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        const routes = { admin: "/admin", instructor: "/instructor" };
        navigate(routes[user.role] || "/");
      }, 1500);

    } catch (error) {
      addToast('error', error.response?.data?.message || 'Invalid credentials provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-orange-100 text-black">
      
      {/* --- Notification Hub --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`p-4 rounded-xl shadow-xl border flex items-center gap-3 backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-black text-white border-zinc-800' 
                  : 'bg-white border-orange-200 text-black'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-orange-500" /> : <AlertCircle className="w-5 h-5 text-orange-600" />}
              <p className="text-sm font-semibold flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="hover:bg-zinc-800 p-1 rounded-full transition-colors">
                <X className={`w-4 h-4 ${toast.type === 'success' ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Visual Branding Panel (Black & Orange) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black p-12 flex-col justify-between overflow-hidden">
      

        <div className="relative z-10">
          <div className="flex items-center gap-3">
              
             <span className="text-white font-bold tracking-tight text-xl">Studly Corparation</span>
          </div>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white leading-tight mb-6"
          >
            Empowering the next <br /> generation of <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">leaders.</span>
          </motion.h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Join 10,000+ educators worldwide in a workspace designed for clarity and speed.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
           <div>
             <p className="text-white font-bold text-2xl">99.9%</p>
             <p className="text-orange-500 text-xs uppercase tracking-widest font-semibold">Uptime</p>
           </div>
           <div>
             <p className="text-white font-bold text-2xl">24/7</p>
             <p className="text-orange-500 text-xs uppercase tracking-widest font-semibold">Support</p>
           </div>
        </div>
      </div>

      {/* --- Authentic Form Panel (White & Black) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-black tracking-tight">Welcome Back</h2>
            <p className="text-zinc-500 mt-3 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-black">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="youremail.com"
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all text-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-black">Password</label>
                <button type="button" className="text-xs font-bold text-orange-600 hover:text-orange-700">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all text-black"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-white-500">Sign In</span>
                   
                  <ArrowRight className="w-5 h-5 text-orange-500" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-zinc-400 font-semibold tracking-widest">Or continue with</span></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-zinc-200 rounded-xl font-semibold text-black hover:bg-zinc-50 transition-all active:scale-95">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-zinc-200 rounded-xl font-semibold text-black hover:bg-zinc-50 transition-all active:scale-95">
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <p className="mt-10 text-center text-zinc-500 text-sm">
            Don't have an account? 
            <button className="ml-1 font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors">Create an account</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;