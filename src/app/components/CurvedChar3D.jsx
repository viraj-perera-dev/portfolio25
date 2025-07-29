// CurvedChar3D.jsx
"use client";

import { useRef, useEffect } from "react";
import { Text3D } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

export default function CurvedChar3D({
  char,
  font,
  size,
  height,
  color,
  position,
  rotation,
  delay = 0,
  visible = true,
  onMeasure = () => {},
}) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.geometry.center();

      const bbox = new THREE.Box3().setFromObject(ref.current);
      const width = bbox.max.x - bbox.min.x;
      onMeasure(width);

      if (visible) {
        gsap.fromTo(
          ref.current.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.5,
            ease: "back.out(1.7)",
            delay,
          }
        );
      }
    }
  }, [delay, visible]);

  return (
    <group position={position} rotation={rotation} visible={visible}>
      <Text3D
        ref={ref}
        font={font}
        size={size}
        height={height}
        curveSegments={10}
        bevelEnabled
        bevelSize={0.005}
        bevelThickness={0.005}
      >
        {char}
        <meshStandardMaterial color={color} />
      </Text3D>
    </group>
  );
}
