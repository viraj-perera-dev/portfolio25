"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { CubicSmoke } from "./CubicSmoke";
import RocketModel from "./RocketModel";
import gsap from "gsap";
import * as THREE from "three";
import ScrollZText from "./ScrollZText";
import PlayMusic from "./PlayMusic";

function AxesHelperComponent({ size = 5 }) {
  const { scene } = useThree();
  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(size);
    scene.add(axesHelper);
    return () => scene.remove(axesHelper);
  }, [scene, size]);
  return null;
}

function Scene({ showSmoke, launchTriggered, onLoaded }) {
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
      {/* <AxesHelperComponent size={10} /> */}
      <group ref={rocketGroup} position={[-0.157, -0.75, 0]}>
        <RocketModel scale={0.0065} />
        <CubicSmoke
          count={400}
          scale={0.3}
          coneSpread={15}
          enabled={showSmoke}
        />
      </group>
      {/* <OrbitControls /> */}
    </>
  );
}

export default function HeroSection() {
  const [showText, setShowText] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLaunch = () => {
    setShowSmoke(true);
    setTimeout(() => {
      setLaunched(true);
      setIsPlaying(true); // 🎵 Start music
    }, 1000);
    setTimeout(() => setShowText(true), 2000);
    setTimeout(() => setShowSmoke(false), 3000);
  };

  return (
    <>
      <div className="h-screen w-full bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] z-0" />

        <Canvas camera={{ position: [1.4, 0, 1], fov: 60 }}>
          <Scene
            showSmoke={showSmoke}
            launchTriggered={launched}
            onLoaded={() => setLoading(false)}
          />
        </Canvas>

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
        <PlayMusic isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      </div>
      <ScrollZText show={true}>Creative Developer</ScrollZText>
    </>
  );
}
