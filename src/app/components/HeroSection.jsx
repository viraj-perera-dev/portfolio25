// Updated HeroSection.jsx
"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import PlayMusic from "./PlayMusic";
import Scene from "./Scene";
import LoadingComponent from "./LoadingComponent";
import ScrollIndicator from "./ScrollIndicator";

export default function HeroSection() {
  const [showText, setShowText] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTunnelEffect, setShowTunnelEffect] = useState(false);

  const handleLaunch = () => {
    setShowSmoke(true);
    setTimeout(() => {
      setLaunched(true);
      setIsPlaying(true); // 🎵 Start music
    }, 1000);
    setTimeout(() => setShowSmoke(false), 3000);
    setTimeout(() => setShowText(true), 4000);
    // Trigger tunnel effect after rocket animation completes
    setTimeout(() => setShowTunnelEffect(true), 12000); // Rocket takes ~10s + 2s delay
  };

  return (
    <>
      <div className="h-screen w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] z-0" />

        <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
          <Scene
            showSmoke={showSmoke}
            launchTriggered={launched}
            onLoaded={() => setLoading(false)}
            showText={showText}
          />
        </Canvas>

        <LoadingComponent
          loading={loading}
          launched={launched}
          handleLaunch={handleLaunch}
        />

        <PlayMusic isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        
        {/* Scroll indicator for tunnel effect */}
        <ScrollIndicator showTunnelEffect={showTunnelEffect} />
      </div>
    </>
  );
}