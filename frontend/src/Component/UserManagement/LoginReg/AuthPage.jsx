import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";

const AuthPage = () => {

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "Student"
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5001/api/users/register",
        formData
      );

      alert(res.data.message);
      setIsLogin(true);

    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5001/api/users/login",
        {
          email: formData.email,
          password: formData.password
        }
      );

      alert("Login successful");

      // save user (or token later)
      localStorage.setItem("Student", JSON.stringify(res.data.user));

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>

          {!isLogin && (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                required
              />

              <select name="role" onChange={handleChange}>
                <option value="Instructor">Instructor</option>
                <option value="Student">Student</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          className="switch-text"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
};

export default AuthPage;