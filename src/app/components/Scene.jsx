// Updated Scene.jsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { CubicSmoke } from "./CubicSmoke";
import RocketModel from "./RocketModel";
import TunnelScrollText from "./TunnelScrollText"; // Import our new component
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

function Scene({ showSmoke, launchTriggered, onLoaded, showText = false }) {
  const rocketGroup = useRef();
  const [showTunnelEffect, setShowTunnelEffect] = useState(false);

  // Rocket launch animation
  useEffect(() => {
    if (launchTriggered) {
      gsap.to(rocketGroup.current.position, {
        y: 10,
        duration: 10,
        ease: "power2.out",
        onComplete: () => {
          // setRocketAnimationComplete(true);
          // Show tunnel effect after rocket disappears
          setShowTunnelEffect(true);
        }
      });
    }
  }, [launchTriggered]);

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
      
      {/* Rocket and smoke (hide after tunnel effect starts) */}
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


      {/* New tunnel scroll effect */}
      <TunnelScrollText 
        visible={showText}
        font="/fonts/Zen Dots_Regular.json"
        onScrollComplete={() => {
          console.log("Tunnel effect completed!");
        }}
      />

      {/* <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enableZoom={!showTunnelEffect} // Disable zoom during tunnel effect
        enablePan={!showTunnelEffect}  // Disable pan during tunnel effect
      /> */}
    </>
  );
}

export default Scene;