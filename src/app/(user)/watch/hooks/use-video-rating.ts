"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseVideoRatingProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onVideoEnd?: () => void;
}

export function useVideoRating({ videoRef, onVideoEnd }: UseVideoRatingProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleVideoEnd = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause(); // Pause the video immediately
    }
    setShowRatingModal(true); // Show modal immediately
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('ended', handleVideoEnd);
    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [videoRef, handleVideoEnd]);

  const handleRatingSubmit = useCallback(async (rating: number) => {
    setShowRatingModal(false);
    onVideoEnd?.(); // Proceed to next video after rating
  }, [onVideoEnd]);

  const handleRatingSkip = useCallback(() => {
    setShowRatingModal(false);
    onVideoEnd?.(); // Proceed to next video if rating is skipped
  }, [onVideoEnd]);

  return {
    showRatingModal,
    handleRatingSubmit,
    handleRatingSkip
  };
}