import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import s1 from '../../../assets/S4.jpg';

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans antialiased">
      
      {/* Left Side: Full Clear Wallpaper (50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        {/* Background Image - Full Clarity */}
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={s1} 
            alt="Branding"
            className="w-full h-full object-cover" // Full opacity, no indigo
          />
          {/* Black gradient overlay only at the bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>

        {/* Branding Content */}
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 text-white"
          >
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <GraduationCap size={32} />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduFlow.</span>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              Elevate your <br /> teaching.
            </h2>
            <div className="space-y-4">
              {[ 'Crystal Clear Interface', 'Powerful Insights', 'Global Reach'].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90 drop-shadow-md">
                  <CheckCircle2 size={20} className="text-white" />
                  <span className="text-lg font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-white/50 text-sm font-medium">
            © 2026 EduFlow Systems Inc.
          </p>
        </div>
      </div>

      {/* Right Side: Professional Details (50%) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Login</h1>
            <p className="text-slate-500 text-lg">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="group">
              <label className="text-xs uppercase tracking-widest font-black text-slate-400 mb-2 block ml-1 transition-colors group-focus-within:text-black">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-8 pr-4 py-4 bg-transparent border-b-2 border-slate-100 focus:border-black outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-widest font-black text-slate-400 block ml-1 transition-colors group-focus-within:text-black">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-slate-400 hover:text-black transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-12 py-4 bg-transparent border-b-2 border-slate-100 focus:border-black outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ gap: '1.5rem' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-black text-white font-bold py-5 rounded-full flex items-center justify-center gap-3 transition-all shadow-2xl shadow-black/20"
              >
                Continue <ArrowRight size={20} />
              </motion.button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
            <span className="text-slate-400 font-medium">No account?</span>
            <a href="#" className="text-black font-black border-b-2 border-black pb-0.5 hover:text-slate-600 hover:border-slate-600 transition-colors">
              Create Account
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signin;