import React from "react";
import { motion } from "framer-motion";

const WhyNot = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative w-full py-16 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,20,10,0.98) 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-[10px] opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #00FF7F 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[#00FF7F]/10 border border-[#00FF7F]/20"></div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            What we do at <span className="text-[#00FF7F]">E-CELL</span>?
          </h2>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyNot;
