import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";
const StudentDashboard = () => {

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePreview, setProfilePreview] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("Student"));

  if (!storedUser) {
    window.location.href = "/";
  }

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  //  LOAD USER 
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
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  //  INPUT CHANGE 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //  UPDATE USER 
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

  //  DELETE ACCOUNT 
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/users/${storedUser.id}`
      );

      localStorage.removeItem("Student");
      alert("Account deleted successfully");
      window.location.href = "/";

    } catch (err) {
      alert("Delete failed");
    }
  };

  //  LOGOUT 
  const handleLogout = () => {
    localStorage.removeItem("Student");
    window.location.href = "/";
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <h2>Failed to load user</h2>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Student Dashboard</h1>
            <p>Manage your learning profile</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {!editMode ? (
            <>
              {/* Profile Card */}
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-picture-large">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" />
                    ) : (
                      <div className="profile-placeholder">
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <h2>{user.first_name} {user.last_name}</h2>
                    <p className="role-badge">{user.role}</p>
                    <p className="email">{user.email}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">First Name:</span>
                    <span className="detail-value">{user.first_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Name:</span>
                    <span className="detail-value">{user.last_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account Status:</span>
                    <span className="detail-value status-active">
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Joined:</span>
                    <span className="detail-value">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                  >
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>Courses</h3>
                    <p>0 courses</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>Completed</h3>
                    <p>0 courses</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h3>In Progress</h3>
                    <p>0 courses</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Edit Form */}
              <div className="edit-card">
                <h3>Edit Your Profile</h3>
                
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave empty to keep current password"
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;