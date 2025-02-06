import { apiClient } from "../lib/apiClient";

export async function getSignedUrl(payload: Record<string, any>) {
  try {
    const response = await apiClient("/signedURL", "PUT", payload);

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch signed URL:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error in getSignedUrl function:", error);
    return null;
  }
}

export async function onUploadSuccess(videoId: string) {
  try {
    const response = await apiClient(`/uploadSuccess/${videoId}`, "PUT");

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch signed URL:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error in getSignedUrl function:", error);
    return null;
  }
}

export async function onUploadVideoThumbnail(videoId: string, formData: FormData) {
  try {
    const response = await apiClient(`/uploadVideoThumbnail/${videoId}`, "PUT", formData);

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch signed URL:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error in getSignedUrl function:", error);
    return null;
  }
}


export async function fetchTagSuggestions(keyword: string) {
  const response = await apiClient(`/find/${keyword}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}