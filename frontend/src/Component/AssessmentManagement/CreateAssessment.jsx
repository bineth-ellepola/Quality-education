import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Assessment.css";

function CreateAssessment() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        totalMarks: "",
        dueDate: "",
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("totalMarks", formData.totalMarks);
            data.append("dueDate", formData.dueDate);
            if (file) data.append("file", file);

            await API.post("/assessment", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Redirect to View Assessments
            navigate("/view-assessments");
        } catch (err) {
            console.error(err);
            alert("Failed to create assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="assessment-container">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Create Assessment</h2>
            </div>

            <div className="assessment-layout">
                <div className="form-column">
                    <form onSubmit={handleSubmit} className="assessment-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="title">ASSESSMENT TITLE</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Midterm Advanced Mathematics"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="description">DESCRIPTION & GUIDELINES</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Provide details about the assessment, topics covered, and instructions for students..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="totalMarks">TOTAL MARKS</label>
                                <input
                                    id="totalMarks"
                                    type="number"
                                    name="totalMarks"
                                    placeholder="100"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dueDate">SUBMISSION DEADLINE</label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="file">UPLOAD MATERIALS (PDF, IMAGES, ETC.)</label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <input
                                        id="file"
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{ border: 'none', background: 'transparent', padding: 0 }}
                                    />
                                    <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                        {file ? `Selected: ${file.name}` : "Support PDF, DOCX, and JPG (Max 5MB)"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                                {loading ? "Processing..." : "Submit Assessment"}
                            </button>
                            <button
                                type="button"
                                className="btn-edit"
                                style={{ flex: 1, height: 'auto', margin: 0 }}
                                onClick={() => navigate("/view-assessments")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAssessment;
