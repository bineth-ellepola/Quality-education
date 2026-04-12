import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(180); // 3 minutes in seconds

  // Timer countdown logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/users/verify-email", { email, otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5001/api/users/resend-otp", { email });
      alert("Verification code has been resent to your inbox.");
      setTimer(180); // Reset timer on resend
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Format timer as mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-sm tracking-widest uppercase">
        No email session found. <Link to="/signup" className="ml-2 text-orange-600 underline">Return to Sign Up</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans antialiased selection:bg-orange-500">
      
      {/* LEFT: Branding/Security Visual (50%) */}
<div className="hidden md:flex md:w-1/2 bg-[#080808] p-16 flex-col justify-between border-r border-white/5 relative overflow-hidden">
  
  {/* Background Pattern */}
  <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
      backgroundSize: "30px 30px",
    }}
  ></div>

  {/* TOP CONTENT */}
  <div className="relative z-10">
    
    {/* LOGO */}
    <div className="flex items-center gap-2 mb-16">
      <span className="text-white font-bold tracking-tight text-xl">
        Studly Corporation
      </span>
    </div>

    {/* HEADLINE */}
    <h1 className="text-6xl font-semibold text-white leading-tight tracking-tighter">
      Welcome <br />
      <span className="text-[#ff4628] italic font-light text-5xl">
        secure your identity.
      </span>
    </h1>

    {/* DESCRIPTION */}
    <p className="text-gray-400 mt-6 max-w-sm text-lg font-light leading-relaxed">
      A one-time passcode has been dispatched to your registered email address
      to finalize your enrollment and ensure your account remains protected.
    </p>

    {/* EXTRA INFO BLOCK */}
    <div className="mt-10 space-y-4">
      <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
        This verification step helps us maintain a secure learning environment
        and ensures that only you can access your account.
      </p>

      <p className="text-gray-600 text-xs tracking-wide uppercase">
        Please do not share your code with anyone
      </p>
    </div>

    {/* DIVIDER */}
    <div className="mt-10 h-[1px] w-32 bg-white/10"></div>

    {/* TRUST POINTS */}
    <div className="mt-10 space-y-3">
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <span className="w-1.5 h-1.5 bg-[#ff4628] rounded-full"></span>
        End-to-end encrypted verification
      </div>
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <span className="w-1.5 h-1.5 bg-[#ff4628] rounded-full"></span>
        Instant OTP delivery system
      </div>
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <span className="w-1.5 h-1.5 bg-[#ff4628] rounded-full"></span>
        Secure authentication flow
      </div>
    </div>
  </div>

  {/* BOTTOM CONTENT */}
  <div className="relative z-10">
    
    {/* STATUS / TAG */}
    <div className="mb-6 text-[10px] text-gray-500 uppercase tracking-[0.3em]">
      Identity Verification Step
    </div>

    {/* SECURITY LABELS */}
    <div className="flex gap-12 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
      <span>2FA Protection</span>
      <span>Encrypted Session</span>
      <span>Trusted Access</span>
    </div>
  </div>
</div>

      {/* RIGHT: OTP Form Section (50%) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black tracking-tighter uppercase">Verification</h2>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-gray-400 text-xs uppercase tracking-widest">Code sent to:</span>
              <span className="text-black font-medium text-sm tracking-tight">{email}</span>
            </div>
            <div className="mt-2 text-orange-600 font-bold text-xs tracking-widest uppercase">
              {timer > 0 ? `Time remaining: ${formatTime(timer)}` : "OTP expired. Please resend."}
            </div>
          </div>

          {error && (
            <div className="mb-8 p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              / Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Enter 4-Digit Passcode</label>
              <input
                type="text"
                maxLength="4"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="0000"
                className="w-full text-4xl md:text-6xl text-center md:text-left font-light tracking-[0.5em] bg-transparent border-b-2 border-gray-100 focus:border-orange-500 outline-none transition-all duration-500 placeholder:text-gray-100 py-4"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading || otp.length < 4 || timer <= 0}
                className="w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.3em] rounded-md hover:bg-orange-600 active:scale-[0.98] transition-all duration-500 shadow-xl shadow-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? "Verifuying..." : "Verify OTP"}
              </button>

              <div className="flex justify-between items-center px-1">
                <button 
                  type="button"
                  onClick={handleResend} 
                  disabled={loading}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
                >
                  Request New Code
                </button>
                <Link to="/signup" className="text-[10px] font-bold text-black uppercase tracking-widest hover:text-orange-600 transition-colors">
                  Change Email
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}