import React, { useEffect, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, summary, [role='button'], [data-cursor='interactive']";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHidden, setIsHidden] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const handleChange = (event) => setIsEnabled(!event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const findInteractive = (node) => {
      if (!node || typeof node.closest !== "function") return null;
      return node.closest(INTERACTIVE_SELECTOR);
    };

    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handlePointerOver = (event) => {
      if (findInteractive(event.target)) setIsInteractive(true);
    };

    const handlePointerOut = (event) => {
      const isLeavingInteractive = findInteractive(event.target);
      const isEnteringInteractive = findInteractive(event.relatedTarget);
      if (isLeavingInteractive && !isEnteringInteractive) setIsInteractive(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerout", handlePointerOut, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  const dotClasses = ["cursor-dot"];
  const ringClasses = ["cursor-ring"];

  if (isHidden) {
    dotClasses.push("cursor-hidden");
    ringClasses.push("cursor-hidden");
  }

  if (isClicked) {
    dotClasses.push("cursor-clicked");
    ringClasses.push("cursor-clicked");
  }

  if (isInteractive) {
    dotClasses.push("cursor-interactive");
    ringClasses.push("cursor-interactive");
  }

  const dotStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  const ringStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div className={dotClasses.join(" ")} style={dotStyle} />
      <div className={ringClasses.join(" ")} style={ringStyle} />
    </div>
  );
};

export default CustomCursor;
