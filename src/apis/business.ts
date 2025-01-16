import { apiClient } from "@/lib/apiClient";

export const addBusiness = async (payload: Record<string, any>) => {
  const response = await apiClient(`/businessPage`, "POST", payload);

  if (!response.success) {
    console.error("Error adding business:", response.error);
    throw new Error(response.error || "Failed to add business");
  }

  return response.data;
};

export async function fetchbusinessPageData(handle: string) {
  const response = await apiClient(`/businessPageByHandle/${handle}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch business page data:", response.error);
    return null;
  }
}

///api/uploadBusinessProfileImage/{id}

export async function uploadBusinessProfile(Id: string, formData: FormData) {
  try {
    const response = await apiClient(
      `/uploadBusinessProfileImage/${Id}`,
      "PUT",
      formData,
    );

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

export async function uploadBusinessBanner(Id: string, formData: FormData) {
  try {
    const response = await apiClient(
      `/uploadBusinessBannerImage/${Id}`,
      "PUT",
      formData,
    );

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
export async function fetchBusinessPostsVideos(id: string, count?: number) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: "0",
    flag: "1",
    businessPageId: id,
  }).toString();
  const response = await apiClient(`/uploadedVideos?${queryParams}`, "GET");
  console.log("fetchProfilePosts::", response);
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchProfilePosts data:", response.error);
    return null;
  }
}

export async function fetchBusinessTaggedVideos(id: string, count: number) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: "0",
    // flag: "1",
    businessPageId: id,
  }).toString();
  const response = await apiClient(`/taggedVideos?${queryParams}`, "GET");
  console.log("fetchTaggedVideos::", response);
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchTaggedVideos data:", response.error);
    return null;
  }
}

// /api/followBusinessPage/{id},
export const followMerchant = async (id: string) => {
  console.log(":::::::::::::::::::", id);
  const response = await apiClient(`/followBusinessPage/${id}`, "PUT");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};

// /api/unfollowBusinessPage/{id},

export const unFollowMerchant = async (id: string) => {
  console.log(":::::::::::::::::::", id);
  const response = await apiClient(`/unfollowBusinessPage/${id}`, "PUT");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch data:", response.error);
    return null;
  }
};

export const getBusinessPageList = async () => {

  const res = await apiClient(`/businessPageList?pageNum=1`, "GET");
  if (res.success) {
    return res.data;
  } else {
    console.error("Failed to fetch data;", res.error);
    return null;
  }
};
