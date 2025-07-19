import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Header";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      setLoading(false);
      return;
    }

    try {
      const API_URL = "/.netlify/functions/auth-reset-password";
      const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Password reset successful! You can now login with your new password."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>Invalid Reset Link</h1>
            <p>The password reset link is invalid or has expired.</p>
            <button
              onClick={() => navigate("/login")}
              className="login-btn"
              style={{ marginTop: "20px" }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <Header />
      {/* Starry Night Background */}
      <div className="starry-background">
        {/* You can add stars here similar to LoginPage */}
      </div>

      {/* Reset Password Form Container */}
      <motion.div
        className="login-container"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          className="login-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h1>Reset Password</h1>
          <p>Enter your new password</p>
        </motion.div>

        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {error && (
            <div
              className="error-message"
              style={{
                color: "#ff4757",
                textAlign: "center",
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "rgba(255, 71, 87, 0.1)",
                borderRadius: "5px",
                border: "1px solid rgba(255, 71, 87, 0.3)",
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="success-message"
              style={{
                color: "#00ff9d",
                textAlign: "center",
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "rgba(0, 255, 157, 0.1)",
                borderRadius: "5px",
                border: "1px solid rgba(0, 255, 157, 0.3)",
              }}
            >
              {message}
            </div>
          )}

          <motion.div
            className="input-group"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
            />
            <span className="input-highlight"></span>
          </motion.div>

          <motion.div
            className="input-group"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength="8"
            />
            <span className="input-highlight"></span>
          </motion.div>

          <motion.button
            type="submit"
            className="login-btn"
            disabled={loading}
            whileHover={{
              scale: loading ? 1 : 1.05,
              boxShadow: loading
                ? "none"
                : "0 10px 30px rgba(0, 255, 157, 0.3)",
            }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>

          <div className="login-options">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="forgot-password"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Back to Login
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
