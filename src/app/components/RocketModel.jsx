import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export default function RocketModel({ children, scale = 0.005 }) {
  const rocketRef = useRef();
  const { scene } = useGLTF('/rocket_ship.glb');

  useEffect(() => {
    if (rocketRef.current) {
      console.log('🚀 Rocket ready');
    }
  }, [scene]);

  return (
    <group
      ref={rocketRef}
      position={[-0.52, -0.15, 0]}
      rotation={[0, 0.0155, -0.656]}
      scale={scale}
    >
      <primitive object={scene} />
      {children}
    </group>
  );
}
