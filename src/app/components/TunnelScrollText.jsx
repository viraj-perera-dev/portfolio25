// TunnelScrollText.jsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

export default function TunnelScrollText({ 
  visible = false, 
  font = "/fonts/Zen Dots_Regular.json",
  onScrollComplete = () => {} 
}) {
  const groupRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const textElementsRef = useRef([]);

  // Text content for the tunnel
  const textElements = [
    { text: "WELCOME", color: "#ff6b6b", delay: 0 },
    { text: "TO THE", color: "#4ecdc4", delay: 0.2 },
    { text: "FUTURE", color: "#45b7d1", delay: 0.4 },
    { text: "OF WEB", color: "#96ceb4", delay: 0.6 },
    { text: "DESIGN", color: "#ffd93d", delay: 0.8 },
    { text: "AMAZING!", color: "#ff9ff3", delay: 1.0 },
  ];

  // Initialize scroll listener when component becomes visible
  useEffect(() => {
    if (!visible) return;

    setIsActive(true);
    
    // Add scroll listener
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / (docHeight || 1), 1);
      setScrollProgress(progress);
    };

    // Make page scrollable
    document.body.style.height = "500vh";
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.height = "auto";
    };
  }, [visible]);

  // Animate text elements based on scroll progress
  useFrame(() => {
    if (!isActive || !textElementsRef.current.length) return;

    textElementsRef.current.forEach((textRef, index) => {
      if (!textRef.current) return;

      // Calculate Z position based on scroll progress
      const baseZ = -2000 - (index * 400); // Starting position (far away)
      const targetZ = 1000; // End position (behind camera)
      const totalDistance = targetZ - baseZ;
      
      // Current Z position based on scroll
      const currentZ = baseZ + (scrollProgress * totalDistance);
      
      // Update position
      textRef.current.position.z = currentZ;
      
      // Calculate scale and opacity based on Z position
      let scale = 1;
      let opacity = 0;
      
      if (currentZ <= -100) {
        // Approaching camera (far to near)
        opacity = Math.max(0, Math.min(1, (currentZ + 2000) / 1900));
        scale = Math.max(0.1, 1 + (currentZ / 500));
      } else if (currentZ <= 100) {
        // Passing through camera (maximum size)
        opacity = 1;
        scale = Math.max(1, 3 - (currentZ / 50));
      } else {
        // Behind camera
        opacity = Math.max(0.3, 1 - (currentZ / 800));
        scale = Math.max(0.5, 2 - (currentZ / 200));
      }
      
      // Apply transformations
      textRef.current.scale.setScalar(scale);
      textRef.current.material.opacity = opacity;
      
      // Change material properties when behind camera
      if (currentZ > 100) {
        textRef.current.material.emissive.setRGB(0.1, 0.1, 0.1);
      } else {
        textRef.current.material.emissive.setRGB(0, 0, 0);
      }
    });
  });

  // Initialize text elements refs
  useEffect(() => {
    textElementsRef.current = textElements.map(() => React.createRef());
  }, []);

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {textElements.map((element, index) => (
        <Text3DElement
          key={index}
          ref={textElementsRef.current[index]}
          text={element.text}
          color={element.color}
          font={font}
          position={[0, 0, -2000 - (index * 400)]}
          delay={element.delay}
        />
      ))}
      
      {/* Tunnel environment */}
      <TunnelEnvironment />
    </group>
  );
}

// Individual 3D Text Element
const Text3DElement = React.forwardRef(({ 
  text, 
  color, 
  font, 
  position, 
  delay 
}, ref) => {
  const textRef = useRef();
  
  useEffect(() => {
    if (textRef.current) {
      // Initial setup
      textRef.current.scale.setScalar(0.1);
      textRef.current.material.opacity = 0;
      
      // Animate in with delay
      gsap.to(textRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: delay
      });
    }
  }, [delay]);

  // Expose ref to parent
  useEffect(() => {
    if (ref) {
      ref.current = textRef.current;
    }
  });

  return (
    <Text3D
      ref={textRef}
      font={font}
      size={0.3}
      height={0.05}
      position={position}
      curveSegments={12}
      bevelEnabled
      bevelSize={0.01}
      bevelThickness={0.01}
    >
      {text}
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </Text3D>
  );
});

// Tunnel Environment Components
function TunnelEnvironment() {
  return (
    <group>
      
      {/* Side walls */}
      <TunnelWalls />
      
      {/* Floating particles */}
      <TunnelParticles />
    </group>
  );
}

// Tunnel wall lines
function TunnelWalls() {
  const wallsRef = useRef();
  
  useFrame((state) => {
    if (wallsRef.current) {
      wallsRef.current.children.forEach((wall, index) => {
        wall.position.z = ((state.clock.elapsedTime * 2 + index * 10) % 50) - 25;
      });
    }
  });

  return (
    <group ref={wallsRef}>
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i}>
          <mesh position={[-3, 0, i * 5]}>
            <boxGeometry args={[0.02, 4, 0.02]} />
            <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
          <mesh position={[3, 0, i * 5]}>
            <boxGeometry args={[0.02, 4, 0.02]} />
            <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Floating particles for atmosphere
function TunnelParticles() {
  const particlesRef = useRef();
  const particleCount = 50;
  
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle) => {
        particle.position.z += 0.1;
        if (particle.position.z > 5) {
          particle.position.z = -20;
          particle.position.x = (Math.random() - 0.5) * 10;
          particle.position.y = (Math.random() - 0.5) * 4;
        }
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 4,
            Math.random() * -25
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial 
            color="#ffffff" 
            opacity={0.6} 
            transparent 
          />
        </mesh>
      ))}
    </group>
  );
}