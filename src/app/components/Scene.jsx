// Updated Scene.jsx - Tunnel starts when showText becomes true
"use client";

import React, { useRef, useEffect, useState } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { CubicSmoke } from "./CubicSmoke";
import RocketModel from "./RocketModel";
import TunnelScrollText from "./TunnelScrollText";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

function AxesHelperComponent({ size = 5 }) {
  const { scene } = useThree();
  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(size);
    scene.add(axesHelper);
    return () => scene.remove(axesHelper);
  }, [scene, size]);
  return null;
}

function Scene({ 
  showSmoke, 
  launchTriggered, 
  onLoaded, 
  showText = false,
  onTunnelStart = () => {} 
}) {
  const rocketGroup = useRef();
  const sceneGroup = useRef();
  const [showTunnelEffect, setShowTunnelEffect] = useState(false);

  // Rocket launch animation
  useEffect(() => {
    if (launchTriggered && rocketGroup.current) {
      gsap.to(rocketGroup.current.position, {
        y: 10,
        duration: 10,
        ease: "power2.out",
      });
    }
  }, [launchTriggered]);

  // Start tunnel effect when showText becomes true
  useEffect(() => {
    if (showText && !showTunnelEffect) {
      console.log("Starting tunnel effect...");
      setShowTunnelEffect(true);
      onTunnelStart();
    }
  }, [showText, showTunnelEffect, onTunnelStart]);

  // Smooth camera transition when entering tunnel mode
  useEffect(() => {
    if (showTunnelEffect && sceneGroup.current) {
      // Smooth transition to tunnel camera position
      gsap.to(sceneGroup.current.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
      });
      
      gsap.to(sceneGroup.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
      });
    }
  }, [showTunnelEffect]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <>
      <Environment preset="city" />
      <AxesHelperComponent size={10} />
      
      <group ref={sceneGroup}>
        {/* Rocket scene - hide when tunnel effect starts */}
        {!showTunnelEffect && (
          <group
            ref={rocketGroup}
            position={[-0.158, -0.7, 0.02]}
            rotation={[-0.01, 0, 0]}
          >
            <RocketModel scale={0.0065} />
            <CubicSmoke
              count={400}
              scale={0.3}
              coneSpread={15}
              enabled={showSmoke}
            />
          </group>
        )}

        {/* Tunnel scroll effect - starts when showText is true */}
        <TunnelScrollText 
          visible={showTunnelEffect}
          font="/fonts/Zen Dots_Regular.json"
          onScrollComplete={() => {
            console.log("Tunnel effect completed!");
          }}
        />
      </group>

      {/* Orbit controls - disabled during tunnel effect */}
      {/* {!showTunnelEffect && (
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableZoom={true}
          enablePan={true}
        />
      )} */}
    </>
  );
}

export default Scene;