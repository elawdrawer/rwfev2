"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';

interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoControlsProvider');
  }
  return context;
}

interface VideoControlsProviderProps {
  children: ReactNode;
}

export function VideoControlsProvider({ children }: VideoControlsProviderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);
    const handleError = () => {
      console.error('Video playback error');
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('volumechange', handleVolumeChange);

    // Attempt autoplay
    const attemptAutoplay = async () => {
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Autoplay failed:', error);
        setIsPlaying(false);
      }
    };

    attemptAutoplay();

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error toggling play state:', error);
      setIsPlaying(false);
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
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <VideoContext.Provider 
      value={{ 
        videoRef,
        isPlaying,
        isMuted,
        togglePlay,
        toggleMute,
        toggleFullscreen,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}