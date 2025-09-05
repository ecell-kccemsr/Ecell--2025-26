import React from "react";
import { Link } from "react-router-dom";

const UnderMaintenance = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#0a0a0a",
      color: "#fff",
    }}
  >
    <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
      🚧 Under Maintenance 🚧
    </h1>
    <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
      This page is currently under maintenance. Please check back later.
    </p>
    <Link
      to="/"
      style={{
        padding: "0.75rem 2rem",
        background: "#1e90ff",
        color: "#fff",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "1.1rem",
      }}
    >
      Go Back Home
    </Link>
  </div>
);

export default UnderMaintenance;
