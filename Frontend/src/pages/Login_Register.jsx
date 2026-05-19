import React, { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login_Register = () => {
  const navigate = useNavigate();
  // 🔹 STATE
  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_no: "",
    address: "",
    role: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // 🔹 HANDLE INPUT CHANGE
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // 🔹 REGISTER
  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/users/register", registerData);
    alert(res.data);

    // 👉 Redirect to login
    document.getElementById("signIn").click();

  } catch (err) {
    console.log(err);
  }
};

  // 🔹 LOGIN
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", loginData);

    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");

      // 🔥 Force reload so navbar updates
      window.location.href = "/profile";

    } else {
      alert(res.data.message);
    }

  } catch (err) {
    console.log(err);
  }
};
  // 🔹 UI TOGGLE EFFECT
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("auth-container");

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
      });
    }
  }, []);

  return (
    <div className="auth-page-body">
      <main className="auth-section">
        <div className="auth-container" id="auth-container">

          {/* SIGN UP */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleRegister}>
              <p className="section-tag">New Reader?</p>
              <h2>Start your <span style={{ fontSize: "30px" }}>adventure...</span></h2>

              <input type="text" name="full_name" placeholder="Full Name" onChange={handleRegisterChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleRegisterChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleRegisterChange} required />
              <input type="tel" name="phone_no" placeholder="Phone No" onChange={handleRegisterChange} />
              <input type="text" name="address" placeholder="Address" onChange={handleRegisterChange} />

              <select className="auth-action-btn role" name="role" onChange={handleRegisterChange} required>
                <option value="">Select Role</option>
                <option value="user">Reader(User)</option>
                <option value="admin">Author(Admin)</option>
              </select>

              <button className="auth-action-btn signup" type="submit">Sign Up</button>
            </form>
          </div>

          {/* LOGIN */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
              <p className="section-tag">Welcome Back!</p>
              <h2>Continue your <span style={{ fontSize: "30px" }}>story.</span></h2>

              <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} required />

              <button className="auth-action-btn login" type="submit">Login</button>
              <button
                type="button"
                className="auth-action-btn admin-login-btn"
                onClick={() => navigate("/admin/login")}
              >
                Admin Login
              </button>
            </form>
          </div>

          {/* OVERLAY */}
          <div className="overlay-container">
            <div className="overlay">

              <div className="overlay-panel overlay-left">
                <h2>Revisit old <span>friends.</span></h2>
                <p>Keep your reading list synchronized across all your devices.</p>
                <button className="ghost auth-toggle-btn" id="signIn">
                  I already have an account
                </button>
              </div>

              <div className="overlay-panel overlay-right">
                <h2>Every page is a new <span>discovery.</span></h2>
                <p>Join a community of thousands exploring stories.</p>
                <button className="ghost auth-toggle-btn" id="signUp">
                  I need to register
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Login_Register;