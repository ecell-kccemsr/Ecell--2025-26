import React from "react";

const Logo = ({ style }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", ...style }}
  >
    <circle cx="32" cy="32" r="32" fill="transparent" />
    <image href="/ecelllogo_dark.svg" x="0" y="0" height="64" width="64" />
  </svg>
);

export default Logo;
