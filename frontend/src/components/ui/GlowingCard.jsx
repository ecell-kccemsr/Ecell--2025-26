import React, { useEffect, useRef } from "react";
import "./GlowingCard.css";

const GlowingCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={cardRef} className={`glowing-card ${className}`}>
      {children}
    </div>
  );
};

export default GlowingCard;
