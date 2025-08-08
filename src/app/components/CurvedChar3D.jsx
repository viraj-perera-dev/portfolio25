// CurvedChar3D.jsx
"use client";

import { useRef, useEffect, useState } from "react";
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
  const groupRef = useRef();
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    if (ref.current && !hasMeasured) {
      // Center horizontally but align to baseline (bottom)
      ref.current.geometry.computeBoundingBox();
      const bbox = ref.current.geometry.boundingBox;
      
      // Center horizontally
      const centerX = (bbox.max.x + bbox.min.x) / 2;
      ref.current.geometry.translate(-centerX, 0, 0);
      
      // Align to baseline (move up by the bottom extent)
      const bottomY = bbox.min.y;
      ref.current.geometry.translate(0, -bottomY, 0);
      
      // Measure width for spacing calculations (only once)
      const width = bbox.max.x - bbox.min.x;
      onMeasure(width);
      setHasMeasured(true);
    }
  }, [hasMeasured, onMeasure]);

  useEffect(() => {
    if (visible && groupRef.current && hasMeasured) {
      gsap.fromTo(
        groupRef.current.scale,
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
  }, [delay, visible, hasMeasured]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} visible={visible}>
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