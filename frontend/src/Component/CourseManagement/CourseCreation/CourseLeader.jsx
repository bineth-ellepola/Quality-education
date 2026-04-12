import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">{error}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HERO SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center text-4xl font-semibold text-indigo-600 overflow-hidden">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="h-full w-full object-cover" />
                ) : (
                  user.name?.charAt(0)
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${user.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-500 mb-6">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <StatusBadge label="Account" active={user.isActive} activeText="Active" inactiveText="Inactive" />
                <StatusBadge label="Email" active={user.emailVerified} activeText="Verified" inactiveText="Unverified" />
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <InfoItem label="Phone Number" value={user.phone} />
                <InfoItem label="Gender" value={user.gender} capitalize />
                <InfoItem 
                  label="Date of Birth" 
                  value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null} 
                />
                <InfoItem 
                  label="Last Seen" 
                  value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"} 
                />
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Primary Address</h2>
              <p className="text-slate-600 leading-relaxed">
                {user.address
                  ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""}, ${user.address.postalCode || ""}, ${user.address.country || ""}`
                  : "No address registered to this account."}
              </p>
            </section>
          </div>

          {/* SIDEBAR INFO */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Account Metadata</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Last Profile Update</p>
                  <p className="text-sm font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const InfoItem = ({ label, value, capitalize = false }) => (
  <div>
    <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
    <p className={`text-slate-700 font-medium ${capitalize ? "capitalize" : ""}`}>
      {value || "—"}
    </p>
  </div>
);

const StatusBadge = ({ label, active, activeText, inactiveText }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
    <span className={`text-xs font-semibold ${active ? "text-emerald-600" : "text-slate-400"}`}>
      {active ? activeText : inactiveText}
    </span>
  </div>
);

export default UserProfile;