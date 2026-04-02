import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Trash2,
  RotateCcw,
  Loader2,
  LogOut,
  User,
  Archive,
  Search,
} from "lucide-react";
import { useAppContext } from "./AppProvider";
import { useNavigate } from "react-router-dom";

const AdminDeletedCourses = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeletedCourses = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/admin/deleted-courses");
      setDeletedCourses(data.data);
    } catch (error) {
      toast.error("Failed to fetch deleted courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const handleRestore = async (courseId) => {
    try {
      await axios.patch(`http://localhost:5001/api/admin/courses/${courseId}/restore`);
      toast.success("Course restored successfully");
      setDeletedCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (error) {
      toast.error("Restoration failed");
    }
  };

  const handlePermanentDelete = async (courseId) => {
    if (!window.confirm("This action is irreversible. Proceed?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/courses/${courseId}/permanent`);
      toast.success("Course permanently removed");
      setDeletedCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const filteredCourses = deletedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adc-root {
          display: flex;
          min-height: 100vh;
          background: #F5F5F0;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
        }

        /* ── Sidebar ── */
        .adc-sidebar {
          width: 220px;
          min-width: 220px;
          background: #12438c;
          border-right: 1px solid #E8E8E2;
          display: flex;
          flex-direction: column;
          padding: 28px 16px;
        }

        .adc-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px;
          margin-bottom: 32px;
        }

        .adc-logo-icon {
          width: 32px;
          height: 32px;
          background: #1a1a1a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .adc-logo-text {
          font-size: 25px;
          font-weight: 600;
          letter-spacing: -0.3px;
          color: #ffffff;
        }

        .adc-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .adc-nav-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #6b6b6b;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          transition: background 0.15s, color 0.15s;
        }

        .adc-nav-item.active {
          background: #F0F0EA;
          color: #1a1a1a;
        }

        .adc-nav-item:hover:not(.active) {
          background: #F7F7F3;
          color: #1a1a1a;
        }

        .adc-sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid #E8E8E2;
          margin-top: auto;
        }

        .adc-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px;
          margin-bottom: 12px;
        }

        .adc-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ff0000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          border: 1px solid #E8E8E2;
        }

        .adc-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .adc-user-email {
          font-size: 11px;
          color: #ffd000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .adc-logout-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #ffffff;
          cursor: pointer;
          border: none;
          background: #ff0000;
          width: 100%;
          transition: background 0.15s, color 0.15s;
        }

        .adc-logout-btn:hover {
          background: #ff0000;
          color: #ffffff;
        }

        /* ── Main ── */
        .adc-main {
          flex: 1;
          padding: 36px 40px;
          overflow-y: auto;
        }

        /* ── Header ── */
        .adc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .adc-header-left h1 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.4px;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .adc-header-left p {
          font-size: 13px;
          color: #9a9a9a;
          margin-top: 4px;
          font-weight: 400;
        }

        /* ── Search ── */
        .adc-search-wrap {
          position: relative;
        }

        .adc-search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          pointer-events: none;
        }

        .adc-search-input {
          width: 224px;
          padding: 8px 14px 8px 34px;
          border: 1px solid #E8E8E2;
          border-radius: 8px;
          background: #ffffff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .adc-search-input:focus {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }

        .adc-search-input::placeholder { color: #bbb; }

        /* ── Stats row ── */
        .adc-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .adc-stat-card {
          background: #ffffff;
          border: 1px solid #E8E8E2;
          border-radius: 10px;
          padding: 14px 20px;
          min-width: 130px;
        }

        .adc-stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #9a9a9a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .adc-stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          font-family: 'DM Mono', monospace;
          letter-spacing: -1px;
        }

        /* ── Table card ── */
        .adc-card {
          background: #ffffff;
          border: 1px solid #E8E8E2;
          border-radius: 12px;
          overflow: hidden;
        }

        .adc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .adc-table thead tr {
          border-bottom: 1px solid #E8E8E2;
          background: #FAFAF8;
        }

        .adc-table thead th {
          padding: 11px 20px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #aaaaaa;
          white-space: nowrap;
        }

        .adc-table thead th:last-child {
          text-align: right;
        }

        .adc-table tbody tr {
          border-bottom: 1px solid #F2F2EE;
          transition: background 0.1s;
        }

        .adc-table tbody tr:last-child {
          border-bottom: none;
        }

        .adc-table tbody tr:hover {
          background: #FAFAF8;
        }

        .adc-table td {
          padding: 14px 20px;
          vertical-align: middle;
        }

        /* course title */
        .adc-course-title {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 13.5px;
          line-height: 1.3;
        }

        /* instructor badge */
        .adc-badge {
          display: inline-block;
          padding: 3px 9px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          background: #F0F0EA;
          color: #5a5a5a;
          white-space: nowrap;
        }

        /* date */
        .adc-date-main {
          font-size: 13px;
          font-weight: 500;
          color: #3a3a3a;
          font-family: 'DM Mono', monospace;
        }

        .adc-date-time {
          font-size: 11px;
          color: #b0b0b0;
          font-family: 'DM Mono', monospace;
          margin-top: 2px;
        }

        /* reason */
        .adc-reason {
          font-size: 12.5px;
          color: #7a7a7a;
          max-width: 180px;
          line-height: 1.45;
        }

        .adc-reason.empty {
          color: #c0c0c0;
          font-style: italic;
        }

        /* action buttons */
        .adc-actions {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
        }

        .adc-btn-icon {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          cursor: pointer;
          background: transparent;
          color: #b0b0b0;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }

        .adc-btn-icon.restore:hover {
          background: #EEF2FF;
          color: #4F46E5;
          border-color: #C7D2FE;
        }

        .adc-btn-icon.delete:hover {
          background: #FEF2F2;
          color: #DC2626;
          border-color: #FECACA;
        }

        /* loading */
        .adc-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 80px 0;
          color: #9a9a9a;
          font-size: 13px;
        }

        .adc-spin {
          animation: spin 0.8s linear infinite;
          color: #1a1a1a;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* empty */
        .adc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 72px 0;
          text-align: center;
        }

        .adc-empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #F5F5F0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c0c0c0;
          margin-bottom: 14px;
        }

        .adc-empty h3 {
          font-size: 14px;
          font-weight: 600;
          color: #3a3a3a;
          margin-bottom: 4px;
        }

        .adc-empty p {
          font-size: 13px;
          color: #aaa;
          max-width: 220px;
        }

        @media (max-width: 768px) {
          .adc-sidebar { display: none; }
          .adc-main { padding: 24px 20px; }
          .adc-search-input { width: 100%; }
        }
      `}</style>

      <div className="adc-root">
        {/* ── Sidebar ── */}
        <aside className="adc-sidebar">
          <div className="adc-logo">
             
            <span className="adc-logo-text">Studly.com</span>
          </div>

          <nav className="adc-nav">
            <button className="adc-nav-item active">
              <Archive size={15} />
              Archive Logs
            </button>
          </nav>

          <div className="adc-sidebar-footer">
            <div className="adc-user-row">
              <div className="adc-avatar">
                <User size={16} />
              </div>
              <div style={{ overflow: "hidden" }}>
                <div className="adc-user-name">{user?.name || "Admin"}</div>
                <div className="adc-user-email">{user?.email}</div>
              </div>
            </div>
            <button className="adc-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="adc-main">
          {/* Header */}
          <header className="adc-header">
            <div className="adc-header-left">
              <h1>Course Archive</h1>
              <p>Manage and recover previously deleted courses.</p>
            </div>
            <div className="adc-search-wrap">
              <Search className="adc-search-icon" size={14} />
              <input
                type="text"
                className="adc-search-input"
                placeholder="Search courses…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {/* Stats */}
          <div className="adc-stats">
            <div className="adc-stat-card">
              <div className="adc-stat-label">Total Archived</div>
              <div className="adc-stat-value">{deletedCourses.length}</div>
            </div>
            <div className="adc-stat-card">
              <div className="adc-stat-label">Filtered Results</div>
              <div className="adc-stat-value">{filteredCourses.length}</div>
            </div>
          </div>

          {/* Table Card */}
          <div className="adc-card">
            {loading ? (
              <div className="adc-loading">
                <Loader2 size={24} className="adc-spin" />
                <span>Loading archived courses…</span>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="adc-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Instructor</th>
                      <th>Delete Reason</th>
                      <th>Removed On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course._id}>
                        {/* Course */}
                        <td>
                          <div className="adc-course-title">{course.title}</div>
                        </td>

                        {/* Instructor */}
                        <td>
                          <span className="adc-badge">
                            {course.instructor?.name || "System"}
                          </span>
                        </td>

                        {/* Delete Reason — separate column */}
                        <td>
                          <span className={`adc-reason${!course.deleteReason ? " empty" : ""}`}>
                            {course.deleteReason || "No reason provided"}
                          </span>
                        </td>

                        {/* Removed On */}
                        <td>
                          <div className="adc-date-main">
                            {new Date(course.deletedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="adc-date-time">
                            {new Date(course.deletedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="adc-actions">
                            <button
                              className="adc-btn-icon restore"
                              onClick={() => handleRestore(course._id)}
                              title="Restore Course"
                            >
                              <RotateCcw size={15} />
                            </button>
                            <button
                              className="adc-btn-icon delete"
                              onClick={() => handlePermanentDelete(course._id)}
                              title="Permanently Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCourses.length === 0 && (
                  <div className="adc-empty">
                    <div className="adc-empty-icon">
                      <Archive size={22} />
                    </div>
                    <h3>No archived courses</h3>
                    <p>
                      {searchTerm
                        ? "No results match your search."
                        : "The archive is currently empty."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDeletedCourses;