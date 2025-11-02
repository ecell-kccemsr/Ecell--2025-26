import React from "react";
import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  // Create 50 lines with different delays and positions
  const lines = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    style: {
      top: `${index * 8}%`,
      left: `${index * 3 - 50}%`,
      animationDelay: `${index * 1}s`,
    },
  }));

  return (
    <div className="animated-background">
      {lines.map((line) => (
        <div key={line.id} className="line" style={line.style} />
      ))}
    </div>
  );
};

export default AnimatedBackground;
