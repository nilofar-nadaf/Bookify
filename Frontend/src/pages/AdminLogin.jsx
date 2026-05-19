import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/users/admin-login", loginData);

      if (res.data.user) {
        localStorage.setItem("adminUser", JSON.stringify(res.data.user));
        alert("Admin login successful");
        navigate("/admin/profile");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      alert("Unable to login as admin.");
    }
  };

  return (
    <div className="auth-page-body">
      <main className="auth-section">
        <div className="admin-login-card">
          <p className="section-tag">Admin Access</p>
          <h2 className="admin-login-title">Login to Admin Dashboard</h2>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="auth-action-btn login">
              Admin Login
            </button>
          </form>

          <Link to="/auth" className="admin-back-link">
            Back to User Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
