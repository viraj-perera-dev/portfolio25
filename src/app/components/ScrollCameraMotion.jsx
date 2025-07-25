"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useThree } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCameraMotion() {
  const { camera } = useThree();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-area",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Adjust these values to match your scene and position of the "D"
    tl.to(camera.position, {
      z: -1.5,
      y: 0.3,
      x: 0.1,
      duration: 3,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0); // Ensure camera keeps looking forward
      },
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, [camera]);

  return null;
}
