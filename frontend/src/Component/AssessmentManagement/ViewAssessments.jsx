import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Assessment.css";

function ViewAssessments() {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const res = await API.get("/assessment");
            setAssessments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this assessment?")) {
            try {
                await API.delete(`/assessment/${id}`);
                fetchAssessments();
            } catch (err) {
                console.error(err);
                alert("Failed to delete assessment");
            }
        }
    };

    // Filter
    const filtered = assessments.filter(a =>
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const now = new Date();
    const upcoming = assessments.filter(a => a.dueDate && new Date(a.dueDate) > now).length;
    const overdue = assessments.filter(a => a.dueDate && new Date(a.dueDate) < now).length;

    const getStatusBadge = (dueDate) => {
        if (!dueDate) return null;
        const due = new Date(dueDate);
        if (due < now) return <span className="badge badge-overdue">Overdue</span>;
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3) return <span className="badge badge-upcoming">Due Soon</span>;
        return <span className="badge badge-completed">Active</span>;
    };

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h2>All Assessments</h2>
                    <p>Manage and track all your assessments in one place</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("/add-assessment")}>
                    ＋ New Assessment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stat-cards">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Total Assessments</span>
                        <div className="stat-card-icon">📋</div>
                    </div>
                    <div className="stat-card-value">{assessments.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Upcoming</span>
                        <div className="stat-card-icon">⏳</div>
                    </div>
                    <div className="stat-card-value">{upcoming}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Overdue</span>
                        <div className="stat-card-icon">⚠️</div>
                    </div>
                    <div className="stat-card-value">{overdue}</div>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <span className="search-bar-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search assessments by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton skeleton-input" style={{ marginBottom: '1rem' }}></div>
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <table className="assessment-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Marks</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>File</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a._id}>
                                    <td className="td-title">{a.title}</td>
                                    <td className="td-description">{a.description || "—"}</td>
                                    <td><span className="badge-marks">{a.totalMarks || "0"} pts</span></td>
                                    <td>
                                        {a.dueDate
                                            ? new Date(a.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
                                            : "—"
                                        }
                                    </td>
                                    <td>{getStatusBadge(a.dueDate)}</td>
                                    <td>
                                        {a.fileUrl ? (
                                            <a href={`http://localhost:5001/api/assessment/view/${a._id}`} target="_blank" rel="noreferrer" className="file-link">
                                                📎 {a.fileName || "View"}
                                            </a>
                                        ) : (
                                            <span className="no-file">No file</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button onClick={() => navigate(`/edit-assessment/${a._id}`)} className="btn-edit-small">Edit</button>
                                            <button onClick={() => handleDelete(a._id)} className="btn-delete-small">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h3>No assessments found</h3>
                        <p>{searchTerm ? "Try a different search term" : "Create your first assessment to get started"}</p>
                        {!searchTerm && (
                            <button className="btn-primary" onClick={() => navigate("/add-assessment")}>
                                ＋ Create Assessment
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewAssessments;
