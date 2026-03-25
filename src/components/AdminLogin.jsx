import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/admin.css";

const BASE_URL = "https://portfoliobackendlinker.onrender.com";

export default function AdminLogin({ setAdmin }) {
  const [adminName,    setAdminName]    = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/admin/auth/login`, {
        adminName,
        adminPass: password,
      });

      const token = res.data.token || res.data;

      if (!token) {
        setError("Login failed: no token received.");
        return;
      }

      localStorage.setItem("token", token);
      setAdmin(true);
      navigate("/admin");

    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Invalid admin name or password.");
      } else {
        setError("Server error. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-container">
        <div className="admin-card">

          <h2>Admin Login</h2>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* Admin Name */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Admin Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            className="admin-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          {/* Back to Portfolio — inside card */}
          <button
            className="admin-back-btn"
            onClick={() => navigate("/")}
          >
            <span className="back-arrow">←</span>
            Back to Portfolio
          </button>

        </div>
      </div>
    </div>
  );
}