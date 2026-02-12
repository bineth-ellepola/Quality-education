import React, { useEffect, useState } from "react";
import API from "../api";

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
    await API.delete(`/assessment/${id}`);
    fetchAssessments();
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
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Assessment Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={formData.totalMarks}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
        <br /><br />

        {!editingId && (
          <>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <br /><br />
          </>
        )}

        <button type="submit">
          {editingId ? "Update Assessment" : "Create Assessment"}
        </button>
      </form>

      {/* LIST */}
      <h3>All Assessments</h3>
      {assessments.map((a) => (
        <div
          key={a._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h4>{a.title}</h4>
          <p>{a.description}</p>
          <p>Total Marks: {a.totalMarks}</p>
          <p>Due Date: {new Date(a.dueDate).toLocaleDateString()}</p>

          {a.fileUrl && (
            <a href={a.fileUrl} target="_blank" rel="noreferrer">
              View File
            </a>
          )}

          <br /><br />

          <button onClick={() => handleEdit(a)}>Edit</button>
          <button onClick={() => handleDelete(a._id)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Assessment;
