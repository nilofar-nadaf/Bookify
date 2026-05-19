import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));

    if (!storedAdmin || storedAdmin.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    setAdminUser(storedAdmin);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <main className="shop-wrapper">
      <section className="admin-dashboard-card fade-in">
        <p className="section-tag">Admin Profile</p>
        <h1 className="title-text">Admin Information</h1>

        {adminUser ? (
          <div className="admin-dashboard-content">
            <p>
              Name: <strong>{adminUser.full_name}</strong>
            </p>
            <p>Email: {adminUser.email}</p>
            <p>Role: {adminUser.role}</p>
            <p>Phone: {adminUser.phone_no || "Not Provided"}</p>
            <p>Address: {adminUser.address || "Not Provided"}</p>
          </div>
        ) : (
          <p>Loading admin information...</p>
        )}

        <button className="logout-btn-card" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </main>
  );
};

export default AdminProfile;
