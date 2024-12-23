"use client";

import { useState, useRef, RefObject, useEffect } from "react";

interface VideoControlsHook {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  videoRef: RefObject<HTMLVideoElement>;
}

export const useVideoControls = (
  initialVideoRef?: RefObject<HTMLVideoElement>
): VideoControlsHook => {
  const defaultVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = initialVideoRef || defaultVideoRef;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  console.log("looking for videoref", videoRef.current);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    console.log("VideoRef initialized:", videoRef.current);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const video = videoRef.current;

    console.log("looking for videoRef inside togglePlay", video)
    
    if (!video) {
      console.warn(
        "Video reference is null. Ensure the videoRef is attached properly."
      );
      return;
    }

    try {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await video.requestFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    videoRef,
  };
};
