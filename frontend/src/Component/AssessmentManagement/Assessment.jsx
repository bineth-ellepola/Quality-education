import React, { useEffect, useState } from "react";
import API from "../api";
import "./Assessment.css";

function Assessment() {
  const [assessments, setAssessments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalMarks: "",
    dueDate: "",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

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

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        await API.put(`/assessment/${editingId}`, formData);
      } else {
        // CREATE
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("totalMarks", formData.totalMarks);
        data.append("dueDate", formData.dueDate);
        if (file) data.append("file", file);

        await API.post("/assessment", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({
        title: "",
        description: "",
        totalMarks: "",
        dueDate: "",
      });
      setFile(null);
      setEditingId(null);

      fetchAssessments();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      await API.delete(`/assessment/${id}`);
      fetchAssessments();
    }
  };

  // Edit
  const handleEdit = (assessment) => {
    setFormData({
      title: assessment.title,
      description: assessment.description,
      totalMarks: assessment.totalMarks,
      dueDate: assessment.dueDate?.substring(0, 10),
    });
    setEditingId(assessment._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="assessment-container">
      <h2 className="assessment-header">Assessment Management</h2>

      <div className="assessment-layout">
        {/* FORM COLUMN */}
        <div className="form-column">
          <form onSubmit={handleSubmit} className="assessment-form">
            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>
              {editingId ? "Edit Assessment" : "Create New Assessment"}
            </h3>

            <div className="form-group">
              <label htmlFor="title">Assessment Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Midterm Exam"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                placeholder="Briefly describe the assessment..."
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
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            {!editingId && (
              <div className="form-group">
                <label htmlFor="file">Upload Attachment (PDF/Image)</label>
                <input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}

            <button type="submit" className="btn-primary">
              {editingId ? "Update Assessment" : "Create Assessment"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-edit"
                style={{ marginTop: '0.5rem' }}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", description: "", totalMarks: "", dueDate: "" });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* LIST COLUMN */}
        <div className="list-column">
          <h3 className="assessment-list-header">All Assessments</h3>
          <div className="assessment-grid">
            {assessments.map((a) => (
              <div key={a._id} className="assessment-card">
                <h4>{a.title}</h4>
                <p>{a.description || "No description provided."}</p>

                <div className="assessment-meta">
                  <span><strong>Marks:</strong> {a.totalMarks || "N/A"}</span>
                  <span><strong>Due:</strong> {new Date(a.dueDate).toLocaleDateString()}</span>
                </div>

                {a.fileUrl && (
                  <a href={a.fileUrl} target="_blank" rel="noreferrer" className="file-link">
                    📎 View Attachment
                  </a>
                )}

                <div className="card-actions">
                  <button onClick={() => handleEdit(a)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(a._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
