// ScrollIndicator.jsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollIndicator({ showTunnelEffect = false }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!showTunnelEffect) return;

    setIsVisible(true);

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / (docHeight || 1), 1);
      setScrollProgress(progress);

      // Hide indicator when almost complete
      if (progress > 0.9) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showTunnelEffect]);

  return (
    <AnimatePresence>
      {isVisible && showTunnelEffect && (
        <>
          {/* Main scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white text-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl mb-2"
            >
              ↓
            </motion.div>
            <p className="text-sm font-light">Scroll to travel through space</p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{
                  width: `${scrollProgress * 100}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-white text-xs text-center mt-2 font-light">
              Journey Progress: {Math.round(scrollProgress * 100)}%
            </p>
          </motion.div>

          {/* Text phases indicator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 text-white text-sm"
          >
            <div className="space-y-2">
              <div className={`transition-opacity duration-300 ${
                scrollProgress < 0.3 ? 'opacity-100' : 'opacity-30'
              }`}>
                📡 Approaching...
              </div>
              <div className={`transition-opacity duration-300 ${
                scrollProgress >= 0.3 && scrollProgress < 0.7 ? 'opacity-100' : 'opacity-30'
              }`}>
                🚀 Passing through...
              </div>
              <div className={`transition-opacity duration-300 ${
                scrollProgress >= 0.7 ? 'opacity-100' : 'opacity-30'
              }`}>
                ✨ Behind you...
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}