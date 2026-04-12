import React, { useEffect, useState } from "react";
import axios from "axios";

// ─── INJECT GLOBAL STYLES ───────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

    :root {
      --black: #0a0a0a;
      --white: #fafaf8;
      --orange: #e85d04;
      --orange-dim: #c44f03;
      --orange-pale: #fff1e6;
      --slate: #6b6b6b;
      --line: #e8e8e4;
      --card-bg: #ffffff;
      --radius: 4px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--white);
      color: var(--black);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.3; }
    }

    .anim-1 { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
    .anim-2 { animation: fadeUp 0.55s 0.08s cubic-bezier(.22,1,.36,1) both; }
    .anim-3 { animation: fadeUp 0.55s 0.16s cubic-bezier(.22,1,.36,1) both; }
    .anim-4 { animation: fadeUp 0.55s 0.24s cubic-bezier(.22,1,.36,1) both; }

    /* ── Nav ── */
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: var(--card-bg);
      border-bottom: 1px solid var(--line);
      padding: 0 48px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-logo-mark {
      width: 28px; height: 28px;
      background: var(--black);
      display: flex; align-items: center; justify-content: center;
    }
    .nav-logo-mark span {
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--orange);
      line-height: 1;
    }
    .nav-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--black);
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .nav-tag {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--slate);
      padding: 4px 10px;
      border: 1px solid var(--line);
    }
    .btn-logout {
      font-size: 12px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--slate);
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 0;
      border-bottom: 1px solid transparent;
      transition: color 0.2s, border-color 0.2s;
    }
    .btn-logout:hover { color: var(--orange); border-color: var(--orange); }

    /* ── Layout ── */
    .page { max-width: 1160px; margin: 0 auto; padding: 48px 48px 80px; }

    .grid-main {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 32px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .grid-main { grid-template-columns: 1fr; }
      .nav { padding: 0 20px; }
      .page { padding: 24px 20px 60px; }
    }

    /* ── Cards ── */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--line);
    }

    /* ── Hero profile card ── */
    .profile-hero {
      padding: 0;
      overflow: hidden;
    }
    .profile-hero-top {
      background: var(--black);
      padding: 36px 40px;
      display: flex;
      align-items: flex-end;
      gap: 28px;
      position: relative;
    }
    .profile-hero-top::after {
      content: '';
      position: absolute;
      bottom: 0; right: 40px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 120px;
      font-weight: 300;
      line-height: 0.8;
      color: rgba(255,255,255,0.04);
      pointer-events: none;
    }
    .avatar {
      width: 88px; height: 88px;
      background: var(--orange);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 36px;
      font-weight: 600;
      color: var(--white);
      flex-shrink: 0;
      position: relative;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .status-dot {
      position: absolute;
      bottom: -3px; right: -3px;
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 2px solid var(--black);
    }
    .status-dot.active { background: #00c896; animation: pulse-dot 2s infinite; }
    .status-dot.inactive { background: #555; }

    .hero-meta { flex: 1; }
    .hero-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 36px;
      font-weight: 300;
      color: var(--white);
      line-height: 1.1;
      letter-spacing: -0.01em;
    }
    .hero-email {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      margin-top: 6px;
      font-weight: 300;
    }
    .hero-badges {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      padding: 4px 10px;
      border: 1px solid;
    }
    .badge-role { color: var(--orange); border-color: var(--orange); background: rgba(232,93,4,0.08); }
    .badge-verified { color: #00c896; border-color: rgba(0,200,150,0.3); background: rgba(0,200,150,0.07); }
    .badge-unverified { color: #f5a623; border-color: rgba(245,166,35,0.3); background: rgba(245,166,35,0.07); }

    /* ── Details grid ── */
    .profile-body { padding: 36px 40px; }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }
    .detail-item {
      padding: 20px 0;
      border-bottom: 1px solid var(--line);
    }
    .detail-item:nth-child(odd) { padding-right: 40px; border-right: 1px solid var(--line); }
    .detail-item:nth-child(even) { padding-left: 40px; }
    .detail-item:nth-last-child(-n+2) { border-bottom: none; }

    .detail-label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--slate);
      margin-bottom: 6px;
    }
    .detail-value {
      font-size: 14px;
      font-weight: 400;
      color: var(--black);
      line-height: 1.4;
    }
    .detail-value.empty { color: #c0c0bb; font-style: italic; }

    /* ── Action bar ── */
    .action-bar {
      padding: 24px 40px;
      border-top: 1px solid var(--line);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .btn-primary {
      padding: 11px 28px;
      background: var(--black);
      color: var(--white);
      border: 1px solid var(--black);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-primary:hover { background: var(--orange); border-color: var(--orange); }
    .btn-ghost {
      padding: 11px 20px;
      background: none;
      color: var(--slate);
      border: 1px solid var(--line);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-ghost:hover { color: #c0392b; border-color: #c0392b; }

    /* ── Right column ── */
    .side-stack { display: flex; flex-direction: column; gap: 16px; }

    .stat-card {
      padding: 28px 28px;
      background: var(--card-bg);
      border: 1px solid var(--line);
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 3px; height: 100%;
      background: var(--line);
      transition: background 0.3s;
    }
    .stat-card:hover::before { background: var(--orange); }

    .stat-label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--slate);
      margin-bottom: 10px;
    }
    .stat-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 52px;
      font-weight: 300;
      color: var(--black);
      line-height: 1;
    }
    .stat-sub {
      font-size: 11px;
      color: var(--slate);
      margin-top: 8px;
      font-weight: 300;
    }

    .access-card {
      padding: 28px;
      background: var(--black);
      border: 1px solid var(--black);
      position: relative;
      overflow: hidden;
    }
    .access-card::after {
      content: 'ACCESS';
      position: absolute;
      bottom: -10px; right: 16px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 72px;
      font-weight: 600;
      color: rgba(255,255,255,0.04);
      letter-spacing: -0.02em;
      pointer-events: none;
    }
    .access-label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      color: rgba(255,255,255,0.35);
      margin-bottom: 10px;
    }
    .access-role {
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px;
      font-weight: 300;
      color: var(--white);
      text-transform: capitalize;
    }
    .access-bar {
      margin-top: 20px;
      height: 1px;
      background: rgba(255,255,255,0.08);
      position: relative;
    }
    .access-bar-fill {
      position: absolute;
      top: 0; left: 0;
      height: 100%;
      width: 40%;
      background: var(--orange);
    }

    /* ── EDIT MODE ── */
    .edit-wrap { max-width: 760px; }
    .edit-header {
      padding: 32px 40px;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .edit-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px;
      font-weight: 300;
      color: var(--black);
    }
    .edit-subtitle {
      font-size: 12px;
      color: var(--slate);
      margin-top: 4px;
      font-weight: 300;
    }
    .edit-section-label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--slate);
      padding: 24px 40px 16px;
      border-bottom: 1px solid var(--line);
    }
    .edit-body {
      padding: 32px 40px;
    }
    .input-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 600px) {
      .input-grid { grid-template-columns: 1fr; }
      .profile-hero-top { padding: 28px 24px; }
      .profile-body { padding: 24px; }
      .action-bar { padding: 20px 24px; }
      .edit-header { padding: 24px; }
      .edit-body { padding: 24px; }
      .details-grid { grid-template-columns: 1fr; }
      .detail-item:nth-child(odd) { padding-right: 0; border-right: none; }
      .detail-item:nth-child(even) { padding-left: 0; }
      .detail-item:nth-last-child(-n+2) { border-bottom: 1px solid var(--line); }
      .detail-item:last-child { border-bottom: none; }
    }
    .input-group { display: flex; flex-direction: column; gap: 8px; }
    .input-label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--slate);
    }
    .input-field {
      width: 100%;
      background: var(--white);
      border: 1px solid var(--line);
      padding: 10px 14px;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      color: var(--black);
      outline: none;
      transition: border-color 0.2s;
      border-radius: var(--radius);
    }
    .input-field:focus { border-color: var(--black); }
    .input-field::placeholder { color: #c0c0bb; }

    .edit-footer {
      padding: 24px 40px;
      border-top: 1px solid var(--line);
      display: flex;
      gap: 12px;
    }
    .btn-save {
      flex: 1;
      padding: 13px 24px;
      background: var(--orange);
      color: var(--white);
      border: 1px solid var(--orange);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-save:hover { background: var(--orange-dim); }
    .btn-cancel {
      flex: 1;
      padding: 13px 24px;
      background: none;
      color: var(--slate);
      border: 1px solid var(--line);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-cancel:hover { border-color: var(--black); color: var(--black); }

    /* ── Loading ── */
    .loading-screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      background: var(--white);
    }
    .spinner {
      width: 32px; height: 32px;
      border: 1px solid var(--line);
      border-top-color: var(--orange);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loading-text {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--slate);
    }
    .loading-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 300;
      color: var(--black);
      letter-spacing: 0.04em;
    }
    .loading-logo span { color: var(--orange); }
  `}</style>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const storedData = JSON.parse(localStorage.getItem("user"));
  if (!storedData) window.location.href = "/";
  const userId = storedData?.user?._id || storedData?._id;

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "",
    dateOfBirth: "", street: "", city: "", state: "", postalCode: ""
  });

  useEffect(() => { fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/users/${userId}`);
      const data = res.data;
      setUser(data);
      setFormData({
        name: data.name || "", email: data.email || "",
        phone: data.phone || "", gender: data.gender || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
        street: data.address?.street || "", city: data.address?.city || "",
        state: data.address?.state || "", postalCode: data.address?.postalCode || ""
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/api/users/${userId}`, {
        name: formData.name, email: formData.email, phone: formData.phone,
        gender: formData.gender, dateOfBirth: formData.dateOfBirth,
        address: { street: formData.street, city: formData.city, state: formData.state, postalCode: formData.postalCode }
      });
      alert("Profile updated successfully");
      setEditMode(false);
      fetchUser();
    } catch (err) {
      alert("Update route not implemented yet ⚠️");
    }
  };

  const handleDelete = () => alert("Delete API not implemented yet ⚠️");
  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  if (loading) return (
    <>
      <GlobalStyles />
      <div className="loading-screen">
        <div className="loading-logo">INSTRUC<span>T</span>OR</div>
        <div className="spinner" />
        <p className="loading-text">Loading Profile</p>
      </div>
    </>
  );

  if (!user) return (
    <>
      <GlobalStyles />
      <div style={{ padding: 60, textAlign: "center", color: "#c0392b", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
        Failed to load user
      </div>
    </>
  );

  return (
    <>
      <GlobalStyles />

      {/* NAV */}
      <nav className="nav anim-1">
        <div className="nav-logo">
          <div className="nav-logo-mark"><span>I</span></div>
          <span className="nav-title">Instructor Portal</span>
        </div>
        <div className="nav-right">
          <span className="nav-tag">{user.role}</span>
          <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <div className="page">
        {!editMode ? (
          <div className="grid-main">
            {/* ── LEFT ── */}
            <div>
              {/* Profile Hero */}
              <div className="card profile-hero anim-2">
                <div className="profile-hero-top">
                  <div className="avatar">
                    {user.profilePicture
                      ? <img src={user.profilePicture} alt="Profile" />
                      : user.name?.charAt(0).toUpperCase()
                    }
                    <div className={`status-dot ${user.isActive ? "active" : "inactive"}`} title={user.isActive ? "Active" : "Inactive"} />
                  </div>
                  <div className="hero-meta">
                    <div className="hero-name">{user.name}</div>
                    <div className="hero-email">{user.email}</div>
                    <div className="hero-badges">
                      <span className="badge badge-role">{user.role}</span>
                      <span className={`badge ${user.emailVerified ? "badge-verified" : "badge-unverified"}`}>
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="profile-body">
                  <div className="details-grid">
                    <DetailItem label="Phone" value={user.phone} />
                    <DetailItem label="Gender" value={user.gender} capitalize />
                    <DetailItem label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null} />
                    <DetailItem label="City" value={user.address?.city} />
                    <DetailItem label="Last Login" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First session"} />
                    <DetailItem label="Status" value={user.isActive ? "Active" : "Inactive"} />
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button className="btn-ghost" onClick={handleDelete}>Delete Account</button>
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="side-stack anim-3">
              <div className="stat-card">
                <div className="stat-label">Active Courses</div>
                <div className="stat-value">0</div>
                <div className="stat-sub">No courses published yet</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">0</div>
                <div className="stat-sub">Across all enrollments</div>
              </div>

              <div className="access-card">
                <div className="access-label">Access Level</div>
                <div className="access-role">{user.role}</div>
                <div className="access-bar">
                  <div className="access-bar-fill" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── EDIT MODE ── */
          <div className="anim-1">
            <div className="card edit-wrap">
              <div className="edit-header">
                <div>
                  <div className="edit-title">Update Profile</div>
                  <div className="edit-subtitle">Keep your information accurate and current</div>
                </div>
                <button className="btn-cancel" onClick={() => setEditMode(false)} style={{ flex: "none" }}>✕</button>
              </div>

              <div className="edit-section-label">Personal Information</div>
              <div className="edit-body">
                <div className="input-grid">
                  <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                  <InputGroup label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                  <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                  <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6b6b' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", cursor: "pointer" }}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <InputGroup label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
              </div>

              <div className="edit-section-label">Address Details</div>
              <div className="edit-body">
                <div className="input-grid">
                  <InputGroup label="Street" name="street" value={formData.street} onChange={handleChange} />
                  <InputGroup label="City" name="city" value={formData.city} onChange={handleChange} />
                  <InputGroup label="State / Province" name="state" value={formData.state} onChange={handleChange} />
                  <InputGroup label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                </div>
              </div>

              <div className="edit-footer">
                <button className="btn-save" onClick={handleUpdate}>Save Changes</button>
                <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const DetailItem = ({ label, value, capitalize = false }) => (
  <div className="detail-item">
    <div className="detail-label">{label}</div>
    <div className={`detail-value ${!value ? "empty" : ""} ${capitalize ? "text-capitalize" : ""}`}
      style={{ textTransform: capitalize && value ? "capitalize" : undefined }}>
      {value || "Not provided"}
    </div>
  </div>
);

const InputGroup = ({ label, ...props }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input {...props} className="input-field" />
  </div>
);

export default InstructorDashboard;