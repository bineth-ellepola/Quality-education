import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Assessment.css";

function ViewAssessments() {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);

    // Fetch All
    const fetchAssessments = async () => {
        try {
            const res = await API.get("/assessment");
            setAssessments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    // Delete
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

    return (
        <div className="assessment-container full-width">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', width: '100%' }}>
                <h2 className="assessment-header" style={{ margin: 0, border: 'none', padding: 0 }}>All Assessments</h2>
                <button className="btn-primary" onClick={() => navigate("/add-assessment")}>
                    + Add New Assessment
                </button>
            </div>

            <div className="table-container">
                <table className="assessment-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Marks</th>
                            <th>Due Date</th>
                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.map((a) => (
                            <tr key={a._id}>
                                <td style={{ color: '#0f172a', fontWeight: '700' }}>{a.title}</td>
                                <td style={{ maxWidth: '300px' }}>{a.description || "—"}</td>
                                <td><span className="badge-marks">{a.totalMarks || "0"} pts</span></td>
                                <td><strong>{a.dueDate ? new Date(a.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}</strong></td>
                                <td>
                                    {a.fileUrl ? (
                                        <a href={`http://localhost:5001/api/assessment/view/${a._id}`} target="_blank" rel="noreferrer" className="file-link">
                                            📎 {a.fileName || "View Attachment"}
                                        </a>
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No file</span>
                                    )}
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button onClick={() => navigate(`/edit-assessment/${a._id}`)} className="btn-edit-small">Update</button>
                                        <button onClick={() => handleDelete(a._id)} className="btn-delete-small">Remove</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {assessments.length === 0 && <p className="no-data">No assessments found.</p>}
            </div>
        </div>
    );
}

export default ViewAssessments;
