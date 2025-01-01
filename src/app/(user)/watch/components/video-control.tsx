"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  ArrowLeft,
  AwardIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useVideoContext } from "../providers/video-control-provider";
import { CommentsModal } from "./comments-modal";
import { LikeAnimation } from "./like-animation";
import { useSearchParams } from "next/navigation";
import { unLikeVideo, fetchVideoDetails, likeVideo } from "@/apis/watch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import { addBookmark, removeBookmark } from "@/apis/bookmarks";
import { followUser } from "@/apis/profile";

interface VideoDetails {
  _id: string;
  userDetails: {
    indFirstName: string;
    indLastName: string;
    userName: string;
    indPic: {
      original: string;
      thumbnail: string;
    };
  };
  title: string;
  hashtags: string[];
  totalLikes: number;
  totalComments: number;
  isLiked: boolean;
  // isFollowed: boolean;
  isBookmarked: boolean;
}

interface VideoControlsProps {
  video?: VideoDetails;
}

export function VideoControls({ video }: VideoControlsProps) {
  const { isPlaying, isMuted, togglePlay, toggleMute, toggleFullscreen } =
    useVideoContext();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(video?.isLiked || false);
  const [unLiked, setIsUnLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || "";
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(!isPlaying);
  // const [totalLikes, setTotalLikes] = useState(video?.totalLikes || 0);

  const isMobile = useIsMobile();

  useEffect(() => {
    const loadVideoDetails = async () => {
      try {
        const response = await fetchVideoDetails(videoId);
        setVideoDetails(response?.data);
        setIsLiked(response?.data?.isLiked);
        setIsBookmarked(response?.data?.isBookmarked);
      } catch (error) {
        console.error("Error loading video details:", error);
      }
    };

    if (videoId) {
      loadVideoDetails();
    }
  }, [videoId]);
  


  const handleLike = async () => {
    try {
      if (!isLiked) {
        await likeVideo(videoId);
        setShowLikeAnimation(true);
        setIsLiked(true);
        setIsUnLiked(false);
        setTimeout(() => setShowLikeAnimation(false), 1500);
      } else {
        setIsLiked(false);
      }
      // Refresh video details to get updated counts
      const response = await fetchVideoDetails(videoId);
      setVideoDetails(response.data);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleunLike = async () => {
    if (!unLiked) {
      await unLikeVideo(videoId);
      setShowDislikeAnimation(true);
      setIsUnLiked(true);
      setIsLiked(false);
      setTimeout(() => setShowDislikeAnimation(false), 1500);
    } else {
      setIsUnLiked(false);
    }
  };

  const handleBookmark = async () => {
    if (!isBookmarked) {
      await addBookmark(videoId);
      setIsBookmarked(true);
    } else {
      await removeBookmark(videoId);
      setIsBookmarked(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this video",
          text: "I found this interesting video. Take a look!",
          url: window.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.log("Error sharing content:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log("Web Share API not supported");
      // You can implement a custom share dialog here
      alert(
        "Sharing is not supported on this browser. You can copy the URL to share.",
      );
    }
  };

  const handleFollow = async (id: any) => {
    // let res = await followUser(id);
    // if (res) {
    setIsFollowed(!isFollowed);
    // }
  };

  function navigateBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      console.warn("No history available to navigate back.");
    }
  }

  console.log("checking isPlaying", isPlaying);
  return (
    <>
      {/* Like/Dislike Animations */}
      <LikeAnimation isLike={true} show={showLikeAnimation} />
      <LikeAnimation isLike={false} show={showDislikeAnimation} />

      {/* Center play/pause button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-16
          h-16"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8" />
        )}
      </Button>

      {/* Top controls */}
      <div className="absolute top-4 right-4 flex">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>

        {isMobile && (
          <div
            className="absolute top-4"
            style={{
              top: 0,
              right: "21rem",
              height: "50px",
              width: "50px",
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={navigateBack}
              style={{
                height: "50px",
                width: "50px",
              }}
            >
              {/* <MoveLeft size={50} /> */}
              <ArrowLeft size={40} />
            </Button>
          </div>
        )}
        {/* <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="h-6 w-6" />
        </Button> */}
      </div>

      {/* Right side controls */}
      <div
        className="absolute top-3/4 transform -translate-y-1/2 flex flex-col gap-6 items-center"
        style={{
          right: `${!isMobile ? "-5rem" : "1rem"}`,
          top: "70%",
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`text-white transition-transform ${isLiked ? "scale-125" : ""}`}
            onClick={isLiked ? handleunLike : handleLike}
          >
            <ThumbsUp className={`h-6 w-6 ${isLiked ? "fill-white" : ""}`} />
          </Button>
          <span className="text-white text-sm">Like</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`text-white transition-transform ${isBookmarked ? "scale-125" : ""}`}
            onClick={handleBookmark}
          >
            {/* <ThumbsDown className={`h-6 w-6 ${unLiked ? "fill-white" : ""}`} /> */}
            <Bookmark
              className={`h-6 w-6 ${isBookmarked ? "fill-white" : ""}`}
            />
          </Button>
          <span className="text-white text-sm">Bookmark</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setShowComments(true)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm">Comment</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={handleShare}
          >
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm">Share</span>
        </div>
      </div>

      {/* Bottom info */}
      <div
        className="absolute bottom-4 left-4 right-16 text-white"
        style={{
          top: `${isMobile ? "75%" : "85%"}`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Avatar>
            <AvatarImage src={videoDetails?.userDetails?.indPic?.original} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">
              {videoDetails?.userDetails?.indFirstName}{" "}
              {videoDetails?.userDetails?.indLastName}
            </h3>
            <p className="text-sm text-white/80">{videoDetails?.title}</p>
          </div>
          <div
            className="flex justify-end"
            style={{
              width: "60px",
            }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleFollow(videoDetails?._id)}
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          {videoDetails?.hashtags?.map(
            (tag, index) =>
              index < 2 && (
                <div key={tag} className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{tag}</Badge>
                </div>
              ),
          )}
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        ownerName={videoDetails?.userDetails.userName || ""}
        onClose={() => setShowComments(false)}
      />
    </>
  );
}
