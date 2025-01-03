import Image from "next/image";
import styles from "./BrandPageBanner.module.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, PhoneCall, Share2, Star, StarHalf } from "lucide-react";
import { useEffect, useRef } from "react";
import { BrandInfo } from "../types/brands";
import { animateFollow } from "@/lib/animation";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveImages from "@/components/responsiveImages/images.component";
import WhatsappLogo from "../../../../../../public/whatsApp-logo.png";

export function BrandHeader({ info }: { info: BrandInfo }) {
  const followButtonRef = useRef<HTMLButtonElement>(null);

  const handleFollow = () => {
    if (followButtonRef.current) {
      animateFollow(followButtonRef.current);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <StarHalf
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else {
            return <Star key={index} className="w-4 h-4 text-gray-300" />;
          }
        })}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
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

  const isMobile = useIsMobile();

  return (
    <div className="relative w-full">
      <div
        className="w-full h-[400px] relative bg-gradient-to-b from-gray-200 to-white"
        style={{
          backgroundImage:
            'url("https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/090833d5-7b09-4745-9d2d-3f4d31a035c1._CR0%2C0%2C3000%2C600_SX1920_.png")',
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div
                className="bg-white"
                style={{
                  borderRadius: "50%",
                  minWidth: "70px",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignContent: "center",
                  padding: "5px",
                }}
              >
                <ResponsiveImages
                  imageSrc={info.logo}
                  objectFitProp="contain"
                  layout="fixed"
                  classname="circularImage"
                  width={isMobile ? 70 : 100}
                  height={isMobile ? 70 : 100}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{info.name}</h1>
                  {info.isVerified && (
                    <Badge variant="secondary">Verified Brand</Badge>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-300">Rating:</span>
                    <StarRating rating={info.rating} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Rank:</span>
                    <span>#{info.rank}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                className="cursor-pointer absolute"
                style={{
                  top: "-220%",
                  right: "3%",
                }}
              >
                <PhoneCall size={36} />
              </div>
              <div
                className="cursor-pointer absolute"
                style={{
                  top: "-180%",
                  right: "3%",
                }}
              >
                <Image
                  src={WhatsappLogo}
                  alt="social-icon"
                  height={40}
                  width={36}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button>
                More Details
              </Button>
              <Button
                ref={followButtonRef}
                onClick={handleFollow}
                className="px-6"
              >
                Follow
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
