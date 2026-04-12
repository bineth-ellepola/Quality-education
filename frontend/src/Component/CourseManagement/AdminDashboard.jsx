import React, { useEffect, useState } from "react";
import axios from "axios";
import ComplainReply from "./Complaints/ComplainReply";
const useAppContext = () => {
  const [user, setUser] = React.useState({ name: "Admin", email: "admin@example.com" });
  return { user, setUser };
};
const useNavigate = () => (path) => console.log("Navigate to:", path);

let _setToastGlobal = null;
const toast = {
  success: (msg) => _setToastGlobal?.({ msg, type: "success" }),
  error:   (msg) => _setToastGlobal?.({ msg, type: "error" }),
  info:    (msg) => _setToastGlobal?.({ msg, type: "info" }),
};

const USERS_API   = "http://localhost:5001/api/users";
const ADMIN_API   = "http://localhost:5001/api/admin";

const Icon = {
  Users:        () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/></svg>,
  Search:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Plus:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Edit:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Close:        () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Check:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>,
  Grid:         () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Archive:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  Restore:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
  Loader:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  User:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Bell:         () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

const INITIAL_FORM = {
  name: "", email: "", password: "", phone: "",
  profilePicture: "", dateOfBirth: "", gender: "",
  role: "instructor", isActive: true,
  address: { street: "", city: "", state: "", postalCode: "", country: "Sri Lanka" }
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  .merged-root {
    display: flex;
    min-height: 100vh;
    background: #ffffff;
    color: #000000;
    font-family: 'DM Sans', sans-serif;
  }

  /* ══════ SIDEBAR ══════ */
  .sidebar {
    width: 220px;
    min-height: 100vh;
    background: #162436;
    border-right: 1px solid #f6f9ee;
    display: flex;
    flex-direction: column;
    padding: 32px 0 24px;
    position: fixed;
    top: 0; left: 0;
    z-index: 10;
  }
  .sidebar-logo {
    padding: 0 24px 32px;
    border-bottom: 1px solid #fcf8f8;
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
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-top: 2px;
  }
  .sidebar-section-label {
    padding: 0 24px 8px;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #f4f1f1;
    margin-top: 8px;
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
    color: #ffffff;
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.01em;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .nav-item:hover { color: #f0470f; background: #181818; }
  .nav-item.active { color: #e8e8e3; background: #ff4628; }
  .nav-item svg { opacity: 0.6; flex-shrink: 0; }
  .nav-item.active svg { opacity: 1; }
  .sidebar-footer {
    padding: 20px 12px 0;
    border-top: 1px solid #fcf8f8;
    margin-top: auto;
  }
  .sidebar-user-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 4px 12px;
  }
  .sidebar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #f9f4f4;
    border: 1px solid #2a2a2a;
    display: flex; align-items: center; justify-content: center;
    color: #ff4628;
    flex-shrink: 0;
  }
  .sidebar-user-name {
    font-size: 13px; font-weight: 500; color: #e8e8e3;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sidebar-user-email {
    font-size: 11px; color: #ffffff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sidebar-logout-btn {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 12px; border-radius: 6px;
    font-size: 13px; font-weight: 500;
    color: #f70a0a; cursor: pointer; border: none;
    background: rgb(17, 12, 12);
    width: 100%; transition: background 0.15s;
  }
  .sidebar-logout-btn:hover { background: rgba(244, 239, 239, 0.92); }

  /* ══════ MAIN ══════ */
  .main {
    margin-left: 220px;
    flex: 1;
    padding: 40px 48px;
    min-height: 100vh;
  }
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
    color: #ff4628;
    letter-spacing: 0.01em;
  }
  .page-subtitle {
    font-size: 12px;
    color: #131313;
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
    background: #141414;
    border: 1px solid #1e1e1e;
    border-radius: 8px;
    padding: 9px 14px;
    width: 240px;
    transition: border-color 0.15s;
  }
  .search-box:focus-within { border-color: #f8f3f3; }
  .search-box input {
    background: none;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #e8e8e3;
    width: 100%;
  }
  .search-box input::placeholder { color: #444; }
  .btn-primary {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #ff4628;
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
  .btn-primary:hover { background: #d0d0cb; }

  /* ══════ STATS ══════ */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .stats-row-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: #111111;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    padding: 20px 22px;
  }
  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f6f3f3;
    margin-bottom: 8px;
  }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 400;
    color: #ffffff;
    line-height: 1;
  }

  /* ══════ TABLE ══════ */
  .table-container {
    background: #111111;
    border: 1px solid #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
  }
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #1a1a1a;
  }
  .table-title {
    font-size: 13px;
    font-weight: 500;
    color: #f6f3f3;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid #171717; }
  th {
    padding: 13px 24px;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #f6f3f3;
    text-align: left;
  }
  tbody tr {
    border-bottom: 1px solid #151515;
    transition: background 0.12s ease;
    cursor: pointer;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #141414; }
  td {
    padding: 16px 24px;
    font-size: 13px;
    color: #f7f2f2;
    vertical-align: middle;
  }
  .td-instructor { display: flex; align-items: center; gap: 14px; }
  .avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: #1e1e1e;
    flex-shrink: 0;
  }
  .instructor-name { font-size: 14px; font-weight: 500; color: #eeee13; margin-bottom: 1px; }
  .instructor-role { font-size: 11px; color: #ffffff; text-transform: capitalize; }
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
  .badge-active   { background: rgb(240, 245, 242); color: #ee1313; }
  .badge-inactive { background: rgba(150,60,60,0.12); color: #963c3c; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-active .badge-dot   { background: #f50909; }
  .badge-inactive .badge-dot { background: #963c3c; }
  .action-btn {
    background: none; border: none; cursor: pointer;
    padding: 6px 8px; border-radius: 6px;
    color: #444; transition: all 0.15s;
    display: inline-flex; align-items: center;
  }
  .action-btn:hover { background: #1a1a1a; color: #888; }
  .action-btn.delete:hover { color: #963c3c; background: rgba(150,60,60,0.08); }
  .action-btn.restore:hover { color: #4a7c59; background: rgba(74,124,89,0.08); }

  /* ══════ ARCHIVE TABLE ══════ */
  .archive-table thead th { color: #3a3a3a; }
  .archive-table thead th:last-child { text-align: right; }
  .course-title { font-weight: 500; color: #e8e8e3; font-size: 13.5px; line-height: 1.3; }
  .archive-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: #1a1a1a;
    color: #888;
    border: 1px solid #222;
    white-space: nowrap;
  }
  .date-main { font-size: 13px; font-weight: 500; color: #aaa; font-family: 'DM Mono', monospace; }
  .date-time { font-size: 11px; color: #444; font-family: 'DM Mono', monospace; margin-top: 2px; }
  .reason-text { font-size: 12.5px; color: #666; max-width: 200px; line-height: 1.45; }
  .reason-empty { color: #333; font-style: italic; font-size: 12.5px; }
  .archive-actions { display: flex; justify-content: flex-end; gap: 6px; }

  /* ══════ LOADING / EMPTY ══════ */
  .loading-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; padding: 80px 0;
    color: #444; font-size: 13px;
  }
  .spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 72px 0; text-align: center;
  }
  .empty-icon {
    width: 48px; height: 48px;
    border-radius: 12px; background: #1a1a1a;
    border: 1px solid #222;
    display: flex; align-items: center; justify-content: center;
    color: #333; margin-bottom: 14px;
  }
  .empty-title { font-size: 14px; font-weight: 500; color: #555; margin-bottom: 4px; }
  .empty-sub   { font-size: 13px; color: #333; max-width: 220px; }

  /* ══════ DETAIL PANEL ══════ */
  .detail-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 50; display: flex; justify-content: flex-end;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .detail-panel {
    width: 420px; height: 100vh;
    background: #111111; border-left: 1px solid #1e1e1e;
    overflow-y: auto; animation: slideIn 0.25s ease;
    display: flex; flex-direction: column;
  }
  .panel-head {
    padding: 28px 28px 24px; border-bottom: 1px solid #1a1a1a;
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .panel-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #1e1e1e; }
  .panel-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: #e8e8e3; margin-top: 12px; margin-bottom: 3px; }
  .panel-email { font-size: 12px; color: #555; }
  .close-btn {
    background: #1a1a1a; border: 1px solid #222; color: #555; cursor: pointer;
    width: 28px; height: 28px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; flex-shrink: 0;
  }
  .close-btn:hover { color: #e8e8e3; background: #222; }
  .panel-body { padding: 24px 28px; flex: 1; }
  .section-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
    color: #333; margin-bottom: 14px; padding-bottom: 8px;
    border-bottom: 1px solid #181818;
  }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
  .detail-item-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #3a3a3a; margin-bottom: 4px; }
  .detail-item-value { font-size: 13px; color: #aaa; font-weight: 400; }
  .detail-item-value.mono { font-family: monospace; font-size: 12px; color: #888; word-break: break-all; }
  .address-block {
    background: #0e0e0e; border: 1px solid #191919; border-radius: 8px;
    padding: 14px 16px; font-size: 13px; color: #888; line-height: 1.7; margin-bottom: 28px;
  }
  .panel-actions { display: flex; gap: 10px; padding: 20px 28px; border-top: 1px solid #1a1a1a; }
  .btn-outline {
    flex: 1; padding: 10px; border: 1px solid #222; background: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; cursor: pointer; transition: all 0.15s; font-weight: 500;
  }
  .btn-outline:hover { border-color: #333; color: #e8e8e3; }
  .btn-danger {
    flex: 1; padding: 10px; border: 1px solid rgba(150,60,60,0.3);
    background: rgba(150,60,60,0.06); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #963c3c; cursor: pointer; transition: all 0.15s; font-weight: 500;
  }
  .btn-danger:hover { border-color: #963c3c; background: rgba(150,60,60,0.12); }

  /* ══════ MODAL ══════ */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    z-index: 100; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(3px); animation: fadeIn 0.2s ease;
  }
  .modal {
    background: #111; border: 1px solid #1e1e1e; border-radius: 14px;
    width: 480px; max-height: 90vh; overflow-y: auto;
    animation: slideUp 0.25s ease; box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  }
  .modal-head {
    padding: 24px 28px 20px; border-bottom: 1px solid #1a1a1a;
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 400; color: #e8e8e3; }
  .modal-body  { padding: 24px 28px; }
  .form-section     { margin-bottom: 24px; }
  .form-section-title {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
    color: #333; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #181818;
  }
  .form-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-group { margin-bottom: 12px; }
  .form-label {
    display: block; font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.08em; color: #444; margin-bottom: 6px;
  }
  .form-input, .form-select {
    width: 100%; background: #0e0e0e; border: 1px solid #1e1e1e;
    border-radius: 7px; padding: 9px 12px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #e8e8e3;
    outline: none; transition: border-color 0.15s; appearance: none;
  }
  .form-input:focus, .form-select:focus { border-color: #2e2e2e; }
  .form-input::placeholder { color: #333; }
  .form-select option { background: #111; }
  .form-textarea {
    width: 100%; background: #0e0e0e; border: 1px solid #1e1e1e;
    border-radius: 7px; padding: 9px 12px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #e8e8e3;
    outline: none; transition: border-color 0.15s;
    resize: vertical; min-height: 100px;
  }
  .form-textarea:focus { border-color: #2e2e2e; }
  .form-textarea::placeholder { color: #333; }
  .checkbox-row { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .checkbox-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #e8e8e3; cursor: pointer; }
  .checkbox-label { font-size: 13px; color: #888; cursor: pointer; }
  .modal-footer {
    padding: 16px 28px 24px;
    display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #1a1a1a;
  }
  .btn-cancel {
    padding: 9px 18px; background: none; border: 1px solid #222; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; cursor: pointer; transition: all 0.15s;
  }
  .btn-cancel:hover { border-color: #333; color: #999; }
  .btn-submit {
    padding: 9px 22px; background: #e8e8e3; border: none; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #0c0c0c;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-submit:hover { background: #d0d0cb; }

  /* ══════ NOTICE DETAIL PANEL ══════ */
  .notice-detail-panel {
    width: 460px; height: 100vh;
    background: #111111; border-left: 1px solid #1e1e1e;
    overflow-y: auto; animation: slideIn 0.25s ease;
    display: flex; flex-direction: column;
  }
  .notice-body-text {
    font-size: 14px; color: #aaa; line-height: 1.75;
    background: #0e0e0e; border: 1px solid #191919;
    border-radius: 8px; padding: 16px 18px;
    margin-bottom: 24px; white-space: pre-wrap;
  }
  .notice-meta-row {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 10px;
  }
  .notice-meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #3a3a3a; width: 90px; flex-shrink: 0; }
  .notice-meta-value { font-size: 13px; color: #888; }
  .published-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(74,124,89,0.12); color: #4a7c59;
    border: 1px solid rgba(74,124,89,0.2);
  }
  .unpublished-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(150,60,60,0.1); color: #963c3c;
    border: 1px solid rgba(150,60,60,0.2);
  }

  /* ══════ TOAST ══════ */
  .toast {
    position: fixed; bottom: 32px; right: 32px;
    background: #1a1a1a; border: 1px solid #2a2a2a;
    border-radius: 8px; padding: 12px 18px;
    font-size: 13px; color: #e8e8e3;
    z-index: 999; animation: slideUp 0.2s ease;
    display: flex; align-items: center; gap: 10px;
    max-width: 320px;
  }
`;

// ─── SECTION 1: Instructor Management ─────────────────────────────────────
function InstructorSection() {
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(null);
  const [detailUser, setDetailUser]   = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState(INITIAL_FORM);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${USERS_API}/instructors/all`);
      setInstructors(res.data);
    } catch {
      setInstructors([]);
    }
  };

  useEffect(() => { fetchInstructors(); }, []);

  const handleAddressChange = (e) =>
    setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await axios.put(`${USERS_API}/${selected._id}`, form);
        toast.success("Instructor updated successfully");
      } else {
        await axios.post(`${USERS_API}/register`, form);
        toast.success("Instructor created successfully");
      }
      setShowModal(false);
      setSelected(null);
      setForm(INITIAL_FORM);
      fetchInstructors();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
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
      await axios.delete(`${USERS_API}/${id}`);
      setDetailUser(null);
      fetchInstructors();
      toast.success("Instructor removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = instructors.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:    instructors.length,
    active:   instructors.filter(i => i.isActive).length,
    verified: instructors.filter(i => i.emailVerified).length,
    inactive: instructors.filter(i => !i.isActive).length,
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <>
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

      <div className="stats-row">
        {[
          { label: "Total Instructors", value: stats.total },
          { label: "Active",            value: stats.active },
          { label: "Email Verified",    value: stats.verified },
          { label: "Inactive",          value: stats.inactive },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{String(s.value).padStart(2, "0")}</div>
          </div>
        ))}
      </div>

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
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-icon"><Icon.Users /></div>
                    <div className="empty-title">No instructors found</div>
                    <div className="empty-sub">Add your first instructor to get started.</div>
                  </div>
                </td>
              </tr>
            ) : filtered.map((inst) => (
              <tr key={inst._id} onClick={() => setDetailUser(inst)}>
                <td>
                  <div className="td-instructor">
                    <img
                      className="avatar"
                      src={inst.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(inst.name)}&background=1a1a1a&color=888&size=72`}
                      alt={inst.name}
                    />
                    <div>
                      <div className="instructor-name">{inst.name}</div>
                      <div className="instructor-role">{inst.role}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: "#777", marginBottom: 2 }}>{inst.email}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{inst.phone || "—"}</div>
                </td>
                <td>{formatDate(inst.createdAt)}</td>
                <td>
                  {inst.emailVerified
                    ? <span style={{ color: "#4a7c59", display: "flex", alignItems: "center", gap: 5 }}><Icon.Check /> Verified</span>
                    : <span style={{ color: "#444", fontSize: 13 }}>Pending</span>
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

      {detailUser && (
        <div className="detail-overlay" onClick={() => setDetailUser(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <img
                  className="panel-avatar"
                  src={detailUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(detailUser.name)}&background=1a1a1a&color=888&size=112`}
                  alt={detailUser.name}
                />
                <div className="panel-name">{detailUser.name}</div>
                <div className="panel-email">{detailUser.email}</div>
              </div>
              <button className="close-btn" onClick={() => setDetailUser(null)}><Icon.Close /></button>
            </div>
            <div className="panel-body">
              <div className="section-label">Personal Information</div>
              <div className="detail-grid">
                {[
                  { label: "Role",           value: detailUser.role },
                  { label: "Gender",         value: detailUser.gender || "—" },
                  { label: "Date of Birth",  value: formatDate(detailUser.dateOfBirth) },
                  { label: "Phone",          value: detailUser.phone || "—" },
                  { label: "Status",         value: detailUser.isActive ? "Active" : "Inactive" },
                  { label: "Email Verified", value: detailUser.emailVerified ? "Yes" : "No" },
                  { label: "Last Login",     value: formatDate(detailUser.lastLogin) },
                  { label: "Member Since",   value: formatDate(detailUser.createdAt) },
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
                      detailUser.address.street, detailUser.address.city,
                      detailUser.address.state,  detailUser.address.postalCode,
                      detailUser.address.country,
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
              <button className="btn-outline" onClick={() => handleEdit(detailUser)}>Edit Profile</button>
              <button className="btn-danger"  onClick={() => handleDelete(detailUser._id)}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">{selected ? "Edit Instructor" : "New Instructor"}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}><Icon.Close /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
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
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">
                  {selected ? "Save Changes" : "Create Instructor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── SECTION: Admin Notices ────────────────────────────────────────────────
function AdminNoticeSection() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [detailNotice, setDetailNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const NOTICE_INITIAL_FORM = {
    title: "",
    description: "",
    isPublished: true,
  };
  const [form, setForm] = useState(NOTICE_INITIAL_FORM);

  const API = "http://localhost:5001/api/admin/notice/";

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}all`);
      setNotices(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.title || !form.description) {
        return toast.error("Title and Description are required");
      }
      const storedUser = localStorage.getItem("user");
      const adminName = storedUser ? JSON.parse(storedUser)?.name : "Admin";
      const payload = { ...form, createdBy: adminName };
      await axios.post(API, payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Admin notice created!");
      setShowModal(false);
      setForm(NOTICE_INITIAL_FORM);
      fetchNotices();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating notice");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await axios.delete(`${API}${id}`);
      toast.success("Notice deleted");
      setDetailNotice(null);
      fetchNotices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notice");
    }
  };

  const filtered = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <div className="page-title">Announcements</div>
          <div className="page-subtitle">Manage admin notices &amp; announcements</div>
        </div>
        <div className="topbar-right">
          <div className="search-box">
            <Icon.Search />
            <input
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => { setForm(NOTICE_INITIAL_FORM); setShowModal(true); }}
          >
            <Icon.Plus /> Add Notice
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row-2">
        <div className="stat-card">
          <div className="stat-label">Total Notices</div>
          <div className="stat-value">{String(notices.length).padStart(2, "0")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Filtered Results</div>
          <div className="stat-value">{String(filtered.length).padStart(2, "0")}</div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-header">
          <span className="table-title">{filtered.length} notices</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="spin"><Icon.Loader /></span>
            <span>Loading notices…</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="archive-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th>Published</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-icon"><Icon.Bell /></div>
                        <div className="empty-title">No notices found</div>
                        <div className="empty-sub">
                          {search ? "No results match your search." : "There are no notices yet."}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((n) => (
                  <tr key={n._id} onClick={() => setDetailNotice(n)}>
                    <td><div className="course-title">{n.title}</div></td>
                    <td>
                      <span className="reason-text">
                        {(n.description || "").length > 60
                          ? (n.description || "").slice(0, 60) + "…"
                          : (n.description || "")}
                      </span>
                    </td>
                    <td><span className="archive-badge">{n.createdBy}</span></td>
                    <td>
                      {n.isPublished
                        ? <span className="published-badge"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4a7c59", display: "inline-block" }} /> Published</span>
                        : <span className="unpublished-badge"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#963c3c", display: "inline-block" }} /> Draft</span>
                      }
                    </td>
                    <td>
                      <div className="date-main">{formatDate(n.createdAt)}</div>
                    </td>
                    <td>
                      <div className="archive-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(n._id)}
                          title="Delete Notice"
                        >
                          <Icon.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL PANEL — fully styled, matching the rest of the dashboard */}
      {detailNotice && (
        <div className="detail-overlay" onClick={() => setDetailNotice(null)}>
          <div className="notice-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#1a1a1a", border: "1px solid #222",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#ff4628", marginBottom: 14,
                }}>
                  <Icon.Bell />
                </div>
                <div className="panel-name">{detailNotice.title}</div>
                <div style={{ marginTop: 6 }}>
                  {detailNotice.isPublished
                    ? <span className="published-badge"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4a7c59", display: "inline-block" }} /> Published</span>
                    : <span className="unpublished-badge"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#963c3c", display: "inline-block" }} /> Draft</span>
                  }
                </div>
              </div>
              <button className="close-btn" onClick={() => setDetailNotice(null)}><Icon.Close /></button>
            </div>

            <div className="panel-body">
              <div className="section-label">Notice Content</div>
              <div className="notice-body-text">{detailNotice.description}</div>

              <div className="section-label">Details</div>
              <div style={{ marginBottom: 28 }}>
                <div className="notice-meta-row">
                  <span className="notice-meta-label">Created by</span>
                  <span className="notice-meta-value">{detailNotice.createdBy || "—"}</span>
                </div>
                <div className="notice-meta-row">
                  <span className="notice-meta-label">Date</span>
                  <span className="notice-meta-value">{formatDate(detailNotice.createdAt)}</span>
                </div>
                <div className="notice-meta-row">
                  <span className="notice-meta-label">Notice ID</span>
                  <span className="detail-item-value mono">{detailNotice._id}</span>
                </div>
              </div>
            </div>

            <div className="panel-actions">
              <button className="btn-danger" onClick={() => handleDelete(detailNotice._id)}>
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — fully themed to match dashboard dark style */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">Create Notice</div>
              <button className="close-btn" onClick={() => setShowModal(false)}><Icon.Close /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-section">
                  <div className="form-section-title">Notice Information</div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      className="form-input"
                      placeholder="Enter notice title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Write your announcement here..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publish Status</label>
                    <select
                      className="form-select"
                      value={String(form.isPublished)}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.value === "true" })}
                    >
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── SECTION: Students ─────────────────────────────────────────────────────
function StudentSection() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const INITIAL_STUDENT_FORM = { ...INITIAL_FORM, role: "student" };
  const [form, setForm] = useState(INITIAL_STUDENT_FORM);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${USERS_API}/students/all`);
      setStudents(res.data);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAddressChange = (e) =>
    setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await axios.put(`${USERS_API}/${selected._id}`, form);
        toast.success("Student updated successfully");
      } else {
        await axios.post(`${USERS_API}/register`, form);
        toast.success("Student created successfully");
      }
      setShowModal(false);
      setSelected(null);
      setForm(INITIAL_STUDENT_FORM);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (user) => {
    setSelected(user);
    setForm({ ...user, password: "", address: user.address || INITIAL_STUDENT_FORM.address });
    setDetailUser(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this student permanently?")) return;
    try {
      await axios.delete(`${USERS_API}/${id}`);
      setDetailUser(null);
      fetchStudents();
      toast.success("Student removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:    students.length,
    active:   students.filter(s => s.isActive).length,
    verified: students.filter(s => s.emailVerified).length,
    inactive: students.filter(s => !s.isActive).length,
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Students</div>
          <div className="page-subtitle">Manage your enrolled students</div>
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
            onClick={() => { setSelected(null); setForm(INITIAL_STUDENT_FORM); setShowModal(true); }}
          >
            <Icon.Plus /> Add Student
          </button>
        </div>
      </div>

      <div className="stats-row">
        {[
          { label: "Total Students", value: stats.total },
          { label: "Active",         value: stats.active },
          { label: "Email Verified", value: stats.verified },
          { label: "Inactive",       value: stats.inactive },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{String(s.value).padStart(2, "0")}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">{filtered.length} records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Contact</th>
              <th>Joined</th>
              <th>Verified</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-icon"><Icon.Users /></div>
                    <div className="empty-title">No students found</div>
                    <div className="empty-sub">Add your first student to get started.</div>
                  </div>
                </td>
              </tr>
            ) : filtered.map((std) => (
              <tr key={std._id} onClick={() => setDetailUser(std)}>
                <td>
                  <div className="td-instructor">
                    <img
                      className="avatar"
                      src={std.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(std.name)}&background=1a1a1a&color=888&size=72`}
                      alt={std.name}
                    />
                    <div>
                      <div className="instructor-name">{std.name}</div>
                      <div className="instructor-role">{std.role}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: "#777", marginBottom: 2 }}>{std.email}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{std.phone || "—"}</div>
                </td>
                <td>{formatDate(std.createdAt)}</td>
                <td>
                  {std.emailVerified
                    ? <span style={{ color: "#4a7c59", display: "flex", alignItems: "center", gap: 5 }}><Icon.Check /> Verified</span>
                    : <span style={{ color: "#444", fontSize: 13 }}>Pending</span>
                  }
                </td>
                <td>
                  <span className={`badge ${std.isActive ? "badge-active" : "badge-inactive"}`}>
                    <span className="badge-dot" />
                    {std.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="action-btn" onClick={() => handleEdit(std)} title="Edit">
                    <Icon.Edit />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(std._id)} title="Delete">
                    <Icon.Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailUser && (
        <div className="detail-overlay" onClick={() => setDetailUser(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <img
                  className="panel-avatar"
                  src={detailUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(detailUser.name)}&background=1a1a1a&color=888&size=112`}
                  alt={detailUser.name}
                />
                <div className="panel-name">{detailUser.name}</div>
                <div className="panel-email">{detailUser.email}</div>
              </div>
              <button className="close-btn" onClick={() => setDetailUser(null)}><Icon.Close /></button>
            </div>
            <div className="panel-body">
              <div className="section-label">Personal Information</div>
              <div className="detail-grid">
                {[
                  { label: "Role",           value: detailUser.role },
                  { label: "Gender",         value: detailUser.gender || "—" },
                  { label: "Date of Birth",  value: formatDate(detailUser.dateOfBirth) },
                  { label: "Phone",          value: detailUser.phone || "—" },
                  { label: "Status",         value: detailUser.isActive ? "Active" : "Inactive" },
                  { label: "Email Verified", value: detailUser.emailVerified ? "Yes" : "No" },
                  { label: "Last Login",     value: formatDate(detailUser.lastLogin) },
                  { label: "Member Since",   value: formatDate(detailUser.createdAt) },
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
                      detailUser.address.street, detailUser.address.city,
                      detailUser.address.state,  detailUser.address.postalCode,
                      detailUser.address.country,
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
              <button className="btn-outline" onClick={() => handleEdit(detailUser)}>Edit Profile</button>
              <button className="btn-danger"  onClick={() => handleDelete(detailUser._id)}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">{selected ? "Edit Student" : "New Student"}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}><Icon.Close /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-section">
                  <div className="form-section-title">Basic Information</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="Jane Doe" required
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="jane@example.com" required
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
                <div className="form-section">
                  <div className="form-section-title">Account Status</div>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    <span className="checkbox-label">Mark as active student</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">
                  {selected ? "Save Changes" : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── SECTION: Course Archive ───────────────────────────────────────────────
function ArchiveSection() {
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState("");

  const fetchDeletedCourses = async () => {
    try {
      const { data } = await axios.get(`${ADMIN_API}/deleted-courses`);
      setDeletedCourses(data.data);
    } catch {
      toast.error("Failed to fetch deleted courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeletedCourses(); }, []);

  const handleRestore = async (courseId) => {
    try {
      await axios.patch(`${ADMIN_API}/courses/${courseId}/restore`);
      toast.success("Course restored successfully");
      setDeletedCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch {
      toast.error("Restoration failed");
    }
  };

  const handlePermanentDelete = async (courseId) => {
    if (!window.confirm("This action is irreversible. Proceed?")) return;
    try {
      await axios.delete(`${ADMIN_API}/courses/${courseId}/permanent`);
      toast.success("Course permanently removed");
      setDeletedCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch {
      toast.error("Deletion failed");
    }
  };

  const filteredCourses = deletedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Course Archive</div>
          <div className="page-subtitle">Manage and recover previously deleted courses</div>
        </div>
        <div className="topbar-right">
          <div className="search-box">
            <Icon.Search />
            <input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="stats-row-2">
        <div className="stat-card">
          <div className="stat-label">Total Archived</div>
          <div className="stat-value">{String(deletedCourses.length).padStart(2, "0")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Filtered Results</div>
          <div className="stat-value">{String(filteredCourses.length).padStart(2, "0")}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">{filteredCourses.length} archived records</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="spin"><Icon.Loader /></span>
            <span>Loading archived courses…</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="archive-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Delete Reason</th>
                  <th>Removed On</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <div className="empty-icon"><Icon.Archive /></div>
                        <div className="empty-title">No archived courses</div>
                        <div className="empty-sub">
                          {searchTerm ? "No results match your search." : "The archive is currently empty."}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredCourses.map((course) => (
                  <tr key={course._id}>
                    <td><div className="course-title">{course.title}</div></td>
                    <td><span className="archive-badge">{course.instructor?.name || "System"}</span></td>
                    <td>
                      {course.deleteReason
                        ? <span className="reason-text">{course.deleteReason}</span>
                        : <span className="reason-empty">No reason provided</span>
                      }
                    </td>
                    <td>
                      <div className="date-main">
                        {new Date(course.deletedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="date-time">
                        {new Date(course.deletedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td>
                      <div className="archive-actions">
                        <button
                          className="action-btn restore"
                          onClick={() => handleRestore(course._id)}
                          title="Restore Course"
                        >
                          <Icon.Restore />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handlePermanentDelete(course._id)}
                          title="Permanently Delete"
                        >
                          <Icon.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── ROOT: Merged Dashboard ────────────────────────────────────────────────
export default function MergedDashboard() {
  const [loggedUser, setLoggedUser] = useState(null);
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("instructors");
  const [toastState, setToastState]       = useState(null);

  _setToastGlobal = setToastState;

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    if (toastState) {
      const t = setTimeout(() => setToastState(null), 2800);
      return () => clearTimeout(t);
    }
  }, [toastState]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedUser(storedUser);
  }, []);

  // ✅ FIX: use window.location.href for reliable redirect regardless of router setup
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setLoggedUser(null);
    toast.info("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

  const navItems = [
    { id: "Support",      label: "Instructor Requests",        icon: <Icon.Grid /> },
    { id: "students",      label: "Students",         icon: <Icon.Users /> },
    { id: "annoucements",  label: "Announcements",    icon: <Icon.Bell /> },
    { id: "instructors",   label: "Instructors",      icon: <Icon.Users /> },
    { id: "archive",       label: "Course Archive",   icon: <Icon.Archive /> },
    { id: "Course Analysis",      label: "Course Analysis",         icon: <Icon.Settings /> },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="merged-root">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-text">Studly Edu</div>
            <div className="sidebar-logo-sub">Admin Portal</div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user-row">
              <div className="sidebar-avatar"><Icon.User /></div>
              <div style={{ overflow: "hidden" }}>
                <div className="sidebar-user-name">{loggedUser?.name || "Admin"}</div>
                <div className="sidebar-user-email">{loggedUser?.email}</div>
              </div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <Icon.LogOut /> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {activeSection === "instructors"  && <InstructorSection />}
          {activeSection === "archive"      && <ArchiveSection />}
          {activeSection === "students"     && <StudentSection />}
          {activeSection === "annoucements" && <AdminNoticeSection />}
           {activeSection === "Support" && <ComplainReply />}
          
          {(activeSection === "overview" || activeSection === "settings") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#333" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
                {activeSection === "overview" ? "◫" : "⚙"}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#555", marginBottom: 8 }}>
                {activeSection === "overview" ? "Overview" : "Settings"}
              </div>
              <div style={{ fontSize: 13, color: "#333" }}>This section is under construction.</div>
            </div>
          )}
        </main>
      </div>

      {/* TOAST */}
      {toastState && (
        <div className="toast">
          <span style={{ color: toastState.type === "error" ? "#963c3c" : "#4a7c59" }}>
            <Icon.Check />
          </span>
          {toastState.msg}
        </div>
      )}
    </>
  );
}