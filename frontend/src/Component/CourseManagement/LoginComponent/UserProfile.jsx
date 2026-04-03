import React, { useEffect, useState } from "react";
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
  more:        null, // circles below
  message:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  edit:        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock:       null, // circle + polyline below
  heart:       "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  mail:        "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
  mailChevron: "M22,6 12,13 2,6",
  phone:       "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.07 2.18 2 2 0 012.06.01h3A2 2 0 017 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  pin:         "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z",
  pinCircle:   "M12 10m-3 0a3 3 0 106 0 3 3 0 10-6 0",
  calendar:    null,
  externalLink:"M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
  user:        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
};

const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MoreIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
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
    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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

  /* ── Nav ── */
  .up-nav {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 52px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 0.5px solid rgba(0,0,0,0.08);
  }

  .up-nav-back {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 500; color: #666;
    background: none; border: none; cursor: pointer;
    padding: 6px 0; transition: color 0.15s;
    font-family: inherit;
  }
  .up-nav-back:hover { color: #111; }
  .up-nav-back:hover .up-back-icon { transform: translateX(-2px); }
  .up-back-icon { transition: transform 0.15s; }

  .up-nav-actions { display: flex; gap: 4px; }
  .up-nav-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; background: none;
    border: 0.5px solid transparent; color: #888;
    cursor: pointer; transition: all 0.15s;
  }
  .up-nav-btn:hover { background: #f3f3f5; border-color: rgba(0,0,0,0.08); color: #111; }

  /* ── Main ── */
  .up-main { max-width: 860px; margin: 0 auto; padding: 1.5rem 1rem 2rem; }

  /* ── Hero card ── */
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
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .up-cover-glow {
    position: absolute;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%);
    top: -50px; right: 60px;
  }
  .up-cover-fade {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(15,17,23,0.6) 100%);
  }

  .up-identity { padding: 0 1.5rem 1.5rem; }

  .up-avatar-row {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-top: -36px; margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .up-avatar-wrap { position: relative; flex-shrink: 0; }
  .up-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    border: 3px solid #fff;
    background: #eef2ff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: #6366f1;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  }
  .up-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .up-active-dot {
    position: absolute; bottom: 4px; right: 4px;
    width: 13px; height: 13px; border-radius: 50%;
    background: #22c55e; border: 2px solid #fff;
  }

  .up-actions { display: flex; gap: 8px; padding-bottom: 4px; flex-wrap: wrap; }
  .up-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', inherit;
    cursor: pointer; transition: all 0.15s;
    white-space: nowrap;
  }
  .up-btn-ghost {
    background: #f5f5f7; border: 0.5px solid rgba(0,0,0,0.08); color: #111;
  }
  .up-btn-ghost:hover { border-color: rgba(0,0,0,0.16); }
  .up-btn-primary {
    background: #18181b; border: 0.5px solid transparent; color: #fafafa;
  }
  .up-btn-primary:hover { background: #27272a; }

  .up-meta { display: flex; flex-direction: column; gap: 6px; }
  .up-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .up-name {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; font-weight: 400;
    color: #111; line-height: 1.2;
  }
  .up-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px 2px 6px; border-radius: 100px;
    font-size: 11px; font-weight: 500;
    background: #eef2ff; color: #4338ca;
    border: 0.5px solid #c7d2fe;
  }
  .up-sub-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .up-role-tag { font-size: 12px; font-weight: 500; color: #666; }
  .up-dot-sep { color: #ccc; }
  .up-join {
    font-size: 12px; color: #888;
    display: flex; align-items: center; gap: 5px;
  }

  /* ── Grid ── */
  .up-grid {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 1rem; align-items: start;
  }
  @media (max-width: 640px) {
    .up-grid { grid-template-columns: 1fr; }
  }

  /* ── Card ── */
  .up-card {
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.08);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .up-card-section { padding: 1rem 1.25rem; }
  .up-card-section + .up-card-section {
    border-top: 0.5px solid rgba(0,0,0,0.07);
  }
  .up-section-label {
    font-size: 10px; font-weight: 600;
    color: #999; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 12px;
  }

  /* Status items */
  .up-status-item {
    display: flex; align-items: center; gap: 10px; padding: 7px 0;
  }
  .up-status-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: #f5f5f7; border: 0.5px solid rgba(0,0,0,0.07);
    display: flex; align-items: center; justify-content: center;
    color: #888; flex-shrink: 0;
  }
  .up-status-text { flex: 1; min-width: 0; }
  .up-status-label { font-size: 11px; color: #999; line-height: 1.2; }
  .up-status-value { font-size: 13px; font-weight: 500; color: #111; line-height: 1.3; }
  .up-status-value.green { color: #16a34a; }

  /* Contact items */
  .up-contact-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 7px 0;
  }
  .up-contact-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: #f5f5f7; border: 0.5px solid rgba(0,0,0,0.07);
    display: flex; align-items: center; justify-content: center;
    color: #888; flex-shrink: 0;
  }
  .up-contact-text { flex: 1; min-width: 0; overflow: hidden; }
  .up-contact-label {
    font-size: 10px; font-weight: 600; color: #999;
    text-transform: uppercase; letter-spacing: 0.06em;
    line-height: 1; margin-bottom: 2px;
  }
  .up-contact-value {
    font-size: 13px; font-weight: 400; color: #111;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    line-height: 1.4;
  }

  /* Right column */
  .up-right { display: flex; flex-direction: column; gap: 1rem; }

  /* Stats */
  .up-stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
  }
  .up-stat {
    background: #fff; border: 0.5px solid rgba(0,0,0,0.08);
    border-radius: 16px; padding: 14px;
    transition: border-color 0.15s; cursor: default;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .up-stat:hover { border-color: rgba(0,0,0,0.16); }
  .up-stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; font-weight: 400;
    color: #111; line-height: 1; margin-bottom: 4px;
  }
  .up-stat-label { font-size: 11px; color: #888; font-weight: 500; }

  /* About */
  .up-about {
    background: #fff; border: 0.5px solid rgba(0,0,0,0.08);
    border-radius: 16px; padding: 1.25rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .up-about-title {
    font-family: 'DM Serif Display', serif;
    font-size: 15px; font-weight: 400; color: #111; margin-bottom: 10px;
  }
  .up-about-bio {
    font-size: 14px; line-height: 1.7; color: #666; font-weight: 300;
  }
  .up-skills-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .up-skill-tag {
    padding: 3px 10px; border-radius: 100px;
    background: #f5f5f7; border: 0.5px solid rgba(0,0,0,0.08);
    font-size: 12px; color: #555; font-weight: 400;
  }
  .up-about-foot {
    margin-top: 16px; padding-top: 16px;
    border-top: 0.5px solid rgba(0,0,0,0.07);
    display: flex; align-items: center; justify-content: space-between;
  }
  .up-avatars-stack { display: flex; }
  .up-avatar-sm {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #fff; background: #f0f0f2;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 600; color: #888;
    margin-right: -6px;
  }
  .up-avatar-sm.more { background: #eef2ff; color: #4338ca; font-size: 10px; }
  .up-view-link {
    font-size: 12px; font-weight: 500; color: #6366f1;
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 4px;
    padding: 0; font-family: inherit; transition: opacity 0.15s;
  }
  .up-view-link:hover { opacity: 0.7; }

  /* Loading / error */
  .up-loading {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #f6f6f7;
  }
  .up-pulse { width: 100%; max-width: 860px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .up-ph { background: #e8e8ea; border-radius: 12px; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .up-empty {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: #fff; padding: 2rem; text-align: center;
  }
  .up-empty-icon {
    width: 64px; height: 64px; background: #fef2f2; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #ef4444; margin-bottom: 1rem;
  }
  .up-empty h2 { font-size: 20px; font-weight: 600; color: #111; }
  .up-empty p { font-size: 14px; color: #888; margin-top: 6px; max-width: 280px; line-height: 1.6; }
  .up-empty button {
    margin-top: 1.5rem; padding: 9px 20px;
    background: #18181b; color: #fafafa;
    border: none; border-radius: 100px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: background 0.15s;
  }
  .up-empty button:hover { background: #27272a; }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusItem = ({ icon, label, value, green }) => (
  <div className="up-status-item">
    <div className="up-status-icon">{icon}</div>
    <div className="up-status-text">
      <div className="up-status-label">{label}</div>
      <div className={`up-status-value${green ? " green" : ""}`}>{value}</div>
    </div>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="up-contact-item">
    <div className="up-contact-icon">{icon}</div>
    <div className="up-contact-text">
      <div className="up-contact-label">{label}</div>
      <div className="up-contact-value">{value}</div>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="up-stat">
    <div className="up-stat-val">{value}</div>
    <div className="up-stat-label">{label}</div>
  </div>
);

// ── Initials helper ───────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ── Main component ────────────────────────────────────────────────────────────

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchUser();
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="up-loading">
          <div className="up-pulse">
            <div className="up-ph" style={{ height: 120 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <div className="up-ph" style={{ width: 80, height: 80, borderRadius: "50%" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 }}>
                <div className="up-ph" style={{ height: 22, width: "40%" }} />
                <div className="up-ph" style={{ height: 14, width: "25%" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 12 }}>
              <div className="up-ph" style={{ height: 280 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  <div className="up-ph" style={{ height: 80 }} />
                  <div className="up-ph" style={{ height: 80 }} />
                  <div className="up-ph" style={{ height: 80 }} />
                </div>
                <div className="up-ph" style={{ height: 180 }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Not found ──
  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <div className="up-empty">
          <div className="up-empty-icon">
            <Icon d={Icons.user} size={28} />
          </div>
          <h2>User not found</h2>
          <p>The profile you're looking for may have been moved or deleted.</p>
          <button onClick={() => navigate(-1)}>Go back</button>
        </div>
      </>
    );
  }

  // ── Derived values ──
  const initials = getInitials(user.name);
  const firstName = user.name?.split(" ")[0] ?? "User";
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";
  const location = user.address
    ? `${user.address.city}, ${user.address.state}`
    : "Remote, Worldwide";

  // ── Render ──
  return (
    <>
      <style>{styles}</style>
      <div className="up-root">

        {/* Nav */}
        <nav className="up-nav">
          <button className="up-nav-back" onClick={() => navigate(-1)}>
            <span className="up-back-icon">
              <Icon d={Icons.back} size={16} />
            </span>
            Back
          </button>
          <div className="up-nav-actions">
            <button className="up-nav-btn" title="Share">
              <Icon d={Icons.share} size={15} />
            </button>
            <button className="up-nav-btn" title="More">
              <MoreIcon size={15} />
            </button>
          </div>
        </nav>

        <main className="up-main">

          {/* Hero card */}
          <div className="up-hero">
            <div className="up-cover">
              <div className="up-cover-grid" />
              <div className="up-cover-glow" />
              <div className="up-cover-fade" />
            </div>

            <div className="up-identity">
              <div className="up-avatar-row">
                <div className="up-avatar-wrap">
                  <div className="up-avatar">
                    {user.profilePicture
                      ? <img src={user.profilePicture} alt={user.name} />
                      : initials}
                  </div>
                  {user.isActive && <div className="up-active-dot" />}
                </div>

                <div className="up-actions">
                  <button className="up-btn up-btn-ghost">
                    <Icon d={Icons.message} size={14} />
                    Message
                  </button>
                  <button className="up-btn up-btn-primary">
                    <Icon d={Icons.edit} size={14} />
                    Edit profile
                  </button>
                </div>
              </div>

              <div className="up-meta">
                <div className="up-name-row">
                  <span className="up-name">{user.name}</span>
                  {user.isActive && (
                    <span className="up-badge">
                      <VerifiedIcon size={11} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="up-sub-row">
                  <span className="up-role-tag">{user.role}</span>
                  <span className="up-dot-sep">·</span>
                  <span className="up-join">
                    <CalendarIcon size={12} />
                    Joined {joinDate}
                  </span>
                  {location && (
                    <>
                      <span className="up-dot-sep">·</span>
                      <span className="up-join">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="up-grid">

            {/* Left sidebar */}
            <div className="up-card">
              <div className="up-card-section">
                <div className="up-section-label">Status</div>
                <StatusItem
                  icon={<Icon d={Icons.shield} size={13} />}
                  label="Verification"
                  value={user.isActive ? "Verified" : "Pending"}
                  green={user.isActive}
                />
                <StatusItem
                  icon={<ClockIcon size={13} />}
                  label="Last active"
                  value="2 hours ago"
                />
                <StatusItem
                  icon={<Icon d={Icons.heart} size={13} />}
                  label="Account health"
                  value="Excellent"
                  green
                />
              </div>

              <div className="up-card-section">
                <div className="up-section-label">Contact</div>
                <ContactItem
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={Icons.mail} />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  label="Email"
                  value={user.email}
                />
                <ContactItem
                  icon={<Icon d={Icons.phone} size={13} />}
                  label="Phone"
                  value={user.phone || "+1 (555) 000-0000"}
                />
                <ContactItem
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  label="Location"
                  value={location}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="up-right">
              <div className="up-stats-row">
                <StatCard label="Projects" value="24" />
                <StatCard label="Success rate" value="98%" />
                <StatCard label="Team members" value="12" />
              </div>

              <div className="up-about">
                <div className="up-about-title">About {firstName}</div>
                <p className="up-about-bio">
                  {user.bio ||
                    "A passionate professional dedicated to creating exceptional digital experiences. Specialized in architectural design and system management with over 5 years of industry experience."}
                </p>

                {/* Skills — replace with real user.skills array if available */}
                <div className="up-skills-row">
                  {(user.skills || ["System Design", "Architecture", "Leadership", "Cloud Infra"]).map((s) => (
                    <span key={s} className="up-skill-tag">{s}</span>
                  ))}
                </div>

                <div className="up-about-foot">
                  <div className="up-avatars-stack">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="up-avatar-sm">U{i}</div>
                    ))}
                    <div className="up-avatar-sm more">+8</div>
                  </div>
                  <button className="up-view-link">
                    View connections
                    <Icon d={Icons.externalLink} size={12} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}