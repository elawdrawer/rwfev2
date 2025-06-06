import { apiClient } from "@/lib/apiClient";

export const addBusiness = async (payload: Record<string, any>) => {
  const response = await apiClient(`/businessPage`, "POST", payload);

  if (!response.success) {
    console.error("Error adding business:", response.error);
    throw new Error(response.error || "Failed to add business");
  }

  return response.data;
};

export const editBusiness = async (
  handle: string,
  payload: Record<string, any>,
) => {
  const response = await apiClient(`/businessPage/${handle}`, "PUT", payload);

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
export async function fetchBusinessPostsVideos(id: string) {
  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    flag: "1",
    businessPageId: id,
  }).toString();
  const response = await apiClient(`/businessPosts?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchProfilePosts data:", response.error);
    return null;
  }
}

export async function fetchBusinessPendingPostsVideos(id: string) {
  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    flag: "2",
    businessPageId: id,
  }).toString();
  const response = await apiClient(`/businessPosts?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchProfilePosts data:", response.error);
    return null;
  }
}

export async function fetchBusinessTaggedVideos(id: string) {
  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    // flag: "1",
    businessPageId: id,
  }).toString();
  const response = await apiClient(`/businessTaggedPosts?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchTaggedVideos data:", response.error);
    return null;
  }
}

// /api/followBusinessPage/{id},
export const followMerchant = async (id: string) => {
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
  const response = await apiClient(`/unfollowBusinessPage/${id}`, "PUT");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch data:", response.error);
    return null;
  }
};

export const getBusinessPageList = async () => {
  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    // flag: "1",
  }).toString();

  const res = await apiClient(`/businessPageList?${queryParams}`, "GET");
  if (res.success) {
    return res.data;
  } else {
    console.error("Failed to fetch data;", res.error);
    return null;
  }
};

export async function checkUBusinessHandleAvailability(
  userName: string,
  type: string,
) {
  const response = await apiClient(
    `userNameAvailability/${encodeURIComponent(userName)}?type=${encodeURIComponent(type)}`,
    "GET",
  );

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to check username availability:", response.error);
    return null;
  }
}

export const setProfilePicture = async (id: string, imageId: string) => {
  const payload = {
    id: id,
    imageId: imageId,
  };
  const response = await apiClient(`/setExistingBusinessProfileImage`, "PUT", payload);

  if (!response.success) {
    console.error("Error adding business:", response.error);
    throw new Error(response.error || "Failed to add business");
  }

  return response.data;
};


