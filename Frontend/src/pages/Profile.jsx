import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      // If no user is found, redirect to the login/auth page
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <main className="shop-wrapper">
      <section className="profile-container fade-in">
        <div className="profile-card-premium">
          <div className="profile-user-avatar">
             <i className="fas fa-user-circle"></i>
          </div>

          {user ? (
            <div className="profile-info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{user.full_name}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <p>{user.phone_no || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>User Role</label>
                <p className="role-badge">{user.role}</p>
              </div>
              <div className="info-item full-width">
                <label>Shipping Address</label>
                <p>{user.address || "No address saved"}</p>
              </div>
            </div>
          ) : (
            <p>Loading user information...</p>
          )}

          <div className="profile-actions">
            <button className="logout-btn-card" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;