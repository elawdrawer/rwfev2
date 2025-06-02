"use client";
import { VideoPlayer } from "./components/video-player";
import { VideoControls } from "./components/video-control";
import { VideoControlsProvider } from "./providers/video-control-provider";
import { Header } from "../home/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import { fetchVideoDetails, updateViewCount } from "@/apis/watch";
import { useInfiniteVideos } from "./hooks/use-infinite-scroll";
import { ScrollButton } from "./components/scroll-button";
import { Sidebar } from "../home/components/sidebar";
import { isUserLoggedIn } from "@/lib/utils";

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
  website: string;
  defaultCommunication: string;
}

export default function WatchPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || "";
  const [initialVideo, setInitialVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    videos: fetchedVideos,
    error,
    hasMore,
    loadMore,
    currentIndex,
    setCurrentIndex,
  } = useInfiniteVideos(initialVideo?.categoryId || "", null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    handleScroll("down");
  }, [initialVideo]);

  const videos = [...(initialVideo ? [initialVideo] : []), ...fetchedVideos];

  useEffect(() => {
    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoIndex = parseInt(
              entry.target.getAttribute("data-index") || "0",
            );
            setCurrentIndex(videoIndex);

            // Load more videos when we're near the end
            if (videoIndex === videos.length - 2 && hasMore) {
              loadMore();
            }
          }
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px",
        threshold: 0.7, // 70% of the item must be visible
      },
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos.length, hasMore, loadMore, setCurrentIndex]);

  useEffect(() => {
    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoIndex = parseInt(
              entry.target.getAttribute("data-index") || "0",
            );
            setCurrentIndex(videoIndex);

            // Load more videos when we're near the end
            if (videoIndex === videos.length - 2 && hasMore) {
              loadMore();
            }
          }
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px",
        threshold: 0.7, // 70% of the item must be visible
      },
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos.length, hasMore, loadMore, setCurrentIndex]);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    // Disconnect existing observations
    observer.disconnect();

    // Observe all video containers
    const videoElements = document.querySelectorAll(".video-container");
    videoElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

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

  // useEffect(() => {
  //   if (videos[currentIndex]?.videoId) {
  //     router.replace(`?v=${videos[currentIndex].videoId}`, { scroll: false });
  //   }
  // }, [currentIndex, videos]);

  useEffect(() => {
    const updateViews = async () => {
      if (videos[currentIndex]?.videoId) {
        try {
          await updateViewCount(videos[currentIndex].videoId);
          console.log("View count updated for:", videos[currentIndex].videoId);
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      }
    };

    // Only update if we have a valid video ID and not the initial load
    if (currentIndex >= 0 && videos.length > 0) {
      updateViews();
    }
  }, [currentIndex]);

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

  const isLoggedIn = isUserLoggedIn();

  if (loading) {
    return <div>Loading...</div>; // Consider adding a proper loading component
  }

  return isLoggedIn ? (
    !isMobile ? (
      <div className="flex h-screen bg-background flex-col">
        <Header />

        <div className="flex overflow-hidden">
          <div>{!isMobile && <Sidebar />}</div>

          <main className="flex-1 relative overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative w-full transition-all duration-400 ease-in-out"
                style={{
                  maxHeight: "-webkit-fill-available",
                  paddingBlock: "12px",
                  maxWidth: `${!isMobile && "420px"}`,
                  width: `${!isMobile && "100%"}`,
                }}
                id="video-container"
              >
                {videos.map((video, index) => (
                  <div
                    key={`${video.videoId}-${index}`}
                    data-index={index}
                    className={`video-container h-screen w-full snap-start snap-always ${
                      !isMobile
                        ? "shadow-[0_0_90px_rgba(170,175,170,0.55)]"
                        : ""
                      } ${index === currentIndex ? "opacity-100" : "opacity-95"}`}
                    style={{
                      marginBottom: !isMobile ? "20px" : "0",
                    }}
                  >
                    <VideoControlsProvider>
                      <div className="relative w-full h-full">
                        <VideoPlayer
                          videoUrl={video.cdnVideoPath}
                          autoPlay={index === currentIndex}
                          videoId={video.videoId}
                        />
                        <VideoControls video={video} />
                      </div>
                    </VideoControlsProvider>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    ) : (
      <div className="flex flex-col h-screen bg-black overflow-scroll">
        <main className="flex-1 relative overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative w-full transition-all duration-400 ease-in-out"
              style={{
                height: "-webkit-fill-available",
                paddingBlock: "12px",
                maxWidth: `${!isMobile && "400px"}`,
              }}
              id="video-container"
            >
              {videos.map((video, index) => (
                <div
                  key={`${video.videoId}-${index}`}
                  data-index={index}
                  className={`video-container h-screen w-full snap-start snap-always ${
                    !isMobile ? "shadow-[0_0_90px_rgba(170,175,170,0.55)]" : "" }
                    ${index === currentIndex ? "opacity-100" : "opacity-95"}`}
                >
                  <VideoControlsProvider>
                    <div className="flex relative w-full h-full">
                      <VideoPlayer
                        videoUrl={video.cdnVideoPath}
                        autoPlay={index === currentIndex}
                        videoId={video.videoId}
                      />
                      <VideoControls video={video} />
                    </div>
                  </VideoControlsProvider>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  ) : (
    <div className="flex flex-col h-screen bg-black overflow-scroll scrollbar-hide">
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
            color: "#ffffff",
          }}
        >
          <span>Back</span>
        </div>
      )}
      <main className="flex-1 relative overflow-y-scroll snap-y snap-mandatory">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full transition-all duration-400 ease-in-out"
            style={{
              height: "-webkit-fill-available",
              paddingBlock: "12px",
              maxWidth: `${!isMobile && "400px"}`,
            }}
            id="video-container"
          >
            {videos.map((video, index) => (
              <div
                key={`${video.videoId}-${index}`}
                data-index={index}
                className={`video-container h-screen w-full snap-start snap-always ${
                  !isMobile ? "shadow-[0_0_90px_rgba(170,175,170,0.55)]" : "" }
                  ${index === currentIndex ? "opacity-100" : "opacity-95"}`}
              >
                <VideoControlsProvider>
                  <div className="relative w-full h-full flex">
                    <VideoPlayer
                      videoUrl={video.cdnVideoPath}
                      autoPlay={index === currentIndex}
                      videoId={video.videoId}
                    />
                    <VideoControls video={video} />
                  </div>
                </VideoControlsProvider>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
