"use client";

import React, { useEffect, useRef } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { Player } from "@lottiefiles/react-lottie-player";

function PlayMusic({ isPlaying, setIsPlaying }) {
  const audioRef = useRef(null);
  const lottieRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/Come and Get Your Love.mp3");
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((e) => {
          console.warn("Audio play prevented:", e);
        });
      lottieRef.current?.play();
    } else {
      audioRef.current.pause();
      lottieRef.current?.pause();
    }
  }, [isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 flex items-center z-10">
      <Player
        ref={lottieRef}
        loop
        src="/sound.json"
        style={{ height: "40px", width: "40px" }}
      />
      <button
        onClick={toggleAudio}
        className="text-white rounded-full text-2xl cursor-pointer"
      >
        {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
      </button>
    </div>
  );
}

export default PlayMusic;
