import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./Assessment.css";

function UpdateAssessment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        totalMarks: "",
        dueDate: "",
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Fetch Assessment Data
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

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 0. Validations
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
                // 1. Get Pre-signed URL from Backend
                const presignedRes = await API.get(`/assessment/presigned-url`, {
                    params: {
                        fileName: file.name,
                        fileType: file.type
                    }
                });

                const { uploadUrl, publicUrl } = presignedRes.data;

                // 2. Upload directly to Supabase S3
                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type || 'application/octet-stream'
                    }
                });

                updatePayload.fileUrl = publicUrl;
                updatePayload.fileName = file.name;
            }

            // 3. Update MongoDB via Backend
            await API.put(`/assessment/${id}`, updatePayload);

            navigate("/view-assessments");
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="assessment-container"><p>Loading assessment data...</p></div>;

    return (
        <div className="assessment-container">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Update Assessment</h2>
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
                                    placeholder="Provide details about the assessment..."
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
                                <label htmlFor="file">UPDATE ATTACHMENT</label>
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
                                        {file ? `New file selected: ${file.name}` : "Leave empty to keep existing file"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                                {loading ? "Updating..." : "Save Changes"}
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

export default UpdateAssessment;
