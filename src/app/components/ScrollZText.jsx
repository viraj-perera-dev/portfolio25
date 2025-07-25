"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ScrollZText({ show = false, children }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="h-[101vh] overflow-hidden bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px]">
        <motion.h1
        initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
        animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            translateZ: `${-scrollProgress * 1000}px`,
            scale: 1 + scrollProgress * 10,
        }}
        transition={{ duration: 0.1, ease: "linear" }}
        className="fixed text-4xl md:text-8xl text-[#00FFF7] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-wider w-full text-center z-10"
        style={{
            fontFamily: "'Zen Dots', sans-serif",
            transformStyle: "preserve-3d",
        }}
        >
        {children}
        </motion.h1>
    </div>
  );
}
