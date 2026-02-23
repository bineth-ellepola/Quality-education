import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./Assessment.css";

function UpdateAssessment() {
    const { id } = useParams();
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
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const res = await API.get(`/assessment/${id}`);
                const data = res.data;
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    totalMarks: data.totalMarks || "",
                    dueDate: data.dueDate ? data.dueDate.substring(0, 10) : "",
                });
            } catch (err) {
                console.error(err);
                alert("Failed to fetch assessment data");
                navigate("/view-assessments");
            } finally {
                setFetching(false);
            }
        };

        fetchAssessment();
    }, [id, navigate]);

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
            let updatePayload = { ...formData };

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

                updatePayload.fileUrl = publicUrl;
                updatePayload.fileName = file.name;
            }

            await API.put(`/assessment/${id}`, updatePayload);
            navigate("/view-assessments");
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="form-page">
                <div className="form-page-header">
                    <button className="btn-back" onClick={() => navigate("/view-assessments")}>←</button>
                    <div>
                        <h2>Update Assessment</h2>
                        <p>Loading assessment data...</p>
                    </div>
                </div>
                <div className="form-card">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-input"></div>
                        </div>
                        <div className="form-group full-width">
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-input" style={{ height: '130px' }}></div>
                        </div>
                        <div className="form-group">
                            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                            <div className="skeleton skeleton-input"></div>
                        </div>
                        <div className="form-group">
                            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                            <div className="skeleton skeleton-input"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            {/* Header */}
            <div className="form-page-header">
                <button className="btn-back" onClick={() => navigate("/view-assessments")}>←</button>
                <div>
                    <h2>Update Assessment</h2>
                    <p>Modify the assessment details below</p>
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
                                placeholder="Provide details about the assessment..."
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
                            <label>Update Attachment</label>
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
                                        <div className="file-upload-hint">Leave empty to keep existing file</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
                            {loading ? (
                                <><span className="spinner"></span> Updating...</>
                            ) : (
                                "Save Changes"
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

export default UpdateAssessment;
