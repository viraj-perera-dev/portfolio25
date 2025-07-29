"use client";

import React, { useRef, useEffect } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { CubicSmoke } from "./CubicSmoke";
import RocketModel from "./RocketModel";
import gsap from "gsap";
import AnimatedText from "./AnimatedText";
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

  useEffect(() => {
    if (launchTriggered) {
      gsap.to(rocketGroup.current.position, {
        y: 10,
        duration: 10,
        ease: "power2.out",
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

      {/* text ed model */}
      <AnimatedText
        props={{
          visible: showText,
          curve: 0.08,
          font: "/fonts/Zen Dots_Regular.json",
          size: 0.14,
          spacing: 0.2,
          height: 0.03,
          color: "#f43f5e",
        }}
      />

      <OrbitControls
        maxPolarAngle={Math.PI / 2} // Limit vertical rotation to horizontal plane
        minPolarAngle={Math.PI / 2} // Same value = horizontal only
      />
    </>
  );
}

export default Scene;
