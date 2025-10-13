import React, { useRef } from "react";
import { motion } from "framer-motion";

const WhyNot = () => {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "40vh",
        background: "#101010",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#fff",
            letterSpacing: "2px",
            marginBottom: "1rem",
          }}
        >
          WHY JOIN <span className="highlight">ECELL</span>
        </motion.h1>
      </div>
    </section>
  );
};

export default WhyNot;
