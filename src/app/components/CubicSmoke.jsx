import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createParticle(scale, coneSpread) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.02 * scale;
    const horizontalSpeed = coneSpread * 0.002;
  
    const position = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.random() * -3,  // y iniziale casuale tra 0 e -3
      Math.sin(angle) * radius
    );
  
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * horizontalSpeed,
      -0.03 - Math.random() * 0.01,
      (Math.random() - 0.5) * horizontalSpeed
    );
  
    return { position, velocity };
  }
  

export function CubicSmoke({ count = 100, scale = 1, coneSpread = 1, enabled = true }) {
  const group = useRef();
  const particles = useRef([]);
  const fade = useRef(enabled ? 1 : 0);

  const geometry = useMemo(
    () => new THREE.BoxGeometry(0.2 * scale, 0.2 * scale, 0.2 * scale),
    [scale]
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#cccccc'),
        transparent: true,
        opacity: 0.8,
        roughness: 1,
        metalness: 0,
        depthWrite: false,
      }),
    []
  );

  const initialized = useRef(false);

  useFrame(() => {
    if (!group.current) return;
  
    // Smooth fade transition
    const targetFade = enabled ? 1 : 0;
    fade.current += (targetFade - fade.current) * 0.05; // damping fade
  
    // If fully faded out and not enabled, stop updates here
    if (fade.current < 0.001 && !enabled) return;
  
    // Only update particles and rotations if enabled (or fading out)
    if (enabled) {
      // Initialize particles if needed
      if (!initialized.current) {
        particles.current = Array.from({ length: count }, () =>
          createParticle(scale, coneSpread)
        );
        initialized.current = true;
      }
  
      // Add particles if needed
      while (particles.current.length < count) {
        particles.current.push(createParticle(scale, coneSpread));
      }
  
      // Update particle positions
      particles.current.forEach((p, i) => {
        p.position.add(p.velocity);
  
        if (p.position.y < -3) {
          particles.current[i] = createParticle(scale, coneSpread);
        }
      });
    }
  
    // Sync to mesh — always update position & opacity for fade, but only rotate if enabled
    group.current.children.forEach((mesh, i) => {
      const p = particles.current[i];
      if (p) {
        mesh.position.copy(p.position);
        mesh.material.opacity = 0.8 * fade.current;
        mesh.scale.setScalar(scale);
  
        if (enabled) {
          mesh.rotation.x += 0.01;
          mesh.rotation.y += 0.01;
        }
      }
    });
  });
  

  const cubes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => (
        <mesh key={i} geometry={geometry} material={material} />
      )),
    [count, geometry, material]
  );

  return <group position={[0.16, 0, -0.02]} ref={group}>{cubes}</group>;
}
