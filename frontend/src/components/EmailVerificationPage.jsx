import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Header";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, success, error

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setError("Invalid or missing verification token");
      setVerificationStatus("error");
    }
  }, [token]);

  const verifyEmail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Email verified successfully! You can now login to your account."
        );
        setVerificationStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Email verification failed");
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Network error. Please try again.");
      setVerificationStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "🔄";
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case "success":
        return "#00ff9d";
      case "error":
        return "#ff4757";
      default:
        return "#667eea";
    }
  };

  return (
    <div className="login-page">
      <Header />
      {/* Starry Night Background */}
      <div className="starry-background">
        {/* You can add stars here similar to LoginPage */}
      </div>

      {/* Verification Container */}
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
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
            {getStatusIcon()}
          </div>
          <h1 style={{ color: getStatusColor() }}>Email Verification</h1>
          <p>
            {loading
              ? "Verifying your email..."
              : verificationStatus === "success"
              ? "Verification successful!"
              : verificationStatus === "error"
              ? "Verification failed"
              : "Processing verification"}
          </p>
        </motion.div>

        <motion.div
          className="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#667eea",
              }}
            >
              <div
                className="spinner"
                style={{
                  border: "3px solid #f3f3f3",
                  borderTop: "3px solid #667eea",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              ></div>
              <p>Verifying your email address...</p>
            </div>
          )}

          {error && (
            <div
              className="error-message"
              style={{
                color: "#ff4757",
                textAlign: "center",
                marginBottom: "1rem",
                padding: "1rem",
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
                padding: "1rem",
                backgroundColor: "rgba(0, 255, 157, 0.1)",
                borderRadius: "5px",
                border: "1px solid rgba(0, 255, 157, 0.3)",
              }}
            >
              {message}
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                  opacity: 0.8,
                }}
              >
                Redirecting to login page in 3 seconds...
              </div>
            </div>
          )}

          <div
            className="login-options"
            style={{ textAlign: "center", marginTop: "2rem" }}
          >
            <motion.button
              onClick={() => navigate("/login")}
              className="login-btn"
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "5px",
                color: "white",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Login
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationPage;
