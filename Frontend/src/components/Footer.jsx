import React from "react";
import "../index.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            Bookify<span>.</span>
          </h2>

          <p>
            Bringing stories to life, one page at a time. Join our community of
            readers today.
          </p>

          <div className="social-links">
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Shop</a>
            </li>
            <li>
              <a href="#">Categories</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="#">Order Tracking</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Get the latest book releases in your inbox.</p>

          <div className="newsletter-form">
            <input type="email" placeholder="Email address" />
            <button>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Bookify Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
