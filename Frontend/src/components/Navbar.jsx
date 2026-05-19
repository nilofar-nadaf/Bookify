import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../index.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To detect route changes

  useEffect(() => {
    const loadNavbarData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));
      setUser(storedUser);
      setAdminUser(storedAdmin);

      if (storedAdmin && storedAdmin.role === "admin") {
        setCartCount(0);
        return;
      }

      if (!storedUser || !storedUser.id) {
        setCartCount(0);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${storedUser.id}`);
        const count = (response.data || []).reduce(
          (total, item) => total + Number(item.quantity),
          0
        );
        setCartCount(count);
      } catch (error) {
        console.error("Navbar cart fetch failed:", error);
      }
    };

    loadNavbarData();
  }, [location]);

  const goToAdminSection = (path) => {
    setIsAdminMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="navbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <h1>
          Bookify<span>.</span>
        </h1>
      </div>

      <nav className="nav-container">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </nav>

      <div className="nav-actions">
        {adminUser ? (
          <div className="nav-user-actions">
            <div className="admin-menu-wrapper">
              <button
                className="signup-btn"
                onClick={() => setIsAdminMenuOpen((prev) => !prev)}
              >
                Admin Menu
              </button>

              {isAdminMenuOpen && (
                <div className="admin-dropdown-menu">
                  <button onClick={() => goToAdminSection("/admin/profile")}>Admin Profile</button>
                  <button onClick={() => goToAdminSection("/admin/dashboard?tab=users")}>Users</button>
                  <button onClick={() => goToAdminSection("/admin/dashboard?tab=books")}>Books</button>
                  <button onClick={() => goToAdminSection("/admin/dashboard?tab=addBook")}>Add Book</button>
                  <button onClick={() => goToAdminSection("/admin/dashboard?tab=categories")}>Categories</button>
                  <button onClick={() => goToAdminSection("/admin/dashboard?tab=orders")}>Orders</button>
                </div>
              )}
            </div>
          </div>
        ) : user ? (
          <div className="nav-user-actions">
            <div
              className="nav-order-trigger"
              onClick={() => navigate("/orders")}
              title="My Orders"
            >
              <i className="fas fa-box"></i>
            </div>
            <div
              className="nav-cart-trigger"
              onClick={() => navigate("/cart")}
              title="View Cart"
            >
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </div>
            <div
              className="nav-profile-trigger"
              onClick={() => navigate("/profile")}
              title="View Profile"
            >
              <div className="nav-avatar-circle">
                <i className="fas fa-user"></i>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/auth">
            <button className="signup-btn">Login / Sign Up</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;