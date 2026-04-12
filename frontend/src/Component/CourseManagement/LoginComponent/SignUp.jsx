import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: { street: "", city: "", state: "", postalCode: "" }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [key]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5001/api/users/register", formData);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans antialiased selection:bg-blue-100">
      
      {/* LEFT: Branding Section (Apple Dark Style) */}
      <div className="hidden md:flex md:w-1/2 bg-black p-16 flex-col justify-between relative overflow-hidden">
        
        {/* TOP CONTENT */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <span className="bg-clip-text text-transparent font-bold tracking-tight text-2xl"
              style={{ backgroundImage: "linear-gradient(97deg, #ff073a, #ff073a 42%, #ff073a 74%, #ff073a)" }}>
              Studly
            </span>
            <span className="text-white/40 font-medium text-sm ml-1 tracking-widest uppercase">Corporation</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[56px] font-bold text-white leading-[1.1] tracking-tight"
          >
            Create your account. <br />
            <span className="text-[#86868b]">Join the future.</span>
          </motion.h1>

          <p className="text-[#86868b] mt-8 max-w-sm text-xl font-medium leading-relaxed">
            Experience a workspace designed for clarity, speed, and professional growth.
          </p>

          {/* FEATURE HIGHLIGHTS */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-[#f5f5f7] text-sm font-medium">
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
              Real-time synchronization
            </div>
            <div className="flex items-center gap-3 text-[#f5f5f7] text-sm font-medium">
              <div className="w-1 h-1 bg-purple-500 rounded-full" />
              Industry-certified learning paths
            </div>
            <div className="flex items-center gap-3 text-[#f5f5f7] text-sm font-medium">
              <div className="w-1 h-1 bg-orange-500 rounded-full" />
              Cloud-native infrastructure
            </div>
          </div>
        </div>

        {/* BOTTOM CONTENT */}
        <div className="relative z-10 flex gap-12 border-t border-white/10 pt-8">
          <div>
            <p className="text-white font-semibold text-2xl tracking-tight">99.9%</p>
            <p className="text-[#86868b] text-[10px] uppercase tracking-widest font-bold mt-1">Uptime</p>
          </div>
          <div>
            <p className="text-white font-semibold text-2xl tracking-tight">Encrypted</p>
            <p className="text-[#86868b] text-[10px] uppercase tracking-widest font-bold mt-1">End-to-End</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Section (Clean Apple White) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 bg-white">
        <div className="max-w-[440px] w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-[50px] font-bold text-[#1d1d1f] tracking-tight leading-tight"><span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
            Sign
          </span>  <span className="text-[#615d90]">Up</span>  </h2>
            <p className="text-[#6e6e73] mt-3 text-lg font-medium">Enter your details to create an account.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-[#fff2f2] rounded-xl border border-[#ff3b30]/10 text-[#ff3b30] text-[13px] font-semibold flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#ff3b30] rounded-full" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <input name="name" placeholder="Full Name" onChange={handleChange} required 
                className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required 
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required 
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input name="phone" placeholder="Phone" onChange={handleChange} 
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
                <select name="gender" onChange={handleChange} 
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium text-[#424245] appearance-none">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input name="dateOfBirth" type="date" onChange={handleChange} 
                  className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium text-[#424245]" />
              </div>

              <div className="pt-6">
                <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-4 ml-1">Address Details</p>
                <div className="space-y-3">
                  <input name="address.street" placeholder="Street Address" onChange={handleChange} 
                    className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
                  <div className="grid grid-cols-3 gap-3">
                    <input name="address.city" placeholder="City" onChange={handleChange} 
                      className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
                    <input name="address.state" placeholder="State" onChange={handleChange} 
                      className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
                    <input name="address.postalCode" placeholder="ZIP" onChange={handleChange} 
                      className="w-full px-5 py-4 bg-[#f5f5f7] border border-transparent rounded-[12px] focus:bg-white focus:border-[#0071e3] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all text-[17px] font-medium placeholder:text-[#86868b]" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[17px] font-semibold rounded-[12px] active:scale-[0.98] transition-all duration-300 shadow-sm shadow-blue-200 mt-6 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-center text-[14px] text-[#6e6e73] mt-8 font-medium">
              Already a member? <Link to="/login" className="text-[#0066cc] font-semibold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}