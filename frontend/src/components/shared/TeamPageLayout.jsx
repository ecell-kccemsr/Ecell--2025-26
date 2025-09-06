import React from "react";
import { motion } from "framer-motion";
import Header from "../Header";

const TeamPageLayout = ({ children, pageTitle, pageDescription, theme }) => {
  return (
    <div className={`team-page ${theme}`}>
      <Header />
      <motion.div
        className="team-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </motion.div>
      <div className="team-content">{children}</div>
    </div>
  );
};

export default TeamPageLayout;
