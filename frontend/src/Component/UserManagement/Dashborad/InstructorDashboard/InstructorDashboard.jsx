import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InstructorDashboard.css";

const InstructorDashboard = () => {

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // get instructor from localStorage
  const storedUser = JSON.parse(localStorage.getItem("Instructor"));

if (!storedUser) {
  window.location.href = "/";
}
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  // ================= LOAD USER =================
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/users/${storedUser.id}`
      );

      setUser(res.data);
      setFormData({
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
        password: ""
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE USER =================
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/users/${storedUser.id}`,
        formData
      );

      alert("Profile updated successfully");
      setEditMode(false);
      fetchUser();

    } catch (err) {
      alert("Update failed");
    }
  };

  // ================= DELETE ACCOUNT =================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/users/${storedUser.id}`
      );

      localStorage.removeItem("Instructor");
      alert("Account deleted");

      window.location.href = "/";

    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="dashboard-container">
      <h1>Instructor Dashboard</h1>

      {!editMode ? (
        <>
          <p><b>First Name:</b> {user.first_name}</p>
          <p><b>Last Name:</b> {user.last_name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>

          <button onClick={() => setEditMode(true)}>
            Edit Profile
          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </>
      ) : (
        <>
          <h3>Edit Details</h3>

          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
          />

          <button onClick={handleUpdate}>Save</button>

          <button
            className="cancel-btn"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default InstructorDashboard;