import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        isActive: true
    });
    const [searchTerm, setSearchTerm] = useState("");

    const storedUser = JSON.parse(localStorage.getItem("Admin"));

    if (!storedUser) {
        window.location.href = "/";
    }

    //  LOAD USERS 
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    //  EDIT USER 
    const handleEditUser = (user) => {
        setEditingUser(user._id);
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        });
    };

    //  INPUT CHANGE 
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    //  UPDATE USER 
    const handleUpdateUser = async () => {
        try {
            await axios.put(
                `http://localhost:5001/api/users/${editingUser}`,
                formData
            );
            alert("User updated successfully");
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert("Update failed");
        }
    };

    //  DELETE USER 
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/api/users/${userId}`);
            alert("User deleted successfully");
            fetchUsers();
        } catch (err) {
            alert("Delete failed");
        }
    };

    //  LOGOUT 
    const handleLogout = () => {
        localStorage.removeItem("Admin");
        window.location.href = "/";
    };

    //  FILTER USERS 
    const filteredUsers = users.filter((user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="admin-wrapper">
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <div className="header-content">
                        <h1>Admin Dashboard</h1>
                        <p>Manage all users and system settings</p>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat-box">
                        <div className="stat-number">{users.length}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">{users.filter(u => u.role === "Student").length}</div>
                        <div className="stat-label">Students</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">{users.filter(u => u.role === "Instructor").length}</div>
                        <div className="stat-label">Instructors</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">{users.filter(u => u.isActive).length}</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-results">{filteredUsers.length} results</span>
                </div>

                {/* Users Table */}
                <div className="users-section">
                    <h2>User Management</h2>

                    {filteredUsers.length === 0 ? (
                        <div className="no-users">No users found</div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="profile-cell">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt={user.first_name} />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{user.first_name} {user.last_name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {editingUser && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Edit User</h3>

                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
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
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Instructor">Instructor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />
                                    Active Account
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpdateUser}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditingUser(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
