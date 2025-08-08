// AnimatedText.jsx
"use client";

import CurvedChar3D from "./CurvedChar3D";
import { useState, useEffect } from "react";

export default function AnimatedText({ props }) {
  if (!props.visible) return null;
  
  const textLayout = [
    { char: "C" },
    { char: "r" },
    { char: "e" },
    { char: "a" },
    { char: "t" },
    { char: "i" },
    { char: "v" },
    { char: "e" },
    { char: " " },
    { char: "D" },
    { char: "e" },
    { char: "v" },
    { char: "e" },
    { char: "l" },
    { char: "o" },
    { char: "p" },
    { char: "e" },
    { char: "r" },
  ];

  const [widths, setWidths] = useState({});
  const [measured, setMeasured] = useState(false);

  const handleMeasure = (i) => (w) => {
    setWidths((prev) => {
      const newWidths = { ...prev, [i]: w };
      // Check if all measurements are complete
      if (Object.keys(newWidths).length === textLayout.length && !measured) {
        setTimeout(() => setMeasured(true), 50);
      }
      return newWidths;
    });
  };

  // Calculate positions
  const getPosition = (i) => {
    if (!measured) {
      // During measurement phase - spread out horizontally off-screen
      return [i * 2, -100, 0];
    }

    // Final positioning
    const baseSpacing = props.size * 1;
    const totalWidth = textLayout.length * baseSpacing;
    const startX = -totalWidth / 2;
    const x = startX + i * baseSpacing;
    
    // Curve calculations
    const curveStrength = props.curve || 0.1;
    const z = Math.abs(i - textLayout.length / 2) * curveStrength / 2;
    
    return [x, 0, z];
  };

  const getRotation = (i) => {
    if (!measured) return [0, 0, 0];
    
    const curveStrength = props.curve || 0.1;
    const rotationY = (i - textLayout.length / 2) * -curveStrength;
    return [0, rotationY, 0];
  };

  return (
    <>
      {textLayout.map(({ char }, i) => (
        <CurvedChar3D
          key={i} // Consistent key
          char={char}
          font={props.font}
          size={props.size}
          height={props.height}
          color={props.color}
          position={getPosition(i)}
          rotation={getRotation(i)}
          delay={measured ? i * 0.02 : 0}
          visible={measured} // Only show when measured and positioned
          onMeasure={handleMeasure(i)}
        />
      ))}
    </>
  );
}