import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../AppProvider";

// ─── Inline Styles ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #F7F6F3;
    --surface:   #FFFFFF;
    --surface-2: #F0EDE8;
    --border:    #E4E0D9;
    --ink:       #1A1916;
    --ink-2:     #6B6860;
    --ink-3:     #A8A49D;
    --accent:    #849e15;
    --accent-lt: #EBF1FD;
    --green:     #ffffff;
    --green-lt:  #f80909;
    --amber:     #1f1d1b;
    --amber-lt:  #FEF3C7;
    --red:       #e61717;
    --red-lt:    #FEE2E2;
    --radius:    10px;
    --shadow:    0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.05);
    --transition: 180ms ease;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--ink);
    min-height: 100vh;
    font-size: 14px;
    line-height: 1.5;
  }

  /* ─── Layout ─────────────────────────────────────────────── */
  .app-shell { display: flex; min-height: 100vh; }

  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 10;
  }

  .sidebar-logo {
    padding: 0 20px 28px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }
  .sidebar-logo h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    letter-spacing: -.3px;
    color: var(--ink);
  }
  .sidebar-logo span { color: var(--accent); }

  .nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--ink-3);
    padding: 0 20px 8px;
    margin-top: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 20px;
    cursor: pointer;
    color: var(--ink-2);
    font-size: 13.5px;
    font-weight: 450;
    transition: color var(--transition), background var(--transition);
    border-left: 2px solid transparent;
    user-select: none;
  }
  .nav-item:hover { background: var(--surface-2); color: var(--ink); }
  .nav-item.active {
    color: var(--accent);
    background: var(--accent-lt);
    border-left-color: var(--accent);
    font-weight: 500;
  }
  .nav-item svg { flex-shrink: 0; }

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 20px 0;
    border-top: 1px solid var(--border);
  }
  .user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .user-avatar {
    width: 32px; height: 32px;
    background: var(--ink);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 500; }
  .user-role { font-size: 11px; color: var(--ink-3); }

  /* ─── Main ────────────────────────────────────────────────── */
  .main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 5;
  }
  .topbar-title { font-size: 15px; font-weight: 600; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    border: none;
    outline: none;
  }
  .btn-primary {
    background: var(--accent);
    color: #fff;
  }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-primary:disabled { background: #93b4f5; cursor: not-allowed; }
  .btn-ghost {
    background: transparent;
    color: var(--ink-2);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { background: var(--surface-2); color: var(--ink); }

  /* ─── Content ─────────────────────────────────────────────── */
  .content { padding: 32px; flex: 1; }

  /* ─── Stats Row ─────────────────────────────────────────────── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
  }
  .stat-label { font-size: 12px; color: var(--ink-3); font-weight: 500; letter-spacing: .02em; margin-bottom: 6px; }
  .stat-value { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--ink); }
  .stat-sub { font-size: 11px; color: var(--ink-3); margin-top: 4px; }
  .stat-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 500;
    margin-top: 6px;
    padding: 2px 7px;
    border-radius: 20px;
  }

  /* ─── Two-col grid ─────────────────────────────────────────── */
  .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 960px) { .dashboard-grid { grid-template-columns: 1fr; } }

  /* ─── Panel ─────────────────────────────────────────────────── */
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .panel-header {
    padding: 18px 22px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .panel-title { font-size: 14px; font-weight: 600; }
  .panel-body { padding: 22px; }

  /* ─── Form ─────────────────────────────────────────────────── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; font-weight: 500; color: var(--ink-2); }
  .form-control {
    padding: 8px 11px;
    border: 1px solid var(--border);
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--ink);
    background: var(--bg);
    transition: border-color var(--transition), box-shadow var(--transition);
    outline: none;
    width: 100%;
  }
  .form-control:focus {
    border-color: var(--accent);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37,99,235,.1);
  }
  textarea.form-control { resize: vertical; min-height: 80px; }
  select.form-control { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }

  .file-drop {
    border: 1.5px dashed var(--border);
    border-radius: 7px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    background: var(--bg);
    transition: border-color var(--transition), background var(--transition);
  }
  .file-drop:hover { border-color: var(--accent); background: var(--accent-lt); }
  .file-drop-icon { color: var(--ink-3); margin-bottom: 6px; }
  .file-drop-text { font-size: 12px; color: var(--ink-3); }
  .file-drop-text strong { color: var(--accent); }
  .file-drop input { display: none; }

  /* ─── Alert ─────────────────────────────────────────────────── */
  .alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 7px;
    font-size: 13px;
    margin-bottom: 16px;
  }
  .alert-error { background: var(--red-lt); color: var(--red); border: 1px solid #fca5a5; }
  .alert-success { background: var(--green-lt); color: var(--green); border: 1px solid #050505; }

  /* ─── Course Cards ─────────────────────────────────────────── */
  .courses-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); border-radius: var(--radius); overflow: hidden; }
  .course-row {
    background: var(--surface);
    display: grid;
    grid-template-columns: 52px 1fr auto;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    cursor: pointer;
    transition: background var(--transition);
  }
  .course-row:hover { background: var(--surface-2); }
  .course-thumb {
    width: 52px; height: 36px;
    border-radius: 5px;
    object-fit: cover;
    background: var(--surface-2);
    flex-shrink: 0;
  }
  .course-meta { min-width: 0; }
  .course-name { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .course-sub { font-size: 11.5px; color: var(--ink-3); margin-top: 2px; }
  .course-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  /* ─── Badge ─────────────────────────────────────────────────── */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }
  .badge-green  { background: var(--green-lt);  color: var(--green); }
  .badge-amber  { background: var(--amber-lt);  color: var(--amber); }
  .badge-blue   { background: var(--accent-lt); color: var(--accent); }
  .badge-gray   { background: var(--surface-2); color: var(--ink-2); }

  /* ─── Detail Drawer ──────────────────────────────────────────── */
  .drawer-overlay {
    position: fixed; inset: 0;
    background: rgba(26,25,22,.45);
    z-index: 40;
    display: flex; justify-content: flex-end;
    animation: fadeIn .15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .drawer {
    width: 440px;
    max-width: 95vw;
    background: var(--surface);
    height: 100%;
    overflow-y: auto;
    box-shadow: -8px 0 32px rgba(0,0,0,.12);
    animation: slideIn .2s ease;
    display: flex;
    flex-direction: column;
  }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .drawer-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0;
    background: var(--surface);
    z-index: 1;
  }
  .drawer-body { padding: 24px; flex: 1; }
  .drawer-cover { width: 100%; height: 180px; object-fit: cover; border-radius: var(--radius); margin-bottom: 20px; background: var(--surface-2); }
  .drawer-title { font-family: 'DM Serif Display', serif; font-size: 22px; margin-bottom: 8px; line-height: 1.25; }
  .drawer-desc { font-size: 13.5px; color: var(--ink-2); line-height: 1.6; margin-bottom: 20px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .detail-item { background: var(--bg); border-radius: 7px; padding: 12px 14px; }
  .detail-item-label { font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px; }
  .detail-item-value { font-size: 13px; font-weight: 500; }
  .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
  .tag { background: var(--surface-2); color: var(--ink-2); padding: 3px 9px; border-radius: 20px; font-size: 11.5px; }

  /* ─── Empty ─────────────────────────────────────────────────── */
  .empty-state { padding: 40px; text-align: center; color: var(--ink-3); }
  .empty-state svg { margin-bottom: 12px; opacity: .4; }
  .empty-title { font-size: 14px; font-weight: 500; color: var(--ink-2); }
  .empty-sub { font-size: 12px; margin-top: 4px; }

  /* ─── Loading skeleton ──────────────────────────────────────── */
  .skeleton { background: linear-gradient(90deg, var(--surface-2) 25%, #E8E5DF 50%, var(--surface-2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ─── Full-page view ──────────────────────────────────────────── */
  .view-page { display: flex; flex-direction: column; height: 100%; }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  ),
  Courses: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
  ),
  Add: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Upload: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
  TrendUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  BookOpen: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Alert: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    published:   "badge-green",
    draft:       "badge-amber",
    unpublished: "badge-gray",
  };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
}

function levelBadge(level) {
  const map = { beginner: "badge-blue", intermediate: "badge-amber", advanced: "badge-gray" };
  return <span className={`badge ${map[level] || "badge-gray"}`}>{level}</span>;
}

// ─── Course Detail Drawer ──────────────────────────────────────────────────────
function CourseDrawer({ course, onClose }) {
  if (!course) return null;
  return (
    <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <div className="drawer-header">
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>Course Details</span>
          <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="drawer-body">
          {course.coverImage
            ? <img src={course.coverImage} alt={course.title} className="drawer-cover" />
            : <div className="drawer-cover" />
          }
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {statusBadge(course.status)}
            {levelBadge(course.level)}
          </div>
          <div className="drawer-title">{course.title}</div>
          <div className="drawer-desc">{course.description}</div>

          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-item-label">Subject</div>
              <div className="detail-item-value">{course.subject?.name || "—"}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Instructor</div>
              <div className="detail-item-value">{course.instructor?.name || "—"}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Duration</div>
              <div className="detail-item-value">{course.duration} hrs</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Enrolled</div>
              <div className="detail-item-value">{course.enrolledStudentsCount} / {course.enrollmentLimit}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Price</div>
              <div className="detail-item-value">{course.price} {course.currency !== "Free" ? `(${course.currency})` : ""}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item-label">Rating</div>
              <div className="detail-item-value" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "var(--amber)" }}><Icon.Star /></span>
                {course.averageRating} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>({course.totalRatings})</span>
              </div>
            </div>
          </div>

          {course.prerequisites?.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Prerequisites</div>
              <div className="tag-list">
                {course.prerequisites.map((p, i) => <span key={i} className="tag">{p}</span>)}
              </div>
            </div>
          )}

          {course.tags?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Tags</div>
              <div className="tag-list">
                {course.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 11.5, color: "var(--ink-3)" }}>
            Created {new Date(course.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── Create Course View ────────────────────────────────────────────────────────
function CreateCourseView({ subjects, token, instructorId, onSuccess }) {
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", subject: "", duration: "",
    level: "beginner", price: "free", currency: "Free",
    enrollmentLimit: 100, prerequisites: "", tags: "", status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!instructorId) return setError("Instructor not authenticated");
    if (!coverImage) return setError("Cover image is required");
    try {
      setLoading(true); setError(""); setSuccess("");
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "prerequisites" || key === "tags") {
          data.append(key, JSON.stringify(value.split(",").map(i => i.trim()).filter(Boolean)));
        } else { data.append(key, value); }
      });
      data.append("instructor", instructorId);
      data.append("coverImage", coverImage);
      await axios.post("http://localhost:5001/api/courses", data, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Course created successfully");
      setFormData({ title: "", description: "", subject: "", duration: "", level: "beginner", price: "free", currency: "Free", enrollmentLimit: 100, prerequisites: "", tags: "", status: "draft" });
      setCoverImage(null); setCoverPreview(null);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally { setLoading(false); }
  };

  return (
    <div className="content">
      <div className="panel" style={{ maxWidth: 740 }}>
        <div className="panel-header">
          <span className="panel-title">New Course</span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>All fields marked * are required</span>
        </div>
        <div className="panel-body">
          {error && <div className="alert alert-error"><Icon.Alert />{error}</div>}
          {success && <div className="alert alert-success"><Icon.Check />{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Course Title *</label>
                <input className="form-control" name="title" placeholder="e.g. Introduction to Machine Learning" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group full">
                <label className="form-label">Description *</label>
                <textarea className="form-control" name="description" placeholder="Describe what students will learn..." value={formData.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <select className="form-control" name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (hours) *</label>
                <input className="form-control" type="number" name="duration" placeholder="0" value={formData.duration} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Level</label>
                <select className="form-control" name="level" value={formData.level} onChange={handleChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input className="form-control" name="price" placeholder="e.g. free or 29.99" value={formData.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <input className="form-control" name="currency" placeholder="e.g. USD" value={formData.currency} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Enrollment Limit</label>
                <input className="form-control" type="number" name="enrollmentLimit" value={formData.enrollmentLimit} onChange={handleChange} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Prerequisites <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(comma separated)</span></label>
                <input className="form-control" name="prerequisites" placeholder="e.g. Basic Algebra, Python" value={formData.prerequisites} onChange={handleChange} />
              </div>
              <div className="form-group full">
                <label className="form-label">Tags <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(comma separated)</span></label>
                <input className="form-control" name="tags" placeholder="e.g. ml, data-science, python" value={formData.tags} onChange={handleChange} />
              </div>
              <div className="form-group full">
                <label className="form-label">Cover Image *</label>
                <label className="file-drop" htmlFor="cover-upload">
                  {coverPreview
                    ? <img src={coverPreview} alt="Preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} />
                    : <>
                        <div className="file-drop-icon"><Icon.Upload /></div>
                        <div className="file-drop-text"><strong>Click to upload</strong> or drag and drop</div>
                        <div className="file-drop-text" style={{ marginTop: 3 }}>PNG, JPG, WEBP — max 5MB</div>
                      </>
                  }
                  <input id="cover-upload" type="file" accept="image/*" onChange={handleFile} required />
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 22, width: "100%", justifyContent: "center", padding: "10px 0" }}>
              {loading ? "Creating course..." : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Courses View ──────────────────────────────────────────────────────────────
function CoursesView({ courses, loading, error }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = courses.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">All Courses</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              className="form-control"
              style={{ width: 200, padding: "6px 11px" }}
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="form-control" style={{ width: 130, padding: "6px 28px 6px 11px" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 58, borderRadius: 8 }} />
            ))}
          </div>
        )}

        {!loading && error && <div className="alert alert-error" style={{ margin: 16 }}><Icon.Alert />{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <Icon.BookOpen />
            <div className="empty-title">No courses found</div>
            <div className="empty-sub">Try adjusting your search or filters</div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="courses-list">
            {filtered.map(course => (
              <div key={course._id} className="course-row" onClick={() => setSelected(course)}>
                {course.coverImage
                  ? <img src={course.coverImage} alt={course.title} className="course-thumb" />
                  : <div className="course-thumb" />
                }
                <div className="course-meta">
                  <div className="course-name">{course.title}</div>
                  <div className="course-sub">
                    {course.subject?.name} &middot; {course.instructor?.name} &middot; <Icon.Clock /> {course.duration}h
                  </div>
                </div>
                <div className="course-actions">
                  {statusBadge(course.status)}
                  {levelBadge(course.level)}
                  <span style={{ color: "var(--ink-3)", display: "flex", alignItems: "center" }}><Icon.ChevronRight /></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <CourseDrawer course={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────
function OverviewView({ courses }) {
  const published = courses.filter(c => c.status === "published").length;
  const drafts = courses.filter(c => c.status === "draft").length;
  const totalStudents = courses.reduce((a, c) => a + (c.enrolledStudentsCount || 0), 0);
  const avgRating = courses.length
    ? (courses.reduce((a, c) => a + (c.averageRating || 0), 0) / courses.length).toFixed(1)
    : "—";

  const recentCourses = [...courses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="content">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Courses</div>
          <div className="stat-value">{courses.length}</div>
          <div className="stat-sub">{published} published, {drafts} drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{totalStudents.toLocaleString()}</div>
          <span className="stat-badge" style={{ background: "var(--green-lt)", color: "var(--green)" }}>
            <Icon.TrendUp /> Enrolled
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value">{published}</div>
          <div className="stat-sub">Live courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Rating</div>
          <div className="stat-value">{avgRating}</div>
          <div className="stat-sub">Across all courses</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Courses</span>
          </div>
          <div className="courses-list">
            {recentCourses.length === 0 && (
              <div className="empty-state"><div className="empty-title">No courses yet</div></div>
            )}
            {recentCourses.map(course => (
              <div key={course._id} className="course-row">
                {course.coverImage
                  ? <img src={course.coverImage} alt={course.title} className="course-thumb" />
                  : <div className="course-thumb" />
                }
                <div className="course-meta">
                  <div className="course-name">{course.title}</div>
                  <div className="course-sub">{course.subject?.name} &middot; {course.level}</div>
                </div>
                <div className="course-actions">{statusBadge(course.status)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Enrollment Overview</span>
          </div>
          <div className="panel-body">
            {courses.length === 0 && <div className="empty-state"><div className="empty-title">No data yet</div></div>}
            {courses.slice(0, 6).map(course => {
              const pct = course.enrollmentLimit > 0 ? Math.round((course.enrolledStudentsCount / course.enrollmentLimit) * 100) : 0;
              return (
                <div key={course._id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-3)", flexShrink: 0 }}>{course.enrolledStudentsCount} / {course.enrollmentLimit}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "var(--green)" : "var(--accent)", borderRadius: 99, transition: "width .4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
function CourseDashboard() {
  const [view, setView] = useState("overview");
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const token = localStorage.getItem("token");
  let instructorId = null;
  const {user} = useAppContext()
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      instructorId = decoded.id || decoded.userId || decoded._id;
    } catch {}
  }

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/subjects", { headers: { Authorization: `Bearer ${token}` } });
        setSubjects(res.data.subjects || []);
      } catch {}
    };
    fetchSubjects();
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await axios.get("http://localhost:5001/api/courses", { headers: { Authorization: `Bearer ${token}` } });
        setCourses(res.data.data || []);
      } catch {
        setErrorCourses("Failed to fetch courses");
      } finally { setLoadingCourses(false); }
    };
    fetchCourses();
  }, [token, refreshKey]);

  const navItems = [
    { id: "overview", label: "Overview", icon: <Icon.Dashboard /> },
    { id: "courses", label: "All Courses", icon: <Icon.Courses /> },
    { id: "create", label: "New Course", icon: <Icon.Add /> },
  ];

  const topbarTitles = { overview: "Dashboard", courses: "All Courses", create: "Create New Course" };
 

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Instructor, <span></span>{user?.email}</h1>
          </div>

          <div className="nav-label">Navigation</div>
          {navItems.map(item => (
            <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
              {item.icon}
              {item.label}
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar">{user?.name ? user.name.slice(0,2).toUpperCase(): "NA"}</div>
              <div>
                <div className="user-name">Instructor</div>
                <div className="user-role">{user?.name || 'unavailble'}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <span className="topbar-title">{topbarTitles[view]}</span>
            <div className="topbar-right">
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {courses.length} course{courses.length !== 1 ? "s" : ""}
              </span>
              {view !== "create" && (
                <button className="btn btn-primary" onClick={() => setView("create")}>
                  <Icon.Add /> New Course
                </button>
              )}
            </div>
          </header>

          {view === "overview" && <OverviewView courses={courses} />}
          {view === "courses" && <CoursesView courses={courses} loading={loadingCourses} error={errorCourses} />}
          {view === "create" && (
            <CreateCourseView
              subjects={subjects}
              token={token}
              instructorId={instructorId}
              onSuccess={() => { setRefreshKey(k => k + 1); setView("courses"); }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CourseDashboard;