import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from '../AppProvider';

const NoticePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { courseId } = location.state || {};
  const { user, setUser } = useAppContext();
  const [title, setTitle] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeLinkPopup, setActiveLinkPopup] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [activeColorPicker, setActiveColorPicker] = useState(false);
  const [activeBgColorPicker, setActiveBgColorPicker] = useState(false);
  const [savedRange, setSavedRange] = useState(null);

  const editorRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleFiles = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0).cloneRange());
    }
  };

  const restoreSelection = () => {
    if (savedRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
  };

  const execCmd = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const handleFontSize = (size) => {
    execCmd("fontSize", "7");
    const fontEls = editorRef.current?.querySelectorAll('font[size="7"]');
    fontEls?.forEach((el) => {
      el.removeAttribute("size");
      el.style.fontSize = size;
    });
  };

  const handleColor = (color) => {
    restoreSelection();
    execCmd("foreColor", color);
    setActiveColorPicker(false);
  };

  const handleBgColor = (color) => {
    restoreSelection();
    execCmd("hiliteColor", color);
    setActiveBgColorPicker(false);
  };

  const handleInsertLink = () => {
    restoreSelection();
    if (linkUrl) {
      const text = linkText || linkUrl;
      const html = `<a href="${linkUrl}" target="_blank" style="color:#3f7d20;text-decoration:underline;">${text}</a>`;
      document.execCommand("insertHTML", false, html);
    }
    setActiveLinkPopup(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const description = editorRef.current?.innerHTML || "";

    if (!title || !description || description === "<br>") {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("courseId", courseId);
      formData.append("isPublished", isPublished);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await axios.post(
        "http://localhost:5001/api/notice",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Notice created successfully!");
      setTitle("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setAttachments([]);
      setIsPublished(true);

      setTimeout(() => navigate(`/dashboard`), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const textColors = [
    "#1a1a18", "#c0392b", "#e67e22", "#f1c40f", "#27ae60",
    "#2980b9", "#8e44ad", "#3f7d20", "#888882", "#ffffff"
  ];

  const bgColors = [
    "#ffeaa7", "#fab1a0", "#fd79a8", "#a29bfe", "#74b9ff",
    "#55efc4", "#dfe6e9", "#f0f5ec", "#fff3cd", "#ffcccc"
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .notice-root {
          min-height: 100vh;
          background: #f5f4f0;
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* Left sidebar */
        .notice-sidebar {
          width: 260px;
          background: #1a1a18;
          padding: 40px 28px;
          display: flex;
          flex-direction: column;
          gap: 0;
          flex-shrink: 0;
        }

        .sidebar-brand {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: #f5f4f0;
          letter-spacing: -0.3px;
          margin-bottom: 48px;
        }

        .sidebar-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #555550;
          margin-bottom: 16px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-nav-item {
          font-size: 13.5px;
          font-weight: 400;
          color: #888882;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-nav-item:hover {
          color: #f5f4f0;
          background: #252522;
        }

        .sidebar-nav-item.active {
          color: #f5f4f0;
          background: #2e2e2b;
        }

        .sidebar-nav-item svg {
          opacity: 0.6;
          flex-shrink: 0;
        }

        .sidebar-nav-item.active svg {
          opacity: 1;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid #252522;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3f7d20;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .sidebar-user-info {
          display: flex;
          flex-direction: column;
        }

        .sidebar-user-name {
          font-size: 13px;
          font-weight: 500;
          color: #d4d4cc;
        }

        .sidebar-user-role {
          font-size: 11px;
          color: #555550;
        }

        /* Main content */
        .notice-main {
          flex: 1;
          padding: 48px 56px;
          overflow-y: auto;
          max-width: 800px;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #999992;
          margin-bottom: 16px;
        }

        .breadcrumb-sep { color: #ccc; }
        .breadcrumb-current { color: #333; }

        .page-title {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          color: #1a1a18;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .page-subtitle {
          font-size: 13.5px;
          color: #888882;
          font-weight: 300;
        }

        /* Card */
        .notice-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 36px;
          border: 1px solid #e8e8e2;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .card-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #aaa8a0;
          margin-bottom: 20px;
        }

        .form-group { margin-bottom: 24px; }

        .form-label {
          display: block;
          font-size: 12.5px;
          font-weight: 500;
          color: #555550;
          margin-bottom: 8px;
          letter-spacing: 0.1px;
        }

        .form-input {
          width: 100%;
          border: 1.5px solid #e2e2dc;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          color: #1a1a18;
          background: #fafaf8;
          transition: all 0.15s ease;
          outline: none;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #3f7d20;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(63, 125, 32, 0.08);
        }

        .form-input::placeholder { color: #bbb8b0; }

        /* Rich text editor */
        .editor-wrapper {
          border: 1.5px solid #e2e2dc;
          border-radius: 10px;
          background: #fafaf8;
          transition: all 0.15s ease;
          overflow: hidden;
        }

        .editor-wrapper:focus-within {
          border-color: #3f7d20;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(63, 125, 32, 0.08);
        }

        /* Toolbar */
        .editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
          padding: 8px 10px;
          background: #f4f4f0;
          border-bottom: 1px solid #e2e2dc;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          color: #555550;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: all 0.12s ease;
          flex-shrink: 0;
        }

        .toolbar-btn:hover {
          background: #e8e8e2;
          color: #1a1a18;
        }

        .toolbar-btn.active {
          background: #3f7d20;
          color: #fff;
        }

        .toolbar-sep {
          width: 1px;
          height: 20px;
          background: #ddddd8;
          margin: 0 4px;
          flex-shrink: 0;
        }

        .toolbar-select {
          height: 28px;
          border: 1px solid #e2e2dc;
          border-radius: 6px;
          background: #fff;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          color: #555550;
          padding: 0 6px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.12s;
        }

        .toolbar-select:hover { border-color: #3f7d20; }

        /* Color picker popup */
        .color-picker-wrapper {
          position: relative;
        }

        .color-picker-popup {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #e2e2dc;
          border-radius: 10px;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(5, 22px);
          gap: 5px;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        }

        .color-swatch {
          width: 22px;
          height: 22px;
          border-radius: 5px;
          border: 1.5px solid rgba(0,0,0,0.10);
          cursor: pointer;
          transition: transform 0.1s;
        }

        .color-swatch:hover { transform: scale(1.2); border-color: #3f7d20; }

        /* Link popup */
        .link-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.18);
        }

        .link-popup {
          background: #fff;
          border-radius: 14px;
          padding: 24px;
          width: 340px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          border: 1px solid #e8e8e2;
        }

        .link-popup h4 {
          font-family: 'Instrument Serif', serif;
          font-size: 18px;
          color: #1a1a18;
          margin: 0 0 16px;
        }

        .link-popup input {
          width: 100%;
          border: 1.5px solid #e2e2dc;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          background: #fafaf8;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 10px;
          transition: border-color 0.15s;
        }

        .link-popup input:focus {
          border-color: #3f7d20;
          box-shadow: 0 0 0 3px rgba(63,125,32,0.08);
        }

        .link-popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 4px;
        }

        /* Editable content area */
        .editor-content {
          min-height: 140px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          line-height: 1.6;
          outline: none;
        }

        .editor-content:empty::before {
          content: attr(data-placeholder);
          color: #bbb8b0;
          pointer-events: none;
        }

        .editor-content a { color: #3f7d20; text-decoration: underline; }

        /* File upload zone */
        .file-upload-zone {
          border: 1.5px dashed #d8d8d0;
          border-radius: 10px;
          padding: 24px;
          background: #fafaf8;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .file-upload-zone:hover {
          border-color: #3f7d20;
          background: #f6faf3;
        }

        .file-upload-zone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .file-upload-icon {
          width: 36px;
          height: 36px;
          margin: 0 auto 10px;
          background: #eef5ea;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3f7d20;
        }

        .file-upload-text {
          font-size: 13px;
          color: #666660;
          font-weight: 400;
        }

        .file-upload-hint {
          font-size: 11.5px;
          color: #aaa8a0;
          margin-top: 4px;
        }

        .file-list {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          background: #f0f5ec;
          border-radius: 7px;
          font-size: 12.5px;
          color: #3f7d20;
          font-weight: 500;
        }

        .form-divider {
          height: 1px;
          background: #eeeeea;
          margin: 28px 0;
        }

        /* Publish toggle */
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #fafaf8;
          border: 1.5px solid #e8e8e2;
          border-radius: 10px;
        }

        .toggle-left { display: flex; flex-direction: column; gap: 2px; }
        .toggle-title { font-size: 13.5px; font-weight: 500; color: #333330; }
        .toggle-desc { font-size: 12px; color: #999992; font-weight: 300; }

        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

        .toggle-slider {
          position: absolute;
          inset: 0;
          background: #d8d8d0;
          border-radius: 24px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .toggle-slider::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          left: 3px;
          top: 3px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .toggle-switch input:checked + .toggle-slider { background: #3f7d20; }
        .toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }

        /* Form footer */
        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #eeeeea;
        }

        /* Alerts */
        .alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .alert-error {
          background: #fff3f3;
          border: 1px solid #ffd0d0;
          color: #c0392b;
        }

        .alert-success {
          background: #f2fbef;
          border: 1px solid #c0e8b4;
          color: #2d6a1f;
        }

        /* Buttons */
        .btn-cancel {
          font-size: 13.5px;
          font-weight: 400;
          color: #888882;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px 0;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }

        .btn-cancel:hover { color: #1a1a18; }

        .btn-submit {
          background: #1a1a18;
          color: #f5f4f0;
          border: none;
          border-radius: 10px;
          padding: 12px 28px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.1px;
        }

        .btn-submit:hover:not(:disabled) { background: #3f7d20; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-link-action {
          background: none;
          border: 1.5px solid #e2e2dc;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.12s;
          color: #888882;
        }

        .btn-link-action:hover { border-color: #888882; color: #1a1a18; }

        .btn-link-insert {
          background: #1a1a18;
          color: #f5f4f0;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-link-insert:hover { background: #3f7d20; }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          animation: pulse 0.8s infinite alternate;
        }

        @keyframes pulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 768px) {
          .notice-sidebar { display: none; }
          .notice-main { padding: 28px 20px; }
        }
      `}</style>

      {/* Link popup modal */}
      {activeLinkPopup && (
        <div className="link-popup-overlay" onClick={() => setActiveLinkPopup(false)}>
          <div className="link-popup" onClick={(e) => e.stopPropagation()}>
            <h4>Insert Link</h4>
            <input
              type="text"
              placeholder="Display text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              autoFocus
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsertLink()}
            />
            <div className="link-popup-actions">
              <button className="btn-link-action" onClick={() => setActiveLinkPopup(false)}>Cancel</button>
              <button className="btn-link-insert" onClick={handleInsertLink}>Insert</button>
            </div>
          </div>
        </div>
      )}

      <div className="notice-root">
        {/* Sidebar */}
        <aside className="notice-sidebar">
          <div className="sidebar-brand">Studly</div>

          <div className="sidebar-label">Workspace</div>
          <nav className="sidebar-nav">
            <div onClick={() => navigate('/dashboard')} className="sidebar-nav-item">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Dashboard
            </div>
            <div onClick={() => navigate('/course')} className="sidebar-nav-item">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Courses
            </div>
            <div className="sidebar-nav-item active">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              Notices
            </div>
            <div className="sidebar-nav-item">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Students
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {(user?.name || "G").charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || "Guest"}</span>
                <span className="sidebar-user-role">Instructor</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="notice-main">
          <div className="page-header">
            <div className="breadcrumb">
              <span>Courses</span>
              <span className="breadcrumb-sep">/</span>
              <span>Notices</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">New Notice</span>
            </div>
            <h1 className="page-title">Create Notice</h1>
            <p className="page-subtitle">Post an announcement or update for your students</p>
          </div>

          <div className="notice-card">
            <div className="card-section-label">Notice Details</div>

            {error && (
              <div className="alert alert-error">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Assignment deadline extended"
                  required
                />
              </div>

              {/* Rich Text Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <div className="editor-wrapper">

                  {/* Toolbar */}
                  <div className="editor-toolbar">

                    {/* Font size */}
                    <select
                      className="toolbar-select"
                      style={{ width: 70 }}
                      onChange={(e) => { editorRef.current?.focus(); handleFontSize(e.target.value); e.target.value = ""; }}
                      defaultValue=""
                    >
                      <option value="" disabled>Size</option>
                      <option value="11px">11</option>
                      <option value="13px">13</option>
                      <option value="15px">15</option>
                      <option value="18px">18</option>
                      <option value="22px">22</option>
                      <option value="28px">28</option>
                      <option value="36px">36</option>
                    </select>

                    {/* Heading style */}
                    <select
                      className="toolbar-select"
                      style={{ width: 90 }}
                      onChange={(e) => { execCmd("formatBlock", e.target.value); e.target.value = ""; }}
                      defaultValue=""
                    >
                      <option value="" disabled>Style</option>
                      <option value="p">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="blockquote">Quote</option>
                    </select>

                    <div className="toolbar-sep" />

                    {/* Bold */}
                    <button type="button" className="toolbar-btn" title="Bold (Ctrl+B)" onClick={() => execCmd("bold")}>
                      <strong>B</strong>
                    </button>

                    {/* Italic */}
                    <button type="button" className="toolbar-btn" title="Italic (Ctrl+I)" onClick={() => execCmd("italic")}>
                      <em style={{ fontStyle: "italic" }}>I</em>
                    </button>

                    {/* Underline */}
                    <button type="button" className="toolbar-btn" title="Underline (Ctrl+U)" onClick={() => execCmd("underline")}>
                      <span style={{ textDecoration: "underline" }}>U</span>
                    </button>

                    {/* Strikethrough */}
                    <button type="button" className="toolbar-btn" title="Strikethrough" onClick={() => execCmd("strikeThrough")}>
                      <span style={{ textDecoration: "line-through" }}>S</span>
                    </button>

                    <div className="toolbar-sep" />

                    {/* Text color */}
                    <div className="color-picker-wrapper">
                      <button
                        type="button"
                        className="toolbar-btn"
                        title="Text color"
                        onClick={() => { saveSelection(); setActiveColorPicker(!activeColorPicker); setActiveBgColorPicker(false); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 7l6 0M12 3v16M8 20h8" />
                        </svg>
                        <span style={{ width: 10, height: 3, background: "#3f7d20", borderRadius: 2, display: "block", marginTop: 1 }} />
                      </button>
                      {activeColorPicker && (
                        <div className="color-picker-popup">
                          {textColors.map((c) => (
                            <div
                              key={c}
                              className="color-swatch"
                              style={{ background: c }}
                              onClick={() => handleColor(c)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Highlight / bg color */}
                    <div className="color-picker-wrapper">
                      <button
                        type="button"
                        className="toolbar-btn"
                        title="Highlight color"
                        onClick={() => { saveSelection(); setActiveBgColorPicker(!activeBgColorPicker); setActiveColorPicker(false); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 19h20L12 2z" />
                        </svg>
                        <span style={{ width: 10, height: 3, background: "#ffeaa7", borderRadius: 2, display: "block", marginTop: 1 }} />
                      </button>
                      {activeBgColorPicker && (
                        <div className="color-picker-popup">
                          {bgColors.map((c) => (
                            <div
                              key={c}
                              className="color-swatch"
                              style={{ background: c }}
                              onClick={() => handleBgColor(c)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="toolbar-sep" />

                    {/* Align */}
                    <button type="button" className="toolbar-btn" title="Align left" onClick={() => execCmd("justifyLeft")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
                      </svg>
                    </button>
                    <button type="button" className="toolbar-btn" title="Align center" onClick={() => execCmd("justifyCenter")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                      </svg>
                    </button>
                    <button type="button" className="toolbar-btn" title="Align right" onClick={() => execCmd("justifyRight")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
                      </svg>
                    </button>

                    <div className="toolbar-sep" />

                    {/* Lists */}
                    <button type="button" className="toolbar-btn" title="Bullet list" onClick={() => execCmd("insertUnorderedList")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
                        <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/>
                        <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
                        <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
                      </svg>
                    </button>
                    <button type="button" className="toolbar-btn" title="Numbered list" onClick={() => execCmd("insertOrderedList")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
                        <text x="2" y="9" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">1.</text>
                        <text x="2" y="15" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">2.</text>
                        <text x="2" y="21" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">3.</text>
                      </svg>
                    </button>

                    {/* Indent */}
                    <button type="button" className="toolbar-btn" title="Indent" onClick={() => execCmd("indent")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><polyline points="3 12 7 15 3 18"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/>
                      </svg>
                    </button>
                    <button type="button" className="toolbar-btn" title="Outdent" onClick={() => execCmd("outdent")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><polyline points="7 12 3 15 7 18"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/>
                      </svg>
                    </button>

                    <div className="toolbar-sep" />

                    {/* Link */}
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Insert link"
                      onClick={() => { saveSelection(); setActiveLinkPopup(true); setActiveColorPicker(false); setActiveBgColorPicker(false); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                      </svg>
                    </button>

                    {/* Unlink */}
                    <button type="button" className="toolbar-btn" title="Remove link" onClick={() => execCmd("unlink")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                        <line x1="2" y1="2" x2="22" y2="22"/>
                      </svg>
                    </button>

                    <div className="toolbar-sep" />

                    {/* Clear formatting */}
                    <button type="button" className="toolbar-btn" title="Clear formatting" onClick={() => execCmd("removeFormat")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 8h12M10 3l-4 18M14 3l-4 18"/>
                        <line x1="17" y1="14" x2="22" y2="19"/><line x1="22" y1="14" x2="17" y2="19"/>
                      </svg>
                    </button>

                    {/* Undo / Redo */}
                    <div className="toolbar-sep" />
                    <button type="button" className="toolbar-btn" title="Undo (Ctrl+Z)" onClick={() => execCmd("undo")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/>
                      </svg>
                    </button>
                    <button type="button" className="toolbar-btn" title="Redo (Ctrl+Y)" onClick={() => execCmd("redo")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Editable area */}
                  <div
                    ref={editorRef}
                    className="editor-content"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Write the full notice content here..."
                    onClick={() => { setActiveColorPicker(false); setActiveBgColorPicker(false); }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Attachments <span style={{ color: '#bbb8b0', fontWeight: 300 }}>(optional · max 2MB)</span>
                </label>
                <div className="file-upload-zone">
                  <input type="file" multiple onChange={handleFiles} />
                  <div className="file-upload-icon">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                  </div>
                  <p className="file-upload-text">Click to upload or drag and drop</p>
                  <p className="file-upload-hint">PDF, DOC, PNG, JPG supported</p>
                </div>
                {attachments.length > 0 && (
                  <div className="file-list">
                    {attachments.map((f, i) => (
                      <div className="file-item" key={i}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                        {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-divider" />

              <div className="card-section-label">Visibility</div>

              <div className="toggle-row">
                <div className="toggle-left">
                  <span className="toggle-title">Publish immediately</span>
                  <span className="toggle-desc">Students will be notified right away</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={() => setIsPublished(!isPublished)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => navigate('/course')}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? (
                    <>
                      <span className="loading-dot" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Publish Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default NoticePage;