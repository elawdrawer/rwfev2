"use client";
import { Metadata } from "next";
import React, { useEffect, useRef } from "react";
// import { BrandHeader } from "./components/BrandPageBanner";
import { brandInfo, dummyCategoryData, posts, reviews } from "./data/mockdata";
import { Footer } from "@/components/layout";
import { BrandHeader } from "./components/brand-banner";
import HorizontalScrollWithArrows from "@/components/horizontalScrollWithArrows/HorizontalScrollWithArrows.component";
import { Card, CardContent } from "@/components/ui/card";
// import PostSection from "./components/post-section";

export interface ReviewCardProps {
  _id: string;
  userDetails: {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
  };
  videoId: string;
  hashtags: string[];
  title: string;
  uploaderRating:
    | {
        [key: string]: {
          value: string;
          rating: number;
        };
      }
    | {
        value: string;
        rating: number;
      };
  desc: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  totalViewCount: number;
  totalShareCount: number;
  totalLikes: number;
  totalComments: number;
  isCommentingAllowed: boolean;
  avgRating: number;
  status: string;
  uploadedAt: string;
  videoLocation: {
    type: string;
    coordinates: number[];
  };
  locationName: string;
  isSponsored: boolean;
  isAdvertisement: boolean;
  categoryId?: string;
  adminRejectionReason?: string;
  reasonToDelete?: string;
}

interface PostSectionProps {
  categoryData: {
    message: string;
    data: {
      count: number;
      data: ReviewCardProps[];
    };
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  _id,
  title,
  desc,
  totalViewCount,
  cdnThumbPath,
  cdnVideoPath,
  userDetails,
}) => (
  <Card
    className="w-[200px] flex-shrink-0 rounded-md cursor-pointer transition-transform
      hover:scale-105"
  >
    <CardContent className="p-0">
      {/* <motion.div
          className="relative w-full overflow-hidden rounded-md"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.2 }}
          whileTap={{ scale: 0.9 }}
        > */}
      <img
        src={cdnThumbPath[0]}
        alt={title}
        width={300}
        height={500}
        className="rounded-md object-cover"
        style={{
          aspectRatio: "16/9",
          minWidth: "300px",
          height: "400px",
        }}
      />
      {/* </motion.div> */}
      <div className="p-2">
        <p className="font-semibold truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">{desc}</p>
        <p className="text-xs text-gray-400">{userDetails.userName}</p>
        <p className="text-xs text-gray-400">{totalViewCount} views</p>
      </div>
    </CardContent>
  </Card>
);

const PostSection: React.FC<PostSectionProps> = ({ categoryData }) => {
  if (!categoryData || !categoryData.data) {
    return <div>No data available</div>;
  }

  const { data } = categoryData.data;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-black font-bold mb-6 mt-8">
          Watch reviews
        </h2>

        <div className="overflow-x-auto">
          <div
            className="flex space-x-4 p-4 min-w-max scrollbar-hide"
            style={{
              overflowX: "scroll",
            }}
          >
            <HorizontalScrollWithArrows
              arrowType="white"
              data={data} // Pass data for scroll checking
              className="pl-5"
            >
              {data.map((short, index) => (
                <ReviewCard key={`${short._id}-${index}`} {...short} />
              ))}
            </HorizontalScrollWithArrows>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BrandPage({ params }: { params: any }) {
  // Fetch brand data (replace this with API call)
  //   const brandData = {
  //     name: brand,
  //     description: `This is the page for the brand ${brand}.`,
  //   };

  return (
    <main className="min-h-screen bg-gray-50">
      <BrandHeader info={brandInfo} />

      {/* product review section */}
      <div className="container">
        {/* <PostSection categoryData={dummyCategoryData} /> */}
      </div>

      {/* post section */}

      <div className="container">
        <div className="text-black">Posts</div>
      </div>

      <Footer />
    </main>
  );
}

// export default BrandPage;
