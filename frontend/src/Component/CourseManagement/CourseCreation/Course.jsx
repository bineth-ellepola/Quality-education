import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAppContext } from "../AppProvider";

// ─── CSS ───────────────────────────────────────────────────────────────────────
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
    --accent:    #ff4628;
    --accent-lt: #111112;
    --green:     #16a34a;
    --green-lt:  #dcfce7;
    --amber:     #b45309;
    --amber-lt:  #FEF3C7;
    --red:       #e61717;
    --red-lt:    #FEE2E2;
    --blue:      #e9ecf3;
    --blue-lt:   #165eef;
    --purple:    #f9f4f4;
    --purple-lt: #111112;
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

  /* ─── Layout ──────────────────────────────────────────────── */
  .app-shell { display: flex; min-height: 100vh; }

  .sidebar {
    width: 230px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 10;
    overflow-y: auto;
  }

  .sidebar-logo {
    padding: 0 20px 22px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }
  .sidebar-logo h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    letter-spacing: -.3px;
    color: var(--ink);
    word-break: break-all;
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

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 20px 0;
    border-top: 1px solid var(--border);
  }
  .user-chip { display: flex; align-items: center; gap: 10px; }
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
  .main { margin-left: 230px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

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
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { filter: brightness(1.1); }
  .btn-primary:disabled { opacity: .55; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--ink-2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface-2); color: var(--ink); }
  .btn-danger { background: var(--red-lt); color: var(--red); border: 1px solid #fca5a5; }
  .btn-danger:hover { background: #fee2e2; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

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
    padding: 16px 22px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .panel-title { font-size: 14px; font-weight: 600; }
  .panel-body { padding: 22px; }

  /* ─── Step Wizard ────────────────────────────────────────────── */
  .wizard-steps {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 32px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
  }
  .wizard-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    cursor: pointer;
    color: var(--ink-3);
    font-size: 13px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all var(--transition);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .wizard-step:hover { color: var(--ink-2); }
  .wizard-step.active { color: var(--accent); border-bottom-color: var(--accent); }
  .wizard-step.completed { color: var(--green); }
  .step-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--surface-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
    transition: all var(--transition);
  }
  .wizard-step.active .step-num { background: var(--accent); color: #fff; }
  .wizard-step.completed .step-num { background: var(--green); color: #fff; }
  .step-divider { width: 24px; height: 1px; background: var(--border); flex-shrink: 0; }

  /* ─── Form ─────────────────────────────────────────────────── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-group.third { grid-column: span 1; }
  .form-label { font-size: 12px; font-weight: 500; color: var(--ink-2); }
  .form-label .req { color: var(--red); margin-left: 2px; }
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
    box-shadow: 0 0 0 3px rgba(132,158,21,.12);
  }
  textarea.form-control { resize: vertical; min-height: 80px; }
  select.form-control {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
    background-color: var(--bg);
  }

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
  .file-name-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-lt);
    color: var(--accent);
    border: 1px solid #c9d97c;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 500;
    margin-top: 8px;
  }

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
  .alert-success { background: var(--green-lt); color: var(--green); border: 1px solid #86efac; }
  .alert-info { background: var(--blue-lt); color: var(--blue); border: 1px solid #93c5fd; }

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
  .course-sub { font-size: 11.5px; color: var(--ink-3); margin-top: 2px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
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
  .badge-blue   { background: var(--blue-lt); color: var(--blue); }
  .badge-purple { background: var(--purple-lt); color: var(--purple); }
  .badge-gray   { background: var(--surface-2); color: var(--ink-2); }
  .badge-red    { background: var(--red-lt); color: var(--red); }

  /* ─── Drawer ─────────────────────────────────────────────────── */
  .drawer-overlay {
    position: fixed; inset: 0;
    background: rgba(26,25,22,.45);
    z-index: 40;
    display: flex; justify-content: flex-end;
    animation: fadeIn .15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .drawer {
    width: 480px;
    max-width: 96vw;
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
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0;
    background: var(--surface); z-index: 1;
  }
  .drawer-body { padding: 22px; flex: 1; }
  .drawer-cover { width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius); margin-bottom: 18px; background: var(--surface-2); }
  .drawer-title { font-family: 'DM Serif Display', serif; font-size: 20px; margin-bottom: 6px; line-height: 1.3; }
  .drawer-desc { font-size: 13px; color: var(--ink-2); line-height: 1.6; margin-bottom: 18px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .detail-item { background: var(--bg); border-radius: 7px; padding: 10px 12px; }
  .detail-item-label { font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px; }
  .detail-item-value { font-size: 13px; font-weight: 500; }
  .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .tag { background: var(--surface-2); color: var(--ink-2); padding: 3px 9px; border-radius: 20px; font-size: 11.5px; }

  /* ─── Section Divider ─────────────────────────────────────── */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 20px;
  }
  .section-divider-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--ink-3);
    white-space: nowrap;
  }
  .section-divider-line { flex: 1; height: 1px; background: var(--border); }

  /* ─── Content Item Card ───────────────────────────────────── */
  .item-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
    background: var(--bg);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: box-shadow var(--transition);
  }
  .item-card:hover { box-shadow: var(--shadow); }
  .item-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .item-card-title { font-size: 13px; font-weight: 600; }
  .item-card-sub { font-size: 11.5px; color: var(--ink-3); }
  .item-cards-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }

  /* ─── Add Item Inline Form ────────────────────────────────── */
  .add-item-box {
    border: 1.5px dashed var(--border);
    border-radius: 8px;
    padding: 18px 20px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .add-item-box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .add-item-box-title { font-size: 13px; font-weight: 600; }

  /* ─── Empty ─────────────────────────────────────────────────── */
  .empty-state { padding: 36px; text-align: center; color: var(--ink-3); }
  .empty-title { font-size: 14px; font-weight: 500; color: var(--ink-2); }
  .empty-sub { font-size: 12px; margin-top: 4px; }

  /* ─── Skeleton ──────────────────────────────────────────────── */
  .skeleton { background: linear-gradient(90deg, var(--surface-2) 25%, #E8E5DF 50%, var(--surface-2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ─── Progress bar ──────────────────────────────────────────── */
  .progress-bar-wrap { height: 6px; background: var(--surface-2); border-radius: 99px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 99px; transition: width .4s ease; }

  /* ─── Summary box on step 3 ──────────────────────────────── */
  .summary-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 18px;
    margin-bottom: 12px;
  }
  .summary-box-title { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 10px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid var(--border); }
  .summary-row:last-child { border-bottom: none; }
  .summary-key { font-size: 12.5px; color: var(--ink-2); }
  .summary-val { font-size: 12.5px; font-weight: 500; }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Courses: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Add: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Close: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Upload: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Star: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Users: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  TrendUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  BookOpen: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  File: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Video: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Assessment: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  Content: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Spinner: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor"/></svg>,
};

// CSS keyframe for spinner (injected once)
const spinnerCSS = `@keyframes spin { to { transform: rotate(360deg); } }`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = { published: "badge-green", draft: "badge-amber", unpublished: "badge-gray" };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
}
function levelBadge(level) {
  const map = { beginner: "badge-blue", intermediate: "badge-amber", advanced: "badge-gray" };
  return <span className={`badge ${map[level] || "badge-gray"}`}>{level}</span>;
}
function contentTypeBadge(type) {
  const map = {
    video: "badge-blue", lab_sheet: "badge-purple", lecture_note: "badge-amber",
    assignment: "badge-green", quiz: "badge-red", other: "badge-gray",
  };
  return <span className={`badge ${map[type] || "badge-gray"}`}>{type?.replace("_", " ")}</span>;
}

// ─── Course Detail Drawer ─────────────────────────────────────────────────────
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
            : <div className="drawer-cover" />}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {statusBadge(course.status)}
            {levelBadge(course.level)}
          </div>
          <div className="drawer-title">{course.title}</div>
          <div className="drawer-desc">{course.description}</div>
          <div className="detail-grid">
            <div className="detail-item"><div className="detail-item-label">Subject</div><div className="detail-item-value">{course.subject?.name || "—"}</div></div>
            <div className="detail-item"><div className="detail-item-label">Instructor</div><div className="detail-item-value">{course.instructor?.name || "—"}</div></div>
            <div className="detail-item"><div className="detail-item-label">Duration</div><div className="detail-item-value">{course.duration} hrs</div></div>
            <div className="detail-item"><div className="detail-item-label">Enrolled</div><div className="detail-item-value">{course.enrolledStudentsCount} / {course.enrollmentLimit}</div></div>
            <div className="detail-item"><div className="detail-item-label">Price</div><div className="detail-item-value">{course.price} {course.currency !== "Free" ? `(${course.currency})` : ""}</div></div>
            <div className="detail-item">
              <div className="detail-item-label">Rating</div>
              <div className="detail-item-value" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "var(--amber)" }}><Icon.Star /></span>
                {course.averageRating} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>({course.totalRatings})</span>
              </div>
            </div>
          </div>
          {course.prerequisites?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Prerequisites</div>
              <div className="tag-list">{course.prerequisites.map((p, i) => <span key={i} className="tag">{p}</span>)}</div>
            </div>
          )}
          {course.tags?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Tags</div>
              <div className="tag-list">{course.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}</div>
            </div>
          )}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: 11.5, color: "var(--ink-3)" }}>
            Created {new Date(course.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Content Item Form (inline) ────────────────────────────────────────────────
function ContentItemForm({ onSave, onCancel }) {
  const [data, setData] = useState({
    title: "", type: "video", module: "", week: "",
    difficulty: "beginner", url: "", description: "",
    tags: "", visibility: "published", eventDate: "",
  });
  const [file, setFile] = useState(null);
  const ch = e => setData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="add-item-box">
      <div className="add-item-box-header">
        <span className="add-item-box-title">Add Content Item</span>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}><Icon.Close /></button>
      </div>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">Title <span className="req">*</span></label>
          <input className="form-control" name="title" value={data.title} onChange={ch} placeholder="e.g. Week 1 Lecture Video" required />
        </div>
        <div className="form-group">
          <label className="form-label">Content Type</label>
          <select className="form-control" name="type" value={data.type} onChange={ch}>
            <option value="video">Video</option>
            <option value="lab_sheet">Lab Sheet</option>
            <option value="lecture_note">Lecture Note</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Difficulty</label>
          <select className="form-control" name="difficulty" value={data.difficulty} onChange={ch}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Module</label>
          <input className="form-control" name="module" value={data.module} onChange={ch} placeholder="e.g. Module 2" />
        </div>
        <div className="form-group">
          <label className="form-label">Week</label>
          <input className="form-control" name="week" value={data.week} onChange={ch} placeholder="e.g. Week 3" />
        </div>
        <div className="form-group">
          <label className="form-label">Visibility</label>
          <select className="form-control" name="visibility" value={data.visibility} onChange={ch}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Event Date</label>
          <input className="form-control" type="datetime-local" name="eventDate" value={data.eventDate} onChange={ch} />
        </div>
        <div className="form-group full">
          <label className="form-label">External URL <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(video link etc.)</span></label>
          <input className="form-control" name="url" value={data.url} onChange={ch} placeholder="https://..." />
        </div>
        <div className="form-group full">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={data.description} onChange={ch} placeholder="Brief description of this content..." />
        </div>
        <div className="form-group full">
          <label className="form-label">Tags <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(comma separated)</span></label>
          <input className="form-control" name="tags" value={data.tags} onChange={ch} placeholder="e.g. intro, theory, python" />
        </div>
        <div className="form-group full">
          <label className="form-label">Upload File <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(PDF, MP4, DOCX…)</span></label>
          <label className="file-drop" htmlFor={`content-file-new`}>
            {file
              ? <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <Icon.File />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</span>
                </div>
              : <>
                  <div className="file-drop-icon"><Icon.Upload /></div>
                  <div className="file-drop-text"><strong>Click to upload</strong> or drag & drop</div>
                  <div className="file-drop-text" style={{ marginTop: 3 }}>PDF, MP4, DOCX, PPTX…</div>
                </>
            }
            <input id={`content-file-new`} type="file" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
      </div>
      <button
        className="btn btn-primary"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          if (!data.title.trim()) return;
          onSave({ ...data, file });
        }}
      >
        <Icon.Check /> Add to Course
      </button>
    </div>
  );
}

// ─── Assessment Item Form (inline) ────────────────────────────────────────────
function AssessmentItemForm({ onSave, onCancel }) {
  const [data, setData] = useState({
    title: "", description: "", totalMarks: "", dueDate: "",
  });
  const [file, setFile] = useState(null);
  const ch = e => setData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="add-item-box">
      <div className="add-item-box-header">
        <span className="add-item-box-title">Add Assessment</span>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}><Icon.Close /></button>
      </div>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">Assessment Title <span className="req">*</span></label>
          <input className="form-control" name="title" value={data.title} onChange={ch} placeholder="e.g. Midterm Exam, Lab Report 2" required />
        </div>
        <div className="form-group">
          <label className="form-label">Total Marks</label>
          <input className="form-control" type="number" name="totalMarks" value={data.totalMarks} onChange={ch} placeholder="e.g. 100" min="0" />
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input className="form-control" type="datetime-local" name="dueDate" value={data.dueDate} onChange={ch} />
        </div>
        <div className="form-group full">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={data.description} onChange={ch} placeholder="Instructions, rules, or notes for this assessment..." />
        </div>
        <div className="form-group full">
          <label className="form-label">Upload Assessment File <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(PDF, DOCX…)</span></label>
          <label className="file-drop" htmlFor={`assessment-file-new`}>
            {file
              ? <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <Icon.File />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</span>
                </div>
              : <>
                  <div className="file-drop-icon"><Icon.Upload /></div>
                  <div className="file-drop-text"><strong>Click to upload</strong> or drag & drop</div>
                  <div className="file-drop-text" style={{ marginTop: 3 }}>PDF, DOCX, XLSX…</div>
                </>
            }
            <input id={`assessment-file-new`} type="file" accept=".pdf,.doc,.docx,.xlsx,.pptx" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
      </div>
      <button
        className="btn btn-primary"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          if (!data.title.trim()) return;
          onSave({ ...data, file });
        }}
      >
        <Icon.Check /> Add Assessment
      </button>
    </div>
  );
}

// ─── Create Course View (3-step wizard) ───────────────────────────────────────
function CreateCourseView({ subjects, token, instructorId, onSuccess }) {
  const [step, setStep] = useState(1);

  // Step 1: Course basics
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", subject: "", duration: "",
    level: "beginner", price: "free", currency: "Free",
    enrollmentLimit: 100, prerequisites: "", tags: "", status: "draft",
  });

  // Step 2: Contents & Assessments (local staging)
  const [contents, setContents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);

  // Step 3: Submit
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleStep1Next = e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.subject || !form.duration) {
      setError("Please fill all required fields.");
      return;
    }
    if (!coverImage) { setError("Cover image is required."); return; }
    setError("");
    setStep(2);
  };

  const addContent = item => {
    setContents(p => [...p, { ...item, _localId: Date.now() }]);
    setShowContentForm(false);
  };
  const removeContent = id => setContents(p => p.filter(c => c._localId !== id));

  const addAssessment = item => {
    setAssessments(p => [...p, { ...item, _localId: Date.now() }]);
    setShowAssessmentForm(false);
  };
  const removeAssessment = id => setAssessments(p => p.filter(a => a._localId !== id));

  const handleFinalSubmit = async () => {
    if (!instructorId) { setError("Instructor not authenticated"); return; }
    try {
      setLoading(true); setError(""); setSuccess("");

      // 1. Create course
      setUploadProgress("Creating course…");
      const courseData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "prerequisites" || key === "tags") {
          courseData.append(key, JSON.stringify(value.split(",").map(i => i.trim()).filter(Boolean)));
        } else {
          courseData.append(key, value);
        }
      });
      courseData.append("instructor", instructorId);
      courseData.append("coverImage", coverImage);

      const courseRes = await axios.post("http://localhost:5001/api/courses", courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courseId = courseRes.data._id || courseRes.data.data?._id || courseRes.data.course?._id;

      // 2. Upload contents
      for (let i = 0; i < contents.length; i++) {
        const c = contents[i];
        setUploadProgress(`Uploading content ${i + 1} of ${contents.length}: "${c.title}"…`);
        const fd = new FormData();
        fd.append("title", c.title);
        fd.append("type", c.type);
        fd.append("difficulty", c.difficulty);
        fd.append("visibility", c.visibility);
        if (c.module) fd.append("module", c.module);
        if (c.week) fd.append("week", c.week);
        if (c.url) fd.append("url", c.url);
        if (c.description) fd.append("description", c.description);
        if (c.eventDate) fd.append("eventDate", c.eventDate);
        if (c.tags) fd.append("tags", JSON.stringify(c.tags.split(",").map(t => t.trim()).filter(Boolean)));
        if (c.file) fd.append("file", c.file);
        await axios.post(`http://localhost:5001/api/content/courses/${courseId}/contents`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // 3. Upload assessments
      for (let i = 0; i < assessments.length; i++) {
        const a = assessments[i];
        setUploadProgress(`Uploading assessment ${i + 1} of ${assessments.length}: "${a.title}"…`);
        const fd = new FormData();
        fd.append("title", a.title);
        if (a.description) fd.append("description", a.description);
        if (a.totalMarks) fd.append("totalMarks", a.totalMarks);
        if (a.dueDate) fd.append("dueDate", a.dueDate);
        if (a.file) {
          fd.append("file", a.file);
          fd.append("fileName", a.file.name);
        }
        await axios.post(`http://localhost:5001/api/assestment/courses/${courseId}/assessments`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSuccess(`Course "${form.title}" created with ${contents.length} content item(s) and ${assessments.length} assessment(s)!`);
      setUploadProgress("");
      // Reset
      setForm({ title: "", description: "", subject: "", duration: "", level: "beginner", price: "free", currency: "Free", enrollmentLimit: 100, prerequisites: "", tags: "", status: "draft" });
      setCoverImage(null); setCoverPreview(null);
      setContents([]); setAssessments([]);
      setStep(1);
      setTimeout(() => onSuccess(), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong during submission.");
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Course Info" },
    { num: 2, label: "Content & Assessments" },
    { num: 3, label: "Review & Submit" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Step nav */}
      <div className="wizard-steps">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div
              className={`wizard-step ${step === s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}
              onClick={() => step > s.num && setStep(s.num)}
            >
              <span className="step-num">
                {step > s.num ? <Icon.Check /> : s.num}
              </span>
              {s.label}
            </div>
            {idx < steps.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        ))}
      </div>

      <div className="content">
        {error && <div className="alert alert-error"><Icon.Alert />{error}</div>}
        {success && <div className="alert alert-success"><Icon.Check />{success}</div>}

        {/* ── Step 1: Course Basics ── */}
        {step === 1 && (
          <div className="panel" style={{ maxWidth: 760 }}>
            <div className="panel-header">
              <span className="panel-title">Course Information</span>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Fields marked <span style={{ color: "var(--red)" }}>*</span> are required</span>
            </div>
            <div className="panel-body">
              <form onSubmit={handleStep1Next}>
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="form-label">Course Title <span className="req">*</span></label>
                    <input className="form-control" name="title" placeholder="e.g. Introduction to Machine Learning" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Description <span className="req">*</span></label>
                    <textarea className="form-control" name="description" placeholder="Describe what students will learn…" value={form.description} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject <span className="req">*</span></label>
                    <select className="form-control" name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (hours) <span className="req">*</span></label>
                    <input className="form-control" type="number" name="duration" placeholder="0" value={form.duration} onChange={handleChange} required min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select className="form-control" name="level" value={form.level} onChange={handleChange}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input className="form-control" name="price" placeholder="e.g. free or 29.99" value={form.price} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <input className="form-control" name="currency" placeholder="e.g. USD" value={form.currency} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enrollment Limit</label>
                    <input className="form-control" type="number" name="enrollmentLimit" value={form.enrollmentLimit} onChange={handleChange} min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prerequisites <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(comma separated)</span></label>
                    <input className="form-control" name="prerequisites" placeholder="e.g. Basic Algebra, Python" value={form.prerequisites} onChange={handleChange} />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Tags <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(comma separated)</span></label>
                    <input className="form-control" name="tags" placeholder="e.g. ml, data-science, python" value={form.tags} onChange={handleChange} />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Cover Image <span className="req">*</span></label>
                    <label className="file-drop" htmlFor="cover-upload">
                      {coverPreview
                        ? <img src={coverPreview} alt="Preview" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 6 }} />
                        : <>
                            <div className="file-drop-icon"><Icon.Upload /></div>
                            <div className="file-drop-text"><strong>Click to upload</strong> or drag and drop</div>
                            <div className="file-drop-text" style={{ marginTop: 3 }}>PNG, JPG, WEBP — max 5MB</div>
                          </>
                      }
                      <input id="cover-upload" type="file" accept="image/*" onChange={handleFile} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 22, padding: "10px 28px" }}>
                  Continue to Content & Assessments →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Step 2: Content & Assessments ── */}
        {step === 2 && (
          <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Content Section */}
            <div className="panel">
              <div className="panel-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon.Content />
                  <span className="panel-title">Course Content</span>
                  <span className="badge badge-blue">{contents.length} item{contents.length !== 1 ? "s" : ""}</span>
                </div>
                {!showContentForm && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowContentForm(true)}>
                    <Icon.Add /> Add Content
                  </button>
                )}
              </div>
              <div className="panel-body">
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  <Icon.Alert />
                  Add videos, lecture notes, lab sheets, quizzes or any course material. You can add multiple items.
                </div>

                {showContentForm && (
                  <ContentItemForm
                    onSave={addContent}
                    onCancel={() => setShowContentForm(false)}
                  />
                )}

                {contents.length > 0 && (
                  <div className="item-cards-list">
                    {contents.map(c => (
                      <div key={c._localId} className="item-card">
                        <div className="item-card-header">
                          <div>
                            <div className="item-card-title">{c.title}</div>
                            <div className="item-card-sub" style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                              {contentTypeBadge(c.type)}
                              {levelBadge(c.difficulty)}
                              {c.visibility === "draft" && <span className="badge badge-amber">draft</span>}
                              {c.module && <span className="badge badge-gray">{c.module}</span>}
                              {c.week && <span className="badge badge-gray">{c.week}</span>}
                            </div>
                          </div>
                          <button className="btn btn-danger btn-sm" onClick={() => removeContent(c._localId)}>
                            <Icon.Trash />
                          </button>
                        </div>
                        {(c.description || c.file || c.url) && (
                          <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {c.description && <span>{c.description.slice(0, 80)}{c.description.length > 80 ? "…" : ""}</span>}
                            {c.file && <span className="file-name-pill"><Icon.File />{c.file.name}</span>}
                            {c.url && !c.file && <span style={{ color: "var(--blue)" }}>🔗 {c.url.slice(0, 40)}…</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!showContentForm && contents.length === 0 && (
                  <div className="empty-state" style={{ padding: "24px 0 8px" }}>
                    <div className="empty-title">No content added yet</div>
                    <div className="empty-sub">Click "Add Content" to start building your course curriculum</div>
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Section */}
            <div className="panel">
              <div className="panel-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon.Assessment />
                  <span className="panel-title">Assessments</span>
                  <span className="badge badge-purple">{assessments.length} item{assessments.length !== 1 ? "s" : ""}</span>
                </div>
                {!showAssessmentForm && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowAssessmentForm(true)}>
                    <Icon.Add /> Add Assessment
                  </button>
                )}
              </div>
              <div className="panel-body">
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  <Icon.Alert />
                  Add exams, assignments, or graded tasks. Files are uploaded securely to Supabase.
                </div>

                {showAssessmentForm && (
                  <AssessmentItemForm
                    onSave={addAssessment}
                    onCancel={() => setShowAssessmentForm(false)}
                  />
                )}

                {assessments.length > 0 && (
                  <div className="item-cards-list">
                    {assessments.map(a => (
                      <div key={a._localId} className="item-card">
                        <div className="item-card-header">
                          <div>
                            <div className="item-card-title">{a.title}</div>
                            <div className="item-card-sub" style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                              <span className="badge badge-purple">Assessment</span>
                              {a.totalMarks && <span className="badge badge-gray">{a.totalMarks} marks</span>}
                              {a.dueDate && (
                                <span style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 3 }}>
                                  <Icon.Clock /> Due {new Date(a.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="btn btn-danger btn-sm" onClick={() => removeAssessment(a._localId)}>
                            <Icon.Trash />
                          </button>
                        </div>
                        {(a.description || a.file) && (
                          <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {a.description && <span>{a.description.slice(0, 100)}{a.description.length > 100 ? "…" : ""}</span>}
                            {a.file && <span className="file-name-pill"><Icon.File />{a.file.name}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!showAssessmentForm && assessments.length === 0 && (
                  <div className="empty-state" style={{ padding: "24px 0 8px" }}>
                    <div className="empty-title">No assessments added yet</div>
                    <div className="empty-sub">Click "Add Assessment" to include exams or graded tasks</div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => { setError(""); setStep(3); }}>
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Submit ── */}
        {step === 3 && (
          <div style={{ maxWidth: 680 }}>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Review Your Course</span>
              </div>
              <div className="panel-body">
                {/* Course Summary */}
                <div className="summary-box">
                  <div className="summary-box-title">Course Details</div>
                  <div className="summary-row"><span className="summary-key">Title</span><span className="summary-val">{form.title}</span></div>
                  <div className="summary-row"><span className="summary-key">Subject</span><span className="summary-val">{subjects.find(s => s._id === form.subject)?.name || form.subject}</span></div>
                  <div className="summary-row"><span className="summary-key">Level</span><span className="summary-val">{form.level}</span></div>
                  <div className="summary-row"><span className="summary-key">Status</span><span className="summary-val">{form.status}</span></div>
                  <div className="summary-row"><span className="summary-key">Duration</span><span className="summary-val">{form.duration} hrs</span></div>
                  <div className="summary-row"><span className="summary-key">Price</span><span className="summary-val">{form.price} {form.currency !== "Free" ? `(${form.currency})` : ""}</span></div>
                  <div className="summary-row"><span className="summary-key">Enrollment Limit</span><span className="summary-val">{form.enrollmentLimit}</span></div>
                  <div className="summary-row"><span className="summary-key">Cover Image</span><span className="summary-val">{coverImage?.name}</span></div>
                </div>

                {/* Content Summary */}
                <div className="summary-box">
                  <div className="summary-box-title">Content Items ({contents.length})</div>
                  {contents.length === 0
                    ? <div style={{ fontSize: 12, color: "var(--ink-3)" }}>No content items added</div>
                    : contents.map((c, i) => (
                        <div className="summary-row" key={c._localId}>
                          <span className="summary-key">{i + 1}. {c.title}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            {contentTypeBadge(c.type)}
                            {c.file && <span className="badge badge-gray"><Icon.File /> File</span>}
                          </div>
                        </div>
                      ))
                  }
                </div>

                {/* Assessment Summary */}
                <div className="summary-box">
                  <div className="summary-box-title">Assessments ({assessments.length})</div>
                  {assessments.length === 0
                    ? <div style={{ fontSize: 12, color: "var(--ink-3)" }}>No assessments added</div>
                    : assessments.map((a, i) => (
                        <div className="summary-row" key={a._localId}>
                          <span className="summary-key">{i + 1}. {a.title}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            <span className="badge badge-purple">{a.totalMarks ? `${a.totalMarks} marks` : "No marks"}</span>
                            {a.file && <span className="badge badge-gray"><Icon.File /> File</span>}
                          </div>
                        </div>
                      ))
                  }
                </div>

                {/* Upload Progress */}
                {loading && uploadProgress && (
                  <div className="alert alert-info">
                    <Icon.Spinner />
                    {uploadProgress}
                  </div>
                )}

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)} disabled={loading}>← Back</button>
                  <button
                    className="btn btn-primary"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    style={{ flex: 1, justifyContent: "center", padding: "10px 0" }}
                  >
                    {loading ? <><Icon.Spinner /> Submitting…</> : "Create Course"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Courses View ─────────────────────────────────────────────────────────────
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
              placeholder="Search courses…"
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
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 58, borderRadius: 8 }} />)}
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
                  : <div className="course-thumb" />}
                <div className="course-meta">
                  <div className="course-name">{course.title}</div>
                  <div className="course-sub">
                    {course.subject?.name} · {course.instructor?.name} · <Icon.Clock /> {course.duration}h
                  </div>
                </div>
                <div className="course-actions">
                  {statusBadge(course.status)}
                  {levelBadge(course.level)}
                  <span style={{ color: "var(--ink-3)" }}><Icon.ChevronRight /></span>
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

// ─── Dashboard Overview ───────────────────────────────────────────────────────
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
          <div style={{ marginTop: 6 }}>
            <span className="badge badge-green"><Icon.TrendUp /> Enrolled</span>
          </div>
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
          <div className="panel-header"><span className="panel-title">Recent Courses</span></div>
          <div className="courses-list">
            {recentCourses.length === 0 && (
              <div className="empty-state"><div className="empty-title">No courses yet</div></div>
            )}
            {recentCourses.map(course => (
              <div key={course._id} className="course-row">
                {course.coverImage
                  ? <img src={course.coverImage} alt={course.title} className="course-thumb" />
                  : <div className="course-thumb" />}
                <div className="course-meta">
                  <div className="course-name">{course.title}</div>
                  <div className="course-sub">{course.subject?.name} · {course.level}</div>
                </div>
                <div className="course-actions">{statusBadge(course.status)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><span className="panel-title">Enrollment Overview</span></div>
          <div className="panel-body">
            {courses.length === 0 && <div className="empty-state"><div className="empty-title">No data yet</div></div>}
            {courses.slice(0, 6).map(course => {
              const pct = course.enrollmentLimit > 0
                ? Math.min(100, Math.round((course.enrolledStudentsCount / course.enrollmentLimit) * 100))
                : 0;
              return (
                <div key={course._id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-3)", flexShrink: 0 }}>{course.enrolledStudentsCount} / {course.enrollmentLimit}</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct > 80 ? "var(--green)" : "var(--accent)" }} />
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

// ─── Main App ─────────────────────────────────────────────────────────────────
function CourseDashboard() {
  const [view, setView] = useState("overview");
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { user } = useAppContext();

  const token = localStorage.getItem("token");
  let instructorId = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      instructorId = decoded.id || decoded.userId || decoded._id;
    } catch {}
  }

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5001/api/subjects", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubjects(res.data.subjects || []))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingCourses(true);
    axios.get("http://localhost:5001/api/courses", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCourses(res.data.data || []))
      .catch(() => setErrorCourses("Failed to fetch courses"))
      .finally(() => setLoadingCourses(false));
  }, [token, refreshKey]);

  const navItems = [
    { id: "overview",  label: "Overview",     icon: <Icon.Dashboard /> },
    { id: "courses",   label: "All Courses",  icon: <Icon.Courses /> },
    { id: "create",    label: "New Course",   icon: <Icon.Add /> },
  ];
  const topbarTitles = {
    overview: "Dashboard",
    courses: "All Courses",
    create: "Create New Course",
  };

  return (
    <>
      <style>{css + spinnerCSS}</style>
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Instructor <span>Portal</span></h1>
            {user?.email && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4, wordBreak: "break-all" }}>{user.email}</div>}
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
              <div className="user-avatar">{user?.name ? user.name.slice(0, 2).toUpperCase() : "IN"}</div>
              <div>
                <div className="user-name">{user?.name || "Instructor"}</div>
                <div className="user-role">Course Creator</div>
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
          {view === "courses"  && <CoursesView courses={courses} loading={loadingCourses} error={errorCourses} />}
          {view === "create"   && (
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