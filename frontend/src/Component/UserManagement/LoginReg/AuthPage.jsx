import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "Student",
    profilePicture: null,
  });

  //  INPUT CHANGE 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //  FILE CHANGE 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  REGISTER 
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.profilePicture) {
      alert("Please select a profile picture");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart/form-data
      const registerFormData = new FormData();
      registerFormData.append("first_name", formData.first_name);
      registerFormData.append("last_name", formData.last_name);
      registerFormData.append("email", formData.email);
      registerFormData.append("password", formData.password);
      registerFormData.append("role", formData.role);
      registerFormData.append("profilePicture", formData.profilePicture);

      const res = await axios.post(
        "http://localhost:5001/api/users/register",
        registerFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "Student",
        profilePicture: null,
      });
      setProfilePreview(null);
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  //  LOGIN 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5001/api/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const user = res.data.user;

      alert("Login successful");

      // SAVE USER BASED ON ROLE
      if (user.role === "Student") {
        localStorage.setItem("Student", JSON.stringify(user));
        navigate("/student-dashboard");
      } else if (user.role === "Instructor") {
        localStorage.setItem("Instructor", JSON.stringify(user));
        navigate("/instructor-dashboard");
      } else if (user.role === "ADMIN") {
        localStorage.setItem("ADMIN", JSON.stringify(user));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      {/* Left Section - Marketing */}
      <div className="auth-left">
        <div className="auth-brand">
          <h1 className="brand-name">StudLY</h1>
        </div>

        <div className="auth-content">
          <h2 className="main-title">
            Find Your <span>Perfect Learning Path</span>
          </h2>

          <p className="description">
            Manage your learning experience effortlessly — whether you're a student, instructor, or admin.
          </p>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">5,000+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">500+</div>
              <div className="stat-label">Expert Instructors</div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-text">
              "Quality Education makes learning seamless. The platform is intuitive and the courses are always up to date."
            </div>
            <div className="testimonial-user">
              <div className="user-avatar">BE</div>
              <div className="user-info">
                <div className="user-name">Bineth Ellepola</div>
                <div className="user-role">Student, SLIIT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <p className="welcome-tag">{isLogin ? "WELCOME BACK" : "GET STARTED"}</p>
            <h2>{isLogin ? "Sign in to Quality Education" : "Create Your Account"}</h2>
            <p className="auth-subtitle">
              {isLogin ? "Enter your credentials to access your dashboard" : "Join our learning community today"}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
            {!isLogin && (
              <>
                {/* Profile Picture Upload */}
                <div className="profile-picture-section">
                  <label htmlFor="profilePicture" className="profile-label">
                    Profile Picture
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="file-input"
                    />
                    <label htmlFor="profilePicture" className="file-input-label">
                      {profilePreview ? "Change Picture" : "Choose Picture"}
                    </label>
                  </div>
                  {profilePreview && (
                    <div className="profile-preview">
                      <img src={profilePreview} alt="Profile Preview" />
                      <span className="preview-text">✓ Picture selected</span>
                    </div>
                  )}
                </div>

                <div className="name-row">
                  <div className="input-group">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="name-input"
                    />
                  </div>
                  <div className="input-group">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="name-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="role-select"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
              </>
            )}

            <div className="input-group">

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div className="input-group">

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            {isLogin && (
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="auth-footer">
            <p className="switch-text">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span onClick={() => {
                setIsLogin(!isLogin);
                setProfilePreview(null);
                setFormData({
                  first_name: "",
                  last_name: "",
                  email: "",
                  password: "",
                  role: "Student",
                  profilePicture: null,
                });
              }} className="toggle-link">
                {isLogin ? "Create one free →" : "Sign in →"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
