"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  ArrowLeft,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useVideoContext } from "../providers/video-control-provider";
import { CommentsModal } from "./comments-modal";
import { LikeAnimation } from "./like-animation";
import { useRouter, useSearchParams } from "next/navigation";
import { unLikeVideo, fetchVideoDetails, likeVideo } from "@/apis/watch";
import { useIsMobile } from "@/hooks/use-mobile";
import { addBookmark, removeBookmark } from "@/apis/bookmarks";
import { followUser, unFollowUser } from "@/apis/profile";
import AuthModal from "@/components/ui/AuthModal";

interface VideoDetails {
  _id: string;
  userId: string;
  userDetails: {
    indFirstName: string;
    indLastName: string;
    userName: string;
    indPic: {
      original: string;
      thumbnail: string;
    };
  };
  businessDetails?: {
    businessName: string;
    handle: string;
    defaultBusinessBanner: {
      original: string;
      thumbnail: string;
    };
    defaultBusinessImage: {
      original: string;
      thumbnail: string;
    };
    defaultCommunication: string | undefined;
  };
  title: string;
  hashtags: string[];
  totalLikes: number;
  totalComments: number;
  isLiked: boolean;
  isFollowed: boolean;
  categoryId: string;
  isBookmarked: boolean;
  contactUs?: {
    indCountryCode: string;
    indMobileNum: string;
    indEmail: string;
  };
  website: string;
  videoId: string;
}

interface VideoControlsProps {
  video?: VideoDetails;
}

export function VideoControls({ video }: VideoControlsProps) {
  const { isPlaying } = useVideoContext();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(video?.isLiked || false);
  const [unLiked, setIsUnLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = searchParams.get("v") || "";
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(video?.isFollowed);
  const [showPlayIcon, setShowPlayIcon] = useState(!isPlaying);
  const [userId, setUserId] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  // const [totalLikes, setTotalLikes] = useState(video?.totalLikes || 0);

  const isMobile = useIsMobile();

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (token) token.length > 0 ? setIsLoggedIn(true) : setIsLoggedIn(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  // useEffect(() => {
  //   const loadVideoDetails = async () => {
  //     try {
  //       const response = await fetchVideoDetails(videoId);
  //       setVideoDetails(response?.data);
  //       setIsLiked(response?.data?.isLiked);
  //       setIsBookmarked(response?.data?.isBookmarked);
  //       setUserId(response?.data?.userId);
  //       setIsFollowed(response?.data?.isFollowed);
  //     } catch (error) {
  //       console.error("Error loading video details:", error);
  //     }
  //   };

  //   if (videoId) {
  //     loadVideoDetails();
  //   }
  // }, [videoId]);

  const handleAuthAction = (action: () => Promise<void>) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

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
      // const response = await fetchVideoDetails(videoId);
      // setVideoDetails(response.data);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleShowComments = async () => {
    setShowComments(true);
    return Promise.resolve();
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
      await removeBookmark([videoId]);
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

  const handleFollow = async () => {
    try {
      if (!isFollowed) {
        let res = await followUser(userId);
        if (res) {
          setIsFollowed(!isFollowed);
        } else {
          // console.log("checking res of follow", res);
          setIsFollowed(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (isFollowed) {
        await unFollowUser(userId); // Call the API to unfollow the user
        setIsFollowed(false); // Update the state to reflect that the user is no longer followed
      }
    } catch (error) {
      console.error("Error unfollowing user:", error); // Handle any errors
    }
  };

  function navigateBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      console.warn("No history available to navigate back.");
    }
  }

  const handleShowNow = (defMethod: any) => {
    console.log("chekcing video.defaultCommunication", defMethod);
    switch (defMethod) {
      case "WHATSAPP_NUMBER":
        // Trigger WhatsApp with the number
        if (video?.contactUs?.indMobileNum) {
          window.open(
            `https://wa.me/${video.contactUs.indMobileNum}`,
            "_blank",
          );
        } else {
          console.warn("WhatsApp number is not available");
        }
        break;

      case "EMAIL":
        // Trigger default email app
        if (video?.contactUs?.indEmail) {
          window.open(`mailto:${video.contactUs.indEmail}`, "_self");
        } else {
          console.warn("Email is not available");
        }
        break;

      case "PHONE_NUMBER":
        // Trigger phone dialer
        if (video?.contactUs?.indMobileNum) {
          window.open(`tel:${video.contactUs.indMobileNum}`, "_self");
        } else {
          console.warn("Phone number is not available");
        }
        break;

      case "WEBSITE":
        // Open the website in a new tab
        if (video?.website) {
          let websiteUrl = video.website;
          if (
            !websiteUrl.startsWith("http://") &&
            !websiteUrl.startsWith("https://")
          ) {
            // Check if it starts with "www."
            if (websiteUrl.startsWith("www.")) {
              websiteUrl = `https://${websiteUrl}`;
            } else {
              // Assume it's a domain without protocol or subdomain
              websiteUrl = `https://${websiteUrl}`;
            }
          }
          window.open(websiteUrl, "_blank");
        } else {
          console.warn("Website is not available");
        }
        break;

      default:
        console.warn("Invalid communication method");
    }
  };

  return (
    <>
      {/* Like/Dislike Animations */}
      <LikeAnimation isLike={true} show={showLikeAnimation} />
      <LikeAnimation isLike={false} show={showDislikeAnimation} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {isMobile && (
        <div
          className="absolute top-4"
          style={{
            top: "3%",
            // right: "21rem",
            left: "2%",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={navigateBack}
          >
            <ArrowLeft size={80} />
          </Button>
        </div>
      )}

      <div
        className="absolute top-3/4 transform -translate-y-1/2 flex flex-col gap-6 items-center"
        style={{
          right: `${!isMobile ? "-5rem" : "1rem"}`,
          top: "64%",
        }}
      >
        {
          <>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-transform ${isLiked ? "scale-125" : ""}`}
                onClick={() =>
                  isLiked
                    ? handleAuthAction(handleunLike)
                    : handleAuthAction(handleLike)
                }
              >
                <ThumbsUp
                  className={`h-6 w-6 ${isLiked ? "fill-white" : ""}`}
                />
              </Button>
              <span className="text-sm">Like</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-transform ${isBookmarked ? "scale-125" : ""}`}
                onClick={() => handleAuthAction(handleBookmark)}
              >
                {/* <ThumbsDown className={`h-6 w-6 ${unLiked ? "fill-white" : ""}`} /> */}
                <Bookmark
                  className={`h-6 w-6 ${isBookmarked ? "fill-white" : ""}`}
                />
              </Button>
              <span className="text-sm">Bookmark</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className=""
                onClick={() => handleAuthAction(handleShowComments)}
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
              <span className="text-sm">Comment</span>
            </div>
          </>
        }
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handleShare}
          >
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-sm">Share</span>
        </div>
      </div>

      {/* Bottom info */}
      <div
        className="absolute bottom-4 left-4 right-16 text-white"
        style={{
          top: `${isMobile ? "80%" : "75%"}`,
          // left: `${isMobile && "0"}`,
        }}
      >
        <div className="flex items-center gap-3 mb-2 cursor-pointer">
          <Avatar>
            <AvatarImage
              src={
                video?.businessDetails
                  ? video?.businessDetails.defaultBusinessImage?.original
                  : video?.userDetails?.indPic?.original
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-4">
            <div
              className="flex-1"
              onClick={() =>
                router.push(
                  video?.businessDetails
                    ? "/" + video.businessDetails.handle
                    : "/profile/" + video?.userDetails.userName,
                )
              }
            >
              <h3 className="font-semibold cursor-pointer">
                {video?.businessDetails
                  ? video.businessDetails.handle
                  : `${video?.userDetails.indFirstName} ${video?.userDetails.indLastName}`}
              </h3>
              <p className="text-sm text-white/80">{video?.title}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={
                isFollowed
                  ? () => handleAuthAction(handleUnfollow)
                  : () => handleAuthAction(handleFollow)
              }
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
            {video?.businessDetails && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  handleShowNow(video?.businessDetails?.defaultCommunication)
                }
              >
                Shop Now
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {video?.hashtags?.map(
            (tag: any, index: any) =>
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
        ownerName={video?.userDetails.userName || ""}
        onClose={() => setShowComments(false)}
        videoId={video?.videoId}
      />
    </>
  );
}
