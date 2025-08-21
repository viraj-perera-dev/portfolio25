// TunnelScrollText.jsx - Updated with scroll control
"use client";

import React, { useRef, useEffect, useState } from "react";
import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

export default function TunnelScrollText({ 
  visible = false, 
  font = "/fonts/Zen Dots_Regular.json",
}) {
  const groupRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [fadeProgress, setFadeProgress] = useState(0);
  const textElementsRef = useRef([]);

  // Text content for the tunnel
  const textElements = [
    { text: "WELCOME", color: "#ff6b6b" },
    { text: "TO THE", color: "#4ecdc4" },
    { text: "FUTURE", color: "#45b7d1" },
    { text: "OF WEB", color: "#96ceb4" },
    { text: "DESIGN", color: "#ffd93d" },
    { text: "AMAZING!", color: "#ff9ff3" },
  ];

  // Initialize scroll listener and fade in when component becomes visible
  useEffect(() => {
    if (!visible) return;

    // Smooth fade in transition
    gsap.to({ progress: 0 }, {
      progress: 1,
      duration: 2,
      ease: "power2.out",
      onUpdate: function() {
        setFadeProgress(this.targets()[0].progress);
      },
      onComplete: () => {
        setIsActive(true);
      }
    });
    
    // Add scroll listener
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / (docHeight || 1), 1);
      setScrollProgress(progress);
    };

    // Make page scrollable
    document.body.style.height = "600vh"; // Longer scroll for better control
    document.body.style.overflow = "auto";
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";
    };
  }, [visible]);

  // Update text positions based on scroll (NO auto-animation)
  useFrame(() => {
    if (!isActive || !textElementsRef.current.length) return;

    textElementsRef.current.forEach((element, index) => {
      // Add null checks for safety
      if (!element || !element.mesh || !element.mesh.position || !element.mesh.material) return;

      // Calculate Z position based on SCROLL PROGRESS ONLY
      const startZ = -3000 - (index * 500); // Starting position (further back)
      const endZ = 1500; // End position (behind camera)
      const totalDistance = endZ - startZ;
      
      // Current Z position based on scroll progress
      const currentZ = startZ + (scrollProgress * totalDistance);
      
      // Update position directly based on scroll
      element.mesh.position.z = currentZ;
      
      // Calculate scale and opacity based on Z position
      let scale = 1;
      let opacity = 0;
      
      if (currentZ <= -200) {
        // Approaching camera (far to near)
        opacity = Math.max(0, Math.min(1, (currentZ + 3000) / 2800));
        scale = Math.max(0.1, 0.5 + (currentZ / 1000));
      } else if (currentZ <= 200) {
        // Passing through camera (maximum size)
        opacity = 1;
        scale = Math.max(1, 4 - Math.abs(currentZ) / 50);
      } else {
        // Behind camera
        opacity = Math.max(0.2, 1 - (currentZ / 1000));
        scale = Math.max(0.3, 3 - (currentZ / 300));
      }
      
      // Apply transformations safely
      if (element.mesh.scale) {
        element.mesh.scale.setScalar(scale);
      }
      
      // Update material opacity with fade
      if (element.mesh.material) {
        element.mesh.material.opacity = opacity * fadeProgress;
        
        // Change material properties when behind camera
        if (currentZ > 200) {
          element.mesh.material.emissive.setHex(0x222222);
        } else {
          element.mesh.material.emissive.setHex(0x000000);
        }
      }
    });
  });

  // Initialize text elements refs
  useEffect(() => {
    textElementsRef.current = textElements.map(() => ({ mesh: null }));
  }, [textElements.length]);

  if (!visible) return null;

  return (
    <>
      {/* Fade overlay for smooth transition */}
      <mesh position={[0, 0, -1]} visible={fadeProgress < 1}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={1 - fadeProgress}
        />
      </mesh>

      <group ref={groupRef}>
        {textElements.map((element, index) => (
          <Text3DElement
            key={index}
            elementRef={textElementsRef.current[index]}
            text={element.text}
            color={element.color}
            font={font}
            position={[0, 0, -3000 - (index * 500)]}
            fadeProgress={fadeProgress}
          />
        ))}
        
        {/* Tunnel environment */}
        <TunnelEnvironment fadeProgress={fadeProgress} />
      </group>
    </>
  );
}

// Individual 3D Text Element
function Text3DElement({ 
  elementRef,
  text, 
  color, 
  font, 
  position,
  fadeProgress
}) {
  const textRef = useRef();
  
  useEffect(() => {
    if (textRef.current && elementRef) {
      elementRef.mesh = textRef.current;
    }
  }, [elementRef, textRef.current]);

  return (
    <Text3D
      ref={textRef}
      font={font}
      size={0.4}
      height={0.08}
      position={position}
      curveSegments={12}
      bevelEnabled
      bevelSize={0.02}
      bevelThickness={0.02}
    >
      {text}
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </Text3D>
  );
}

// Tunnel Environment Components
function TunnelEnvironment({ fadeProgress }) {
  return (
    <group>
      {/* Tunnel walls that move with scroll */}
      <ScrollControlledWalls fadeProgress={fadeProgress} />
      
      {/* Floating particles */}
      <ScrollControlledParticles fadeProgress={fadeProgress} />
      
      {/* Grid floor */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 100]} />
        <meshBasicMaterial 
          color="#ffffff"
          opacity={0.1 * fadeProgress}
          transparent
          wireframe
        />
      </mesh>
      
      {/* Grid ceiling */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 100]} />
        <meshBasicMaterial 
          color="#ffffff"
          opacity={0.05 * fadeProgress}
          transparent
          wireframe
        />
      </mesh>
    </group>
  );
}

// Walls that respond to scroll instead of time
function ScrollControlledWalls({ fadeProgress }) {
  const wallsRef = useRef();
  
  useFrame(() => {
    if (!wallsRef.current || !wallsRef.current.children) return;
    
    // Get scroll position
    const scrollTop = window.pageYOffset;
    
    wallsRef.current.children.forEach((wall, index) => {
      if (!wall || !wall.position) return;
      
      // Move walls based on scroll instead of time
      const baseZ = (index * 8) - 40;
      const scrollOffset = (scrollTop * 0.02) % 80;
      wall.position.z = baseZ + scrollOffset;
    });
  });

  return (
    <group ref={wallsRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <group key={i}>
          <mesh position={[-5, 0, i * 8]}>
            <boxGeometry args={[0.05, 6, 0.05]} />
            <meshBasicMaterial 
              color="#ffffff" 
              opacity={0.4 * fadeProgress} 
              transparent 
            />
          </mesh>
          <mesh position={[5, 0, i * 8]}>
            <boxGeometry args={[0.05, 6, 0.05]} />
            <meshBasicMaterial 
              color="#ffffff" 
              opacity={0.4 * fadeProgress} 
              transparent 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Particles that move with scroll
function ScrollControlledParticles({ fadeProgress }) {
  const particlesRef = useRef();
  const particleCount = 100;
  
  useFrame(() => {
    if (!particlesRef.current || !particlesRef.current.children) return;
    
    const scrollTop = window.pageYOffset;
    
    particlesRef.current.children.forEach((particle, index) => {
      if (!particle || !particle.position) return;
      
      // Move particles based on scroll
      const baseZ = (index * 2) - 50;
      const scrollOffset = (scrollTop * 0.05) % 100;
      particle.position.z = baseZ + scrollOffset;
      
      // Reset position when too far forward
      if (particle.position.z > 10) {
        particle.position.x = (Math.random() - 0.5) * 20;
        particle.position.y = (Math.random() - 0.5) * 6;
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 6,
            Math.random() * -100
          ]}
        >
          <sphereGeometry args={[0.03]} />
          <meshBasicMaterial 
            color="#ffffff" 
            opacity={0.8 * fadeProgress} 
            transparent 
          />
        </mesh>
      ))}
    </group>
  );
}