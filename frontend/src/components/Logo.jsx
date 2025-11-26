// import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = ({ style }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", cursor: "pointer", ...style }}
      onClick={handleClick}
    >
      <circle cx="32" cy="32" r="32" fill="transparent" />
      <image href="/ecelllogo.jpg" x="0" y="0" height="64" width="64" />
    </svg>
  );
};

export default Logo;
