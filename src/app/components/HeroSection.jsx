// Updated HeroSection.jsx - Smooth tunnel transition
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
  };

  const handleTunnelStart = () => {
    setShowTunnelEffect(true);
  };

  return (
    <>
      {/* Container that changes based on tunnel effect */}
      <div className={`w-full relative transition-all duration-1000 ${
        showTunnelEffect ? 'h-auto min-h-screen' : 'h-screen overflow-hidden'
      }`}>
        
        {/* Background grid - fade out during tunnel */}
        <div className={`absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] z-0 transition-opacity duration-2000 ${
          showTunnelEffect ? 'opacity-0' : 'opacity-100'
        }`} />

        {/* Canvas container */}
        <div className={`${showTunnelEffect ? 'fixed inset-0' : 'h-full'}`}>
          <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
            <Scene
              showSmoke={showSmoke}
              launchTriggered={launched}
              onLoaded={() => setLoading(false)}
              showText={showText}
              onTunnelStart={handleTunnelStart}
            />
          </Canvas>
        </div>

        {/* Loading component */}
        <LoadingComponent
          loading={loading}
          launched={launched}
          handleLaunch={handleLaunch}
        />

        {/* Music player */}
        <PlayMusic isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        
        {/* Scroll indicator for tunnel effect */}
        <ScrollIndicator showTunnelEffect={showTunnelEffect} />        
      </div>
    </>
  );
}