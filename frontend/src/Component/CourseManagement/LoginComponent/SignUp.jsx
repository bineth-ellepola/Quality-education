import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* LEFT: Branding Section (50%) */}
      <div className="hidden md:flex md:w-1/2 bg-[#080808] p-16 flex-col justify-between border-r border-white/5 relative overflow-hidden">
        {/* Subtle grid pattern for that tech/luxury feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-orange-500 rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
            <span className="text-white font-bold tracking-tighter text-xl uppercase">Premium System</span>
          </div>
          
          <h1 className="text-6xl font-semibold text-white leading-tight tracking-tighter">
            Seamlessly <br /> 
            <span className="text-gray-500">Integrated.</span>
          </h1>
          <p className="text-gray-400 mt-6 max-w-sm text-lg font-light leading-relaxed">
            The next generation of professional management starts here. Precision in every pixel.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-12 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
            <span>Secure TLS 1.3</span>
            <span>Cloud Infrastructure</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Section (50%) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-black tracking-tighter">Sign Up</h2>
            <p className="text-gray-500 mt-2 text-sm">Please enter your credentials to create an account.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs font-semibold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input name="name" placeholder="Full Name" onChange={handleChange} required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input name="phone" placeholder="Phone" onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm col-span-1" />
                <select name="gender" onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm text-gray-500">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input name="dateOfBirth" type="date" onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm text-gray-500" />
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 italic">Address Registry</p>
                <div className="space-y-3">
                  <input name="address.street" placeholder="Street Address" onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
                  <div className="grid grid-cols-3 gap-3">
                    <input name="address.city" placeholder="City" onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
                    <input name="address.state" placeholder="State" onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
                    <input name="address.postalCode" placeholder="ZIP" onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-orange-500 focus:bg-white focus:ring-0 outline-none transition-all text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#000000] text-white text-base font-bold uppercase tracking-[0.2em] rounded-md hover:bg-orange-600 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? "Wait for the moment..." : "Sign Up"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-6 tracking-wide">
              Already a member? <Link to="/login" className="text-orange-600 font-bold hover:text-black transition-colors">LOGIN HERE</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}