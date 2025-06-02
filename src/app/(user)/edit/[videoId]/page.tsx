"use client";

import { useEffect, useState } from "react";

import { fetchVideoDetails } from "@/apis/watch";
import { useParams } from "next/navigation";
import { EditPostData, ApiResponse } from "./types";
import Loader from "@/components/ui/loader";
import { ReviewForm } from "../../post/components/ReviewForm";
import { Header } from "../../home/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "../../home/components/sidebar";

export default function EditPost() {
  const params = useParams();
  const [videoData, setVideoData] = useState<EditPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
   

    const fetchData = async () => {
      try {
        const videoId = params.videoId as string;
        const response = await fetchVideoDetails(videoId);
        const apiResponse = response as ApiResponse;

        const transformedData: EditPostData = {
          cdnVideoPath: apiResponse.data.cdnVideoPath,
          title: apiResponse.data.title,
          hashtags: apiResponse.data.hashtags,
          desc: apiResponse.data.desc,
          tags: apiResponse.data.tags,
          isProduct: apiResponse.data.isProduct,
          isService: apiResponse.data.isService,
          isPlaces: apiResponse.data.isPlaces,
          uploaderRating: apiResponse.data.uploaderRating || {},
          // videoId: videoId
        };

        setVideoData(transformedData);
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.videoId]);

  if (loading) {
    return <Loader />;
  }

  if (!videoData) {
    return <div>Error loading video data</div>;
  }

  return (
    <div className="flex h-screen bg-background flex-col">
      <Header />

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div className="flex-1 overflow-scroll scrollbar-hide">
          <main
            className="min-h-screen bg-gradient-to-b from-background to-secondary h-full
              overflow-scroll scrollbar-hide"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold">Edit Your Review</h1>
              </div>
              <ReviewForm
                isEdit={true}
                initialData={{
                  videoUrl: videoData.cdnVideoPath,
                  title: videoData.title,
                  category: videoData.isProduct
                    ? "product"
                    : videoData.isService
                      ? "service"
                      : "place",
                  desc: videoData.desc,
                  hashtags: videoData.hashtags,
                  tags: videoData.tags,
                  uploaderRating: videoData.uploaderRating,
                  videoId: params.videoId as string,
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
