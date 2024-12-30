"use client";

import { apiClient } from "@/lib/apiClient";
import { useState, useEffect } from "react";
import { Video } from '../types/video';


interface ApiResponse {
  message: string;
  data: {
    count: number;
    data: Video[];
  };
}

interface UseInfiniteVideosReturn {
  videos: Video[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export function useInfiniteVideos(
  categoryId: string,
  initialVideo: Video | null,
): UseInfiniteVideosReturn {
  const [videos, setVideos] = useState<Video[]>(
    initialVideo ? [initialVideo] : [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skip, setSkip] = useState(0);

  const fetchVideos = async () => {
    if (!categoryId || loading || !hasMore) return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        categoryId,
        limit: "10",
        skip: "0",
        flag: "1",
        radius: "110",
      });

      const response = await apiClient<ApiResponse>(
        `/videoUsingCategoryId?${queryParams.toString()}`,
        "GET",
      );

      if (response.success && response.data?.data?.data) {
        const newVideos = response.data.data.data;
        if (Array.isArray(newVideos)) {
          // Filter out the initial video if it exists
          const filteredVideos = initialVideo
            ? newVideos.filter((video) => video._id !== initialVideo._id)
            : newVideos;

          setVideos((prev) => [...prev, ...filteredVideos]);
          setHasMore(newVideos.length === 10);
          setSkip((prev) => prev + 10);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load videos");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId && initialVideo) {
      // Reset state when category changes
      setVideos([initialVideo]);
      setSkip(0);
      setHasMore(true);
      setCurrentIndex(0);
      fetchVideos();
    }
  }, [categoryId, initialVideo]);

  const loadMore = async () => {
    await fetchVideos();
  };

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    currentIndex,
    setCurrentIndex,
  };
}
