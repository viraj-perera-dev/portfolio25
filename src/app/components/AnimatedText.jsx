// AnimatedText.jsx
"use client";

import CurvedChar3D from "./CurvedChar3D";
import { useState } from "react";

export default function AnimatedText({ props }) {
  if (!props.visible) return null;
  
  const textLayout = [
    { char: "C", offset: 0.2 },
    { char: "r", offset: 0.2 },
    { char: "e", offset: 0.2 },
    { char: "a", offset: 0.2 },
    { char: "t", offset: 0.2 },
    { char: "i", offset: 0.15 },
    { char: "v", offset: 0.1 },
    { char: "e", offset: 0.1 },
    { char: "-", offset: 0.05 },
    { char: "D", offset: 0 },
    { char: "e", offset: 0 },
    { char: "v", offset: 0 },
    { char: "e", offset: 0 },
    { char: "l", offset: -0.05 },
    { char: "o", offset: -0.1 },
    { char: "p", offset: -0.1 },
    { char: "e", offset: -0.1 },
    { char: "r", offset: -0.1 },
  ];
  

  const [widths, setWidths] = useState({});

  const handleMeasure = (i) => (w) => {
    setWidths((prev) => {
      if (prev[i] !== w) {
        return { ...prev, [i]: w };
      }
      console.log(prev);
      return prev;
    });
  };

  if (Object.keys(widths).length !== textLayout.length) {
    return (
      <>
        {textLayout.map(({ char }, i) => (
          <CurvedChar3D
            key={i}
            char={char}
            font={props.font}
            size={props.size}
            height={props.height}
            color={props.color}
            position={[0, 0, 0]} // temp
            rotation={[0, 0, 0]}
            visible={props.visible}
            onMeasure={handleMeasure(i)}
          />
        ))}
      </>
    );
  }

  const maxWidth = Math.max(...Object.values(widths)) + (props.spacing ?? 0.02);
  const totalWidth = textLayout.length * maxWidth;
  const midOffset = totalWidth / 2;


  return (
    <>
      {textLayout.map(({ char, offset, y = 0 }, i) => {
        const x = i * maxWidth - midOffset + offset;

        console.log("x =",x, " char =", char, " maxWidth =", maxWidth);
        const curveStrength = props.curve || 0.1;
        const rotationY = (i - textLayout.length / 2) * -curveStrength;
        const z = Math.abs(i - textLayout.length / 2) * curveStrength / 2;

        return (
          <CurvedChar3D
            key={i}
            char={char}
            font={props.font}
            size={props.size}
            height={props.height}
            color={props.color}
            position={[x, y, z]}
            rotation={[0, rotationY, 0]}
            delay={i * 0.02}
          />
        );
      })}
    </>
  );
}
