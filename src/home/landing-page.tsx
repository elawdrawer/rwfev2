"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import LoadingUI from "../app/loading";
import { motion } from "framer-motion";
import HorizontalScrollWithArrows from "@/components/horizontalScrollWithArrows/HorizontalScrollWithArrows.component";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Hls from "hls.js";
import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface ShortCardProps {
  title: string;
  description: string;
  totalViewCount: number;
  cdnThumbPath: string;
  cdnVideoPath: string;
  viewInLast15Days?: number;
  distance?: number;
  videoId?: string;
}

interface HeroSlide {
  videoId: string;
  title: string;
  description: string;
  cdnThumbPath: string[];
  cdnVideoPath: string;
  cta1Action?: string;
  cta1URL?: string;
  cta2Action?: string;
  cta2URL?: string;
  isLive?: boolean;
  validity?: {
    from: string;
    to: string;
  };
}

interface CategoryData {
  [key: string]: {
    popular: ShortCardProps[];
    trending: ShortCardProps[];
    advertisement: HeroSlide[];
    nearby: ShortCardProps[];
  };
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LandingPageProps {
  categoriesData: {
    message: string;
    data: CategoryData | null; // Allow null for the loading state.
  } | null; // Allow null when data hasn't loaded.
}

// Memoize the HLSVideo component
const HLSVideo = memo(
  ({
    src,
    poster,
    className,
    style,
    onVideoEnd,
    isVisible,
  }: {
    src: string;
    poster: string;
    className?: string;
    style?: React.CSSProperties;
    onVideoEnd?: () => void;
    isVisible?: boolean;
  }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // Video timing constants
    const VIDEO_PLAY_DURATION = 10000; // 10 seconds of playback

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const cleanup = () => {
        if (playbackTimerRef.current) {
          clearTimeout(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }

        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }

        video.pause();
        video.removeAttribute("src");
        video.load();
        setIsVideoLoaded(false);
      };

      if (!isVisible) {
        cleanup();
        return;
      }

      const startPlayback = () => {
        video
          .play()
          .then(() => {
            playbackTimerRef.current = setTimeout(() => {
              video.pause();
              onVideoEnd?.();
            }, VIDEO_PLAY_DURATION);
          })
          .catch((e) => console.error("Playback failed:", e));
      };

      if (Hls.isSupported()) {
        const hls = new Hls({
          maxMaxBufferLength: 5,
          maxBufferSize: 0,
          maxBufferLength: 5,
          enableWorker: true,
        });
        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsVideoLoaded(true);
          startPlayback();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                cleanup();
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.addEventListener(
          "loadeddata",
          () => {
            setIsVideoLoaded(true);
            startPlayback();
          },
          { once: true },
        );
      }

      return cleanup;
    }, [src, isVisible, onVideoEnd]);

    if (!isVisible) return null;

    return (
      <div className="relative w-full h-full">
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        <video
          ref={videoRef}
          poster={poster}
          className={className}
          style={style}
          autoPlay
          muted
          playsInline
          onEnded={onVideoEnd}
          preload="none" // Prevent preloading
        />
      </div>
    );
  },
);

const HeroSlideContent = memo(
  ({
    slide,
    isActive,
    isSingleSlide = false,
  }: {
    slide: HeroSlide;
    isActive: boolean;
    isSingleSlide?: boolean;
  }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const isMobile = useIsMobile();
    const [ref, isInView] = useIntersectionObserver({
      threshold: 0.5,
      rootMargin: "100px",
    });

    // Timing constants
    const VIDEO_TRANSITION_DELAY = 1800; // 2s delay before video appears

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (isActive && isInView) {
        setShouldLoadVideo(true);
        setShowVideo(false);

         if (!isSingleSlide) {
          timeoutRef.current = setTimeout(() => {
            setShowVideo(true);
          }, VIDEO_TRANSITION_DELAY);
        }
      } else {
        setShowVideo(false);
        if (!isActive) {
          setShouldLoadVideo(false);
        }
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, [isActive, isInView, isSingleSlide]);

    const handleVideoEnd = useCallback(() => {
      setShowVideo(false);
      timeoutRef.current = setTimeout(() => {
        if (isInView) {
          setShowVideo(true);
        }
      }, VIDEO_TRANSITION_DELAY);
    }, [isInView]);

    return (
      <div className="relative w-full h-[70vh] group" ref={ref}>
        {/* Background Image (always shown) */}
        <div
          className={`relative h-[400px] inset-0 transition-all duration-700 ${
            showVideo ? "opacity-0 scale-105" : "opacity-100 scale-100" }`}
        >
          <Image
            src={slide.cdnThumbPath[0]}
            alt={slide.description}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority={isActive}
            sizes="100vw"
            quality={100}
            loading={isActive ? "eager" : "lazy"}
          />
        </div>

        {/* Video Container (only when shouldLoadVideo is true) */}
        {shouldLoadVideo && slide.cdnVideoPath && (
          <div
            className={`absolute inset-0 transition-all duration-700 ${
            showVideo ? "opacity-100 scale-100" : "opacity-0 scale-105" }`}
          >
            <HLSVideo
              src={slide.cdnVideoPath}
              poster={slide.cdnThumbPath[0]}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out
                group-hover:scale-105"
              isVisible={showVideo}
              onVideoEnd={handleVideoEnd}
            />
          </div>
        )}

        {/* Content Overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-12 transition-all duration-350
            bg-gradient-to-t from-black/90 via-black/50 to-transparent
            group-hover:from-black/95"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.42 }}
            className={`flex gap-6 transform transition-all duration-350 ${
              isMobile ? "justify-center" : "justify-start" }`}
          >
            {slide.cta1Action && slide.cta1URL && (
              <button
                onClick={() => window.open(slide.cta1URL, "_blank")}
                className="rounded-lg transition-all duration-210 bg-white text-black font-semibold
                  hover:bg-opacity-90 hover:scale-105 hover:shadow-xl active:scale-95 transform
                  text-base uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  paddingInline: "28px",
                  paddingBlock: "12px",
                }}
              >
                {slide.cta1Action}
              </button>
            )}
            {slide.cta2Action && slide.cta2URL && (
              <button
                onClick={() => window.open(slide.cta2URL, "_blank")}
                className="rounded-lg transition-all duration-210 bg-white text-black font-semibold
                  hover:bg-opacity-90 hover:scale-105 hover:shadow-xl active:scale-95 transform
                  text-base uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  paddingInline: "28px",
                  paddingBlock: "12px",
                  lineHeight: "20px",
                }}
              >
                {slide.cta2Action}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  },
);

HeroSlideContent.displayName = "HeroSlideContent";

const HeroSection: React.FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  console.log("HeroSection", slides.length);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) {
    return null;
  }

  if (slides.length === 1) {
    return (
      <div className="w-full relative">
        <div className="w-full h-[35rem]">
          <HeroSlideContent
            slide={slides[0]}
            isActive={true}
            // Add this prop to prevent the video transition
            isSingleSlide={true}
          />
        </div>
      </div>
    );
  }

  // For multiple slides, use Swiper
  return (
    <div className="w-full relative">
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          color: white !important;
        }
        .swiper-pagination {
          position: absolute !important;
          bottom: 20px !important;
          z-index: 10 !important;
        }
        .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background: rgba(255, 255, 255, 0.6) !important;
          opacity: 0.6 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        navigation
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        effect="fade"
        loop={true}
        allowTouchMove={false}
        className="w-full h-[35rem]"
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        speed={1000}
        fadeEffect={{
          crossFade: true,
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.videoId}-${index}`}>
            <HeroSlideContent slide={slide} isActive={index === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Memoize the ShortCard component
const ShortCard = memo(
  ({
    title,
    description,
    totalViewCount,
    cdnThumbPath,
    cdnVideoPath,
    videoId,
  }: ShortCardProps) => {
    const router = useRouter();

    const handleClick = useCallback(() => {
      router.push(`/watch?v=${videoId}`);
    }, [router, videoId]);

    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.14 }}
        className="w-[220px] sm:w-[200px] flex-shrink-0"
      >
        <Card
          className="w-full h-[400px] flex flex-col justify-between rounded-xl overflow-hidden
            shadow-lg hover:shadow-2xl transition-all duration-210 hover:scale-[1.02]
            bg-black/5 backdrop-blur-sm"
          onClick={handleClick}
        >
          <CardContent className="p-0 flex flex-col h-full">
            {/* Image Section */}
            <motion.div
              className="relative w-full h-full overflow-hidden rounded-md"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.14 }}
              whileTap={{ scale: 0.98 }}
              style={{
                minHeight: "280px",
                paddingBlockEnd: "12px",
              }}
            >
              <Image
                src={cdnThumbPath[0]}
                alt={title}
                width={220}
                height={400}
                className="rounded-md object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                loading="lazy"
              />
            </motion.div>

            {/* Text Section */}
            <div className="p-4 flex flex-col flex-grow">
              <p className="font-semibold text-base line-clamp-2 h-[42px] overflow-hidden">
                {title}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-[40px] overflow-hidden"
                style={{
                  // height: "6rem",
                  // width: "16rem",
                  overflow: "hidden",
                  // padding: "6px",
                  textAlign: "start",
                }}
              >
                {description}
              </p>

              {/* Views Section */}
              {/* <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{totalViewCount.toLocaleString()} views</span>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);

// Memoize the SubHeadingContent component
const SubHeadingContent = memo(
  ({ title, cards }: { title: string; cards: ShortCardProps[] }) => {
    const cardComponents = useMemo(
      () =>
        cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ShortCard {...card} />
          </motion.div>
        )),
      [cards],
    );

    return (
      <div className="mb-16">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold pl-5 flex items-center gap-2 p-3"
        >
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          {title}
        </motion.h3>
        <div>
          <div className="flex space-x-6 p-4 min-w-max scrollbar-hide">
            <HorizontalScrollWithArrows
              arrowType="white"
              data={cards}
              className="pl-5"
            >
              {cardComponents}
            </HorizontalScrollWithArrows>
          </div>
        </div>
      </div>
    );
  },
);

// Memoize the CategorySection component
const CategorySection = memo(
  ({
    categoryName,
    categoryContent,
  }: {
    categoryName: string;
    categoryContent: CategoryData[string];
  }) => {
    const sections = useMemo(
      () =>
        ["popular", "trending", "nearby"].map(
          (section) =>
            categoryContent[section as keyof typeof categoryContent] &&
            (
              categoryContent[
                section as keyof typeof categoryContent
              ] as ShortCardProps[]
            ).length > 0 && (
              <SubHeadingContent
                key={section}
                title={section.charAt(0).toUpperCase() + section.slice(1)}
                cards={
                  categoryContent[
                    section as keyof typeof categoryContent
                  ] as ShortCardProps[]
                }
              />
            ),
        ),
      [categoryContent],
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 p-3 flex"
          style={{
            textAlign: "start",
          }}
        >
          {categoryName}
        </motion.div>
        {categoryContent?.advertisement &&
          categoryContent.advertisement.length > 0 && (
            <div className="mb-12">
              <HeroSection slides={categoryContent.advertisement} />
            </div>
          )}
        {sections}
      </motion.div>
    );
  },
);

const LandingPage: React.FC<LandingPageProps> = ({ categoriesData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("LandingPage Data:", {
      hasData: !!categoriesData?.data,
      categories: categoriesData?.data ? Object.keys(categoriesData.data) : [],
      fullData: categoriesData,
    });

    if (scrollContainerRef.current) {
      let ctx = gsap.context(() => {
        gsap.to(scrollContainerRef.current, {
          y: () =>
            -(scrollContainerRef.current!.scrollHeight - window.innerHeight),
          ease: "back.inOut",
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }, scrollContainerRef);

      return () => ctx.revert();
    }
  }, [categoriesData]);

  if (!categoriesData || !categoriesData.data) {
    console.log("No categoriesData available");
    return <LoadingUI />;
  }

  // Get global advertisements (null category)
  const globalAds = categoriesData.data["null"]?.advertisement || [];
  console.log("Global Ads:", {
    hasGlobalAds: !!globalAds?.length,
    adsCount: globalAds?.length,
    ads: globalAds,
  });

  return (
    <>
      <div className="min-h-screen">
        {globalAds && globalAds.length > 0 && (
          <div className="mb-12">
            <HeroSection slides={globalAds} />
          </div>
        )}
        <div className="container mx-auto">
          {Object.entries(categoriesData.data)
            .filter(([categoryName]) => categoryName !== "null")
            .map(([categoryName, categoryContent]) => (
              <CategorySection
                key={categoryName}
                categoryName={categoryName}
                categoryContent={categoryContent}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
