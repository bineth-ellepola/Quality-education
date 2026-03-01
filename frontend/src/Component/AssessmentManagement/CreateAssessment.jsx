import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Assessment.css";

function CreateAssessment() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        totalMarks: "",
        dueDate: "",
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, description, totalMarks, dueDate } = formData;

        if (!title || !description || !totalMarks || !dueDate) {
            alert("All fields are required.");
            return;
        }

        if (Number(totalMarks) < 0) {
            alert("Total marks cannot be negative.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(dueDate);
        if (selectedDate < today) {
            alert("Due date cannot be in the past.");
            return;
        }

        setLoading(true);

        try {
            let fileUrl = null;
            let fileName = null;

            if (file) {
                const presignedRes = await API.get(`/assessment/presigned-url`, {
                    params: { fileName: file.name, fileType: file.type }
                });

                const { uploadUrl, publicUrl } = presignedRes.data;

                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type || 'application/octet-stream' }
                });

                fileUrl = publicUrl;
                fileName = file.name;
            }

            await API.post("/assessment", { ...formData, fileUrl, fileName });
            navigate("/view-assessments");
        } catch (err) {
            console.error("Upload Error:", err);
            alert("Failed to create assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            {/* Header */}
            <div className="form-page-header">
                <button className="btn-back" onClick={() => navigate("/view-assessments")}>←</button>
                <div>
                    <h2>Create Assessment</h2>
                    <p>Fill in the details to create a new assessment</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="title">Assessment Title</label>
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

                        <div className="form-group full-width">
                            <label htmlFor="description">Description & Guidelines</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Provide details about the assessment, topics covered, and instructions for students..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="totalMarks">Total Marks</label>
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
                            <label htmlFor="dueDate">Submission Deadline</label>
                            <input
                                id="dueDate"
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Upload Materials</label>
                            <div
                                className={`file-upload-area ${file ? 'has-file' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                {file ? (
                                    <>
                                        <div className="file-upload-icon">✅</div>
                                        <div className="file-upload-selected">{file.name}</div>
                                        <div className="file-upload-hint">Click to change file</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="file-upload-icon">📁</div>
                                        <div className="file-upload-text">
                                            Click to <strong>browse files</strong>
                                        </div>
                                        <div className="file-upload-hint">Supports PDF, DOCX, JPG (Max 5MB)</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
                            {loading ? (
                                <><span className="spinner"></span> Processing...</>
                            ) : (
                                "Submit Assessment"
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/view-assessments")}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAssessment;
