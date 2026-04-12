import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ── Icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d={d} />
  </svg>
);

const Icons = {
  back:        "M19 12H5M12 5l-7 7 7 7",
  share:       "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  message:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  edit:        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  heart:       "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  mail:        "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
  phone:       "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.07 2.18 2 2 0 012.06.01h3A2 2 0 017 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  externalLink:"M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
  user:        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
  camera:      "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z"
};

const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const VerifiedIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
  </svg>
);

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

  .up-root {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f6f6f7;
    min-height: 100vh;
    color: #111;
  }

  .up-nav {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 52px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 0.5px solid rgba(0,0,0,0.08);
  }

  .up-nav-back {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 500; color: #666;
    background: none; border: none; cursor: pointer;
    font-family: inherit;
  }

  .up-main { max-width: 860px; margin: 0 auto; padding: 1.5rem 1rem 2rem; }

  .up-hero {
    background: #fff;
    border-radius: 16px;
    border: 0.5px solid rgba(0,0,0,0.08);
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .up-cover {
    height: 120px;
    background: #0f1117;
    position: relative; overflow: hidden;
  }
  .up-cover-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .up-identity { padding: 0 1.5rem 1.5rem; }

  .up-avatar-row {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-top: -36px; margin-bottom: 1rem;
  }

  .up-avatar-wrap { position: relative; cursor: pointer; }
  .up-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    border: 3px solid #fff;
    background: #eef2ff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: #6366f1;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    position: relative;
  }
  .up-avatar img { width: 100%; height: 100%; object-fit: cover; }
  
  .up-avatar-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    color: white; opacity: 0; transition: opacity 0.2s;
    border-radius: 50%;
  }
  .up-avatar-wrap:hover .up-avatar-overlay { opacity: 1; }

  .up-active-dot {
    position: absolute; bottom: 4px; right: 4px;
    width: 13px; height: 13px; border-radius: 50%;
    background: #22c55e; border: 2px solid #fff;
    z-index: 2;
  }

  .up-loader-container { font-size: 10px; color: #6366f1; font-weight: bold; }

  .up-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
    font-family: inherit;
  }
  .up-btn-ghost { background: #f5f5f7; border: 0.5px solid rgba(0,0,0,0.08); color: #111; }
  .up-btn-primary { background: #18181b; border: 0.5px solid transparent; color: #fafafa; }

  .up-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: #111; }
  .up-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 100px;
    font-size: 11px; background: #eef2ff; color: #4338ca;
  }

  .up-grid { display: grid; grid-template-columns: 240px 1fr; gap: 1rem; }
  @media (max-width: 640px) { .up-grid { grid-template-columns: 1fr; } }

  .up-card { background: #fff; border: 0.5px solid rgba(0,0,0,0.08); border-radius: 16px; }
  .up-card-section { padding: 1rem 1.25rem; }
  .up-section-label { font-size: 10px; font-weight: 600; color: #999; text-transform: uppercase; margin-bottom: 12px; }

  .up-status-item, .up-contact-item { display: flex; align-items: center; gap: 10px; padding: 7px 0; }
  .up-status-icon, .up-contact-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: #f5f5f7; display: flex; align-items: center; justify-content: center; color: #888;
  }

  .up-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .up-stat { background: #fff; border: 0.5px solid rgba(0,0,0,0.08); border-radius: 16px; padding: 14px; }
  .up-stat-val { font-family: 'DM Serif Display', serif; font-size: 24px; color: #111; }
  
  .up-about { background: #fff; border: 0.5px solid rgba(0,0,0,0.08); border-radius: 16px; padding: 1.25rem; }
  .up-skill-tag { padding: 3px 10px; border-radius: 100px; background: #f5f5f7; font-size: 12px; margin-right: 4px; }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusItem = ({ icon, label, value, green }) => (
  <div className="up-status-item">
    <div className="up-status-icon">{icon}</div>
    <div>
      <div style={{ fontSize: "11px", color: "#999" }}>{label}</div>
      <div style={{ fontSize: "13px", fontWeight: "500", color: green ? "#16a34a" : "#111" }}>{value}</div>
    </div>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="up-contact-item">
    <div className="up-contact-icon">{icon}</div>
    <div style={{ overflow: "hidden" }}>
      <div style={{ fontSize: "10px", fontWeight: "600", color: "#999" }}>{label}</div>
      <div style={{ fontSize: "13px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{value}</div>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/users/${id}`);
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    setUploading(true);
    try {
      // FIXED: Using the specific route provided by you
      const { data } = await axios.put(`http://localhost:5001/api/users/update-profile-picture/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Update state with the new URL returned from backend
      setUser(prev => ({ ...prev, profilePicture: data.profilePicture }));
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err.response?.data);
      alert("Update failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="up-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!user) return <div className="up-root">User not found</div>;

  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase();
  const location = user.address ? `${user.address.city}, ${user.address.state}` : "Sri Lanka";

  return (
    <>
      <style>{styles}</style>
      <div className="up-root">
        <nav className="up-nav">
          <button className="up-nav-back" onClick={() => navigate(-1)}>
            <Icon d={Icons.back} size={16} /> Back
          </button>
        </nav>

        <main className="up-main">
          <div className="up-hero">
            <div className="up-cover">
              <div className="up-cover-grid" />
            </div>

            <div className="up-identity">
              <div className="up-avatar-row">
                {/* ── Fixed Avatar Section ── */}
                <div className="up-avatar-wrap" onClick={() => fileInputRef.current.click()}>
                  <div className="up-avatar">
                    {uploading ? (
                      <div className="up-loader-container">...</div>
                    ) : user.profilePicture ? (
                      <img 
                        // Appending timestamp prevents the browser from showing the old cached image
                        src={`${user.profilePicture}?t=${new Date().getTime()}`} 
                        alt={user.name} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span>{initials}</span>
                    )}

                    <div className="up-avatar-overlay">
                      <Icon d={Icons.camera} size={20} />
                    </div>
                  </div>
                  
                  {user.isActive && <div className="up-active-dot" />}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="up-btn up-btn-ghost"><Icon d={Icons.message} /> Message</button>
                  <button className="up-btn up-btn-primary" onClick={() => fileInputRef.current.click()} disabled={uploading}>
                    <Icon d={Icons.edit} /> {uploading ? "Uploading..." : "Change Photo"}
                  </button>
                </div>
              </div>

              <div className="up-name-row">
                <span className="up-name">{user.name}</span>
                {user.isActive && <span className="up-badge" style={{ marginLeft: '8px' }}><VerifiedIcon size={11} /> Verified</span>}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {user.role || "Member"} • Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="up-grid">
            <div className="up-card">
              <div className="up-card-section">
                <div className="up-section-label">Status</div>
                <StatusItem icon={<Icon d={Icons.shield} />} label="Account" value="Verified" green />
                <StatusItem icon={<ClockIcon />} label="Last Active" value="Just now" />
              </div>
              <div className="up-card-section">
                <div className="up-section-label">Contact</div>
                <ContactItem icon={<Icon d={Icons.mail} />} label="Email" value={user.email} />
                <ContactItem icon={<Icon d={Icons.phone} />} label="Phone" value={user.phone || "N/A"} />
                <ContactItem icon={<Icon d={Icons.user} />} label="Location" value={location} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="up-stats-row">
                <div className="up-stat"><div className="up-stat-val">12</div><div style={{ fontSize: '11px' }}>Projects</div></div>
                <div className="up-stat"><div className="up-stat-val">4.9</div><div style={{ fontSize: '11px' }}>Rating</div></div>
                <div className="up-stat"><div className="up-stat-val">150+</div><div style={{ fontSize: '11px' }}>Tasks</div></div>
              </div>

              <div className="up-about">
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>About</div>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{user.bio || "No bio provided."}</p>
                <div style={{ marginTop: '12px' }}>
                  {user.skills?.map(skill => <span key={skill} className="up-skill-tag">{skill}</span>)}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}