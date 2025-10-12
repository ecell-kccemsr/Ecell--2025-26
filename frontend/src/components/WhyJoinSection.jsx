import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./WhyJoinSection.css";

const WhyJoinSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sections = [
    {
      id: 1,
      title: "WE IDEATE",
      description:
        "We brainstorm for new ideas and chalk up a path to implement them successfully.",
      image: "/img1.svg",
      strategy: "Brainstorm: Cloud Sprint",
    },
    {
      id: 2,
      title: "WE INNOVATE",
      description:
        "We transform ideas into reality through cutting-edge solutions and creative problem-solving.",
      image: "/img2.svg",
      strategy: "Strategy: Open Source Drive",
    },
    {
      id: 3,
      title: "WE COLLABORATE",
      description:
        "We help to hone intelligent minds and develop a dynamic environment through dialogue.",
      image: "/img3.svg",
      strategy: "Team Radio LIVE: 'Radio check, driver?'",
    },
  ];

  return (
    <section className="why-join-section" ref={containerRef}>
      <div className="horizontal-scroll-wrapper">
        <div className="why-join-header">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            WHY JOIN <span className="highlight">E-CELL KCCEMSR</span>
          </motion.h2>
        </div>

        <div className="horizontal-scroll-container">
          <motion.div
            className="horizontal-scroll-content"
            style={{
              x: useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]),
            }}
          >
            {sections.map((section, index) => (
              <div key={section.id} className="scroll-section">
                <div className="section-label">SECTOR {section.id}</div>

                <div className="section-content">
                  <div className="content-left">
                    <motion.h3
                      className="section-title"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      {section.title}
                    </motion.h3>

                    <motion.div
                      className="title-underline"
                      initial={{ width: 0 }}
                      whileInView={{ width: "150px" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />

                    <motion.p
                      className="section-description"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {section.description}
                    </motion.p>
                  </div>

                  <motion.div
                    className="content-right"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="strategy-board">
                      <div className="board-header">
                        <span className="strategy-label">STRATEGY</span>
                        <span className="board-text">BOARD</span>
                      </div>
                      <div className="board-content">{section.strategy}</div>
                    </div>

                    <div className="section-image">
                      <img
                        src={section.image}
                        alt={section.title}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="decorative-elements">
                  <div className="grid-pattern grid-1"></div>
                  <div className="grid-pattern grid-2"></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <motion.div
            className="scroll-progress"
            style={{
              scaleX: scrollYProgress,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;
