"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

function LoadingComponent({ loading, launched, handleLaunch }) {
  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading-overlay"
            initial={{
              width: "300vmax",
              height: "300vmax",
              borderRadius: "50%",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              width: "16rem",
              height: "16rem",
              transition: { duration: 3, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{ opacity: 0 }}
            className="fixed bg-white z-50"
          />
        )}
      </AnimatePresence>

      {!launched && !loading && (
        <button
          onClick={handleLaunch}
          className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white text-white font-semibold rounded-full transition-all cursor-pointer hover:w-36 hover:h-36 duration-1000 ease-in-out"
        >
          Start
        </button>
      )}
    </>
  );
}

export default LoadingComponent;
