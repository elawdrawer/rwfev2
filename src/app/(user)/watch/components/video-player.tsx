"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVideoContext } from "../providers/video-control-provider";
import { rateVideo } from "@/apis/watch";
import { useSearchParams } from "next/navigation";
import { StarRating } from "../../post/components/StarRating";

interface VideoPlayerProps {
  videoUrl?: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const { videoRef, isPlaying, isMuted, togglePlay, toggleMute } =
    useVideoContext();
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hoverRating, setHoverRating] = useState(0);
  const isVideoEnded = useRef(false);
  const [rating, setRating] = useState(0);

  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || "";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    // Reset video when URL changes
    video.load();

    // Try to autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }

    // Update progress
    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      isVideoEnded.current = true;
      setShowOverlay(true);
      setCountdown(10); // Reset countdown timer
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoUrl, videoRef]);

  // Hide controls after video starts playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (showOverlay) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setShowOverlay(false);
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOverlay]);

  const handleRatingChange = async (rating: number) => {
    console.log("User rating:", rating);
    setRating(rating)
    let payload = {
      rating: rating,
    };
    let res = await rateVideo(videoId, payload);
    console.log("checking res of rate video", res.message);
    if (res) {
      setShowThankYou(true);
    }
    setShowOverlay(false);
    setTimeout(() => setShowThankYou(false), 3000); // Show thank you message for 3 seconds
  };

  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        No video URL provided
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full bg-black group"
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        controls={false}
        playsInline
        muted={isMuted}
      />

      {/* Center play/pause button - only shown when controls are visible */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity
          duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="bg-black/30 rounded-full p-4">
          {isPlaying ? (
            <Pause className="w-12 h-12 text-white" />
          ) : (
            <Play className="w-12 h-12 text-white" />
          )}
        </div>
      </div>

      {/* Top controls */}
      <div
        className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0" }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/30"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center
            text-white"
        >
          <h2 className="text-2xl font-semibold mb-4">Rate this video</h2>
          <StarRating
            value={rating}
            onChange={handleRatingChange}
            type="interactive"
          />
          <p className="text-sm mt-2">
            This overlay will disappear in {countdown} seconds.
          </p>
        </div>
      )}

      {/* Thank you message */}
      {showThankYou && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
          <h2 className="text-2xl font-semibold">Thank you for your rating!</h2>
        </div>
      )}
    </div>
  );
}
