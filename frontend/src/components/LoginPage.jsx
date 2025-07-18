import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Star = ({ delay, duration, style }) => {
  return (
    <motion.div
      className="star"
      style={style}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5,
      }}
    />
  );
};

const LoginPage = () => {
  const [stars, setStars] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
          animationDelay: Math.random() * 5 + "s",
          animationDuration: 3 + Math.random() * 4 + "s",
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

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

    try {
      const { api } = await import('../utils/api');
      const responseData = await api.auth.login({
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to admin dashboard if user is admin, otherwise to home
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "If an account with that email exists, a password reset link has been sent."
        );
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      {/* Starry Night Background */}
      <div className="starry-background">
        {/* Static Stars */}
        {stars.map((star) => (
          <Star
            key={star.id}
            delay={parseFloat(star.animationDelay)}
            duration={parseFloat(star.animationDuration)}
            style={{
              position: "absolute",
              left: star.left,
              top: star.top,
            }}
          />
        ))}

        {/* Nebula Background Effects */}
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
      </div>

      {/* Login Form Container */}
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
          <h1>Welcome Back</h1>
          <p>Sign in to your E-Cell account</p>
        </motion.div>

        <motion.form
          className="login-form"
          onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit}
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

          {showForgotPassword ? (
            <>
              <h3
                style={{
                  color: "#00ff9d",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                Reset Password
              </h3>
              <motion.div
                className="input-group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
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
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>

              <div className="login-options">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="forgot-password"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#00ff9d",
                  }}
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              <motion.div
                className="input-group"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>

              <div className="login-options">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="forgot-password"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#00ff9d",
                  }}
                >
                  Forgot Password?
                </button>
                <p className="signup-link">
                  Admin access only. Contact administrator for accounts.
                </p>
              </div>
            </>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
