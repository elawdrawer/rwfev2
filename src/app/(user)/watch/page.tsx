"use client";
import { VideoPlayer } from "./components/video-player";
import { VideoControls } from "./components/video-control";
import { VideoControlsProvider } from "./providers/video-control-provider";
import { Header } from "../home/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { fetchVideoDetails } from "@/apis/watch";
import { useInfiniteVideos } from "./hooks/use-infinite-scroll";
import { ScrollButton } from "./components/scroll-button";

interface VideoDetails {
  _id: string;
  videoId: string;
  userId: string;
  title: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  totalViewCount: number;
  avgRating: number;
  hashtags: string[];
  userDetails: {
    indFirstName: string;
    indLastName: string;
    userName: string;
    indPic: {
      original: string;
      thumbnail: string;
    };
  };
  isLiked: boolean;
  totalLikes: number;
  isBookmarked: boolean;
  categoryId: string;
  totalComments: number;
  isFollowed: boolean;
}

export default function WatchPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || "";
  const [initialVideo, setInitialVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialVideo = async () => {
      try {
        setLoading(true);
        const response = await fetchVideoDetails(videoId);
        if (response?.data) {
          setInitialVideo(response.data);
        }
      } catch (error) {
        console.error("Error loading initial video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      loadInitialVideo();
    }
  }, [videoId]);

  const {
    videos,
    loading: loadingMore,
    error,
    hasMore,
    loadMore,
    currentIndex,
    setCurrentIndex,
  } = useInfiniteVideos(initialVideo?.categoryId || "", initialVideo);

  console.log("checking videoUrl and hasMore", currentIndex, hasMore);

  const handleScroll = (direction: "up" | "down") => {
    const newIndex =
      direction === "up"
        ? Math.max(0, currentIndex - 1)
        : Math.min(videos.length - 1, currentIndex + 1);

    setCurrentIndex(newIndex);

    // Load more videos if we're near the end
    if (direction === "down" && videos.length - newIndex <= 3 && hasMore) {
      loadMore();
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        handleScroll("down");
      } else {
        handleScroll("up");
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex, videos.length]);

  if (loading) {
    return <div>Loading...</div>; // Consider adding a proper loading component
  }

  // if (!categoryId) return null;

  if (!initialVideo) return null;

  const currentVideo = videos[currentIndex];

  return (
    <div className="flex flex-col h-screen bg-black">
      {!isMobile && (
        <div
          onClick={() => router.back()}
          className="absolute"
          style={{
            top: "5%",
            left: "2%",
            cursor: "pointer",
            fontSize: "24px",
            fontWeight: "600",
            zIndex: "9999",
          }}
        >
          <span>Back</span>
        </div>
      )}
      <main className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full max-w-[400px] md:max-w-fit transition-all duration-400
              ease-in-out"
            style={{
              height: "-webkit-fill-available",
              paddingBlock: "12px",
            }}
            id="video-container"
          >
            <div className="h-full rounded-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.75)]">
              <VideoControlsProvider>
                <VideoPlayer
                  key={currentVideo?._id}
                  videoUrl={currentVideo?.cdnVideoPath}
                />
                <VideoControls video={currentVideo} />
              </VideoControlsProvider>
            </div>
          </div>
        </div>
        {/* 
        <div
          style={{
            zIndex: "9999",
          }}
        >
          <div
            className="absolute"
            style={{
              top: "45%",
              left: "95%",
            }}
          >
            <ScrollButton
              direction="up"
              onClick={() => handleScroll("up")}
              disabled={currentIndex === 0}
            />
          </div>
          <div
            className="absolute"
            style={{
              top: "55%",
              left: "95%",
            }}
          >
            <ScrollButton
              direction="down"
              onClick={() => handleScroll("down")}
              disabled={currentIndex === videos.length - 1 && !hasMore}
            />
          </div>
        </div> */}
      </main>
    </div>
  );
}
