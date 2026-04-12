import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/users";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f0f4f8;
    color: #0f172a;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  .dashboard {
    display: flex;
    min-height: 100vh;
    background: #f0f4f8;
  }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    min-height: 100vh;
    background: #1d4ed8;
    border-right: 1px solid #1e40af;
    display: flex;
    flex-direction: column;
    padding: 32px 0;
    position: fixed;
    top: 0; left: 0;
    z-index: 10;
  }

  .sidebar-logo {
    padding: 0 24px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    margin-bottom: 24px;
  }

  .sidebar-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 0.02em;
  }

  .sidebar-logo-sub {
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-top: 2px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.01em;
  }

  .nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.1); }
  .nav-item.active { color: #ffffff; background: rgba(255,255,255,0.18); }

  .nav-item svg { opacity: 0.7; flex-shrink: 0; }
  .nav-item.active svg { opacity: 1; }

  /* MAIN */
  .main {
    margin-left: 220px;
    flex: 1;
    padding: 40px 48px;
    min-height: 100vh;
  }

  /* TOPBAR */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: #0f172a;
    letter-spacing: 0.01em;
  }

  .page-subtitle {
    font-size: 12px;
    color: #64748b;
    margin-top: 3px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 9px 14px;
    width: 240px;
    transition: border-color 0.15s;
  }

  .search-box:focus-within { border-color: #1d4ed8; }

  .search-box input {
    background: none;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #0f172a;
    width: 100%;
  }

  .search-box input::placeholder { color: #94a3b8; }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #1d4ed8;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 9px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.01em;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-primary:hover { background: #1e40af; }

  /* STATS */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px 22px;
  }

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 400;
    color: #0f172a;
    line-height: 1;
  }

  .stat-change {
    font-size: 11px;
    color: #15803d;
    margin-top: 6px;
  }

  /* TABLE */
  .table-container {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .table-title {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead tr {
    border-bottom: 1px solid #f1f5f9;
  }

  th {
    padding: 13px 24px;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #94a3b8;
    text-align: left;
  }

  tbody tr {
    border-bottom: 1px solid #f8fafc;
    transition: background 0.12s ease;
    cursor: pointer;
  }

  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #f8fafc; }

  td {
    padding: 16px 24px;
    font-size: 13px;
    color: #475569;
    vertical-align: middle;
  }

  .td-instructor {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: #e2e8f0;
    flex-shrink: 0;
  }

  .instructor-name {
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
    margin-bottom: 1px;
  }

  .instructor-role {
    font-size: 11px;
    color: #94a3b8;
    text-transform: capitalize;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.03em;
  }

  .badge-active {
    background: rgba(21, 128, 61, 0.1);
    color: #15803d;
  }

  .badge-inactive {
    background: rgba(185, 28, 28, 0.1);
    color: #b91c1c;
  }

  .badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .badge-active .badge-dot { background: #15803d; }
  .badge-inactive .badge-dot { background: #b91c1c; }

  .verified-icon { color: #15803d; }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    color: #94a3b8;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
  }

  .action-btn:hover { background: #f1f5f9; color: #475569; }
  .action-btn.delete:hover { color: #b91c1c; background: rgba(185,28,28,0.08); }

  /* DETAIL PANEL */
  .detail-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.5);
    z-index: 50;
    display: flex;
    justify-content: flex-end;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .detail-panel {
    width: 420px;
    height: 100vh;
    background: #ffffff;
    border-left: 1px solid #e2e8f0;
    overflow-y: auto;
    animation: slideIn 0.25s ease;
    display: flex;
    flex-direction: column;
  }

  .panel-head {
    padding: 28px 28px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background: #1d4ed8;
  }

  .panel-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
  }

  .panel-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
    margin-top: 12px;
    margin-bottom: 3px;
  }

  .panel-email { font-size: 12px; color: rgba(255,255,255,0.6); }

  .close-btn {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .close-btn:hover { color: #ffffff; background: rgba(255,255,255,0.25); }

  .panel-body { padding: 24px 28px; flex: 1; }

  .section-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #94a3b8;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }

  .detail-item-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
    margin-bottom: 4px;
  }

  .detail-item-value {
    font-size: 13px;
    color: #334155;
    font-weight: 400;
  }

  .detail-item-value.mono {
    font-family: monospace;
    font-size: 12px;
    color: #475569;
    word-break: break-all;
  }

  .address-block {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 16px;
    font-size: 13px;
    color: #475569;
    line-height: 1.7;
    margin-bottom: 28px;
  }

  .panel-actions {
    display: flex;
    gap: 10px;
    padding: 20px 28px;
    border-top: 1px solid #f1f5f9;
  }

  .btn-outline {
    flex: 1;
    padding: 10px;
    border: 1px solid #cbd5e1;
    background: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s;
    font-weight: 500;
  }

  .btn-outline:hover { border-color: #1d4ed8; color: #1d4ed8; }

  .btn-danger {
    flex: 1;
    padding: 10px;
    border: 1px solid rgba(185,28,28,0.3);
    background: rgba(185,28,28,0.05);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #b91c1c;
    cursor: pointer;
    transition: all 0.15s;
    font-weight: 500;
  }

  .btn-danger:hover { border-color: #b91c1c; background: rgba(185,28,28,0.1); }

  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.6);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
    animation: fadeIn 0.2s ease;
  }

  .modal {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.25s ease;
    box-shadow: 0 40px 80px rgba(15,23,42,0.2);
  }

  .modal-head {
    padding: 24px 28px 20px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1d4ed8;
    border-radius: 14px 14px 0 0;
  }

  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
  }

  .modal-head .close-btn {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
  }

  .modal-head .close-btn:hover { color: #ffffff; background: rgba(255,255,255,0.25); }

  .modal-body { padding: 24px 28px; }

  .form-section {
    margin-bottom: 24px;
  }

  .form-section-title {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #94a3b8;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
    margin-bottom: 6px;
  }

  .form-input, .form-select {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s;
    appearance: none;
  }

  .form-input:focus, .form-select:focus { border-color: #1d4ed8; background: #ffffff; }
  .form-input::placeholder { color: #cbd5e1; }

  .form-select option { background: #fff; }

  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .checkbox-row input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #1d4ed8;
    cursor: pointer;
  }

  .checkbox-label {
    font-size: 13px;
    color: #475569;
    cursor: pointer;
  }

  .modal-footer {
    padding: 16px 28px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #f1f5f9;
  }

  .btn-cancel {
    padding: 9px 18px;
    background: none;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-cancel:hover { border-color: #cbd5e1; color: #334155; }

  .btn-submit {
    padding: 9px 22px;
    background: #1d4ed8;
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-submit:hover { background: #1e40af; }

  .empty-state {
    text-align: center;
    padding: 60px;
    color: #cbd5e1;
    font-size: 14px;
  }

  .toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 12px 18px;
    font-size: 13px;
    color: #f8fafc;
    z-index: 999;
    animation: slideUp 0.2s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

// ICONS (minimal SVG)
const Icon = {
  Users: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Close: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Mail: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.47 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.84-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>,
  Grid: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>,
};

const INITIAL_FORM = {
  name: "", email: "", password: "", phone: "",
  profilePicture: "", dateOfBirth: "", gender: "",
  role: "instructor", isActive: true,
  address: { street: "", city: "", state: "", postalCode: "", country: "Sri Lanka" }
};

export default function InstructManage() {
    const [loggedUser, setLoggedUser] = useState(null)
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${API}/instructors/all`);
      setInstructors(res.data);
    } catch {
      setInstructors([]);
    }
  };

  useEffect(() => { fetchInstructors(); const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setLoggedUser(storedUser);}, []);

  const handleAddressChange = (e) =>
    setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await axios.put(`${API}/${selected._id}`, form);
        showToast("Instructor updated successfully");
      } else {
        await axios.post(`${API}/register`, form);
        showToast("Instructor created successfully");
      }
      setShowModal(false);
      setSelected(null);
      setForm(INITIAL_FORM);
      fetchInstructors();
    } catch (err) {
      showToast(err.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (user) => {
    setSelected(user);
    setForm({ ...user, password: "", address: user.address || INITIAL_FORM.address });
    setDetailUser(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this instructor permanently?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setDetailUser(null);
      fetchInstructors();
      showToast("Instructor removed");
    } catch {
      showToast("Failed to delete");
    }
  };

  const filtered = instructors.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: instructors.length,
    active: instructors.filter(i => i.isActive).length,
    verified: instructors.filter(i => i.emailVerified).length,
    inactive: instructors.filter(i => !i.isActive).length,
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-text">{loggedUser?.email}Elysiannnbn</div>
            <div className="sidebar-logo-sub">Admin Consolec</div>
          </div>
          <nav className="sidebar-nav">
            {[
              { label: "Overview", icon: <Icon.Grid /> },
              { label: "Instructors", icon: <Icon.Users />, active: true },
              { label: "Settings", icon: <Icon.Settings /> },
            ].map((item) => (
              <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="page-title">Instructors</div>
              <div className="page-subtitle">Manage your teaching staff</div>
            </div>
            <div className="topbar-right">
              <div className="search-box">
                <Icon.Search />
                <input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="btn-primary"
                onClick={() => { setSelected(null); setForm(INITIAL_FORM); setShowModal(true); }}
              >
                <Icon.Plus /> Add Instructor
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            {[
              { label: "Total Instructors", value: stats.total },
              { label: "Active", value: stats.active },
              { label: "Email Verified", value: stats.verified },
              { label: "Inactive", value: stats.inactive },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{String(s.value).padStart(2, "0")}</div>
              </div>
            ))}
          </div>

          {/* TABLE */}
          <div className="table-container">
            <div className="table-header">
              <span className="table-title">{filtered.length} records</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Contact</th>
                  <th>Joined</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6"><div className="empty-state">No instructors found</div></td></tr>
                ) : filtered.map((inst) => (
                  <tr key={inst._id} onClick={() => setDetailUser(inst)}>
                    <td>
                      <div className="td-instructor">
                        <img
                          className="avatar"
                          src={inst.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(inst.name)}&background=dbeafe&color=1d4ed8&size=72`}
                          alt={inst.name}
                        />
                        <div>
                          <div className="instructor-name">{inst.name}</div>
                          <div className="instructor-role">{inst.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: "#475569", marginBottom: 2 }}>{inst.email}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{inst.phone || "—"}</div>
                    </td>
                    <td>{formatDate(inst.createdAt)}</td>
                    <td>
                      {inst.emailVerified
                        ? <span style={{ color: "#15803d", display: "flex", alignItems: "center", gap: 5 }}><Icon.Check /> Verified</span>
                        : <span style={{ color: "#94a3b8", fontSize: 13 }}>Pending</span>
                      }
                    </td>
                    <td>
                      <span className={`badge ${inst.isActive ? "badge-active" : "badge-inactive"}`}>
                        <span className="badge-dot" />
                        {inst.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="action-btn" onClick={() => handleEdit(inst)} title="Edit">
                        <Icon.Edit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(inst._id)} title="Delete">
                        <Icon.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* DETAIL PANEL */}
      {detailUser && (
        <div className="detail-overlay" onClick={() => setDetailUser(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <img
                  className="panel-avatar"
                  src={detailUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(detailUser.name)}&background=1e40af&color=ffffff&size=112`}
                  alt={detailUser.name}
                />
                <div className="panel-name">{detailUser.name}</div>
                <div className="panel-email">{detailUser.email}</div>
              </div>
              <button className="close-btn" onClick={() => setDetailUser(null)}>
                <Icon.Close />
              </button>
            </div>

            <div className="panel-body">
              <div className="section-label">Personal Information</div>
              <div className="detail-grid">
                {[
                  { label: "Role", value: detailUser.role },
                  { label: "Gender", value: detailUser.gender || "—" },
                  { label: "Date of Birth", value: formatDate(detailUser.dateOfBirth) },
                  { label: "Phone", value: detailUser.phone || "—" },
                  { label: "Status", value: detailUser.isActive ? "Active" : "Inactive" },
                  { label: "Email Verified", value: detailUser.emailVerified ? "Yes" : "No" },
                  { label: "Last Login", value: formatDate(detailUser.lastLogin) },
                  { label: "Member Since", value: formatDate(detailUser.createdAt) },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="detail-item-label">{item.label}</div>
                    <div className="detail-item-value">{item.value}</div>
                  </div>
                ))}
              </div>

              {detailUser.address && (
                <>
                  <div className="section-label">Address</div>
                  <div className="address-block">
                    {[
                      detailUser.address.street,
                      detailUser.address.city,
                      detailUser.address.state,
                      detailUser.address.postalCode,
                      detailUser.address.country
                    ].filter(Boolean).join(", ") || "No address on record"}
                  </div>
                </>
              )}

              <div className="section-label">Account</div>
              <div style={{ marginBottom: 28 }}>
                <div className="detail-item-label">User ID</div>
                <div className="detail-item-value mono">{detailUser._id}</div>
              </div>
            </div>

            <div className="panel-actions">
              <button className="btn-outline" onClick={() => handleEdit(detailUser)}>
                Edit Profile
              </button>
              <button className="btn-danger" onClick={() => handleDelete(detailUser._id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">{selected ? "Edit Instructor" : "New Instructor"}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <Icon.Close />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {/* BASIC */}
                <div className="form-section">
                  <div className="form-section-title">Basic Information</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="John Doe" required
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="john@example.com" required
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>

                  {!selected && (
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input className="form-input" type="password" placeholder="Min. 6 characters" required
                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+94 77 000 0000"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Profile Picture URL</label>
                      <input className="form-input" placeholder="https://..."
                        value={form.profilePicture} onChange={(e) => setForm({ ...form, profilePicture: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* PERSONAL */}
                <div className="form-section">
                  <div className="form-section-title">Personal Details</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input className="form-input" type="date"
                        value={form.dateOfBirth || ""}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-select" value={form.gender || ""}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="form-section">
                  <div className="form-section-title">Address</div>
                  <div className="form-group">
                    <label className="form-label">Street</label>
                    <input className="form-input" name="street" placeholder="123 Main Street"
                      value={form.address?.street || ""} onChange={handleAddressChange} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" name="city" placeholder="Colombo"
                        value={form.address?.city || ""} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State / Province</label>
                      <input className="form-input" name="state" placeholder="Western"
                        value={form.address?.state || ""} onChange={handleAddressChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input className="form-input" name="postalCode" placeholder="00100"
                        value={form.address?.postalCode || ""} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <input className="form-input" name="country" placeholder="Sri Lanka"
                        value={form.address?.country || ""} onChange={handleAddressChange} />
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div className="form-section">
                  <div className="form-section-title">Account Status</div>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    <span className="checkbox-label">Mark as active instructor</span>
                  </label>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {selected ? "Save Changes" : "Create Instructor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span style={{ color: "#22c55e" }}><Icon.Check /></span>
          {toast}
        </div>
      )}
    </>
  );
}