import { apiClient } from "../lib/apiClient";
import { toast } from "sonner";

export async function fetchHomeCategories() {
  const queryParams = new URLSearchParams({ type: "video" }).toString();
  const response = await apiClient(`/categories?${queryParams}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

// export async function  fetchHomePageData() {
//   const queryParams = new URLSearchParams({
//     limit: "10",
//     skip: "0",
//     flag: "0",
//   }).toString();
//   const response = await apiClient(`/homepageData?${queryParams}`, "GET");
//   if (response.success && response.data) {
//     return response.data;
//   } else {
//     console.error("Failed to fetch landing page data:", response.error);
//     return null;
//   }
// }

export async function fetchHomePageData(selectedCategories?: string[]) {
  console.log("inside video feed fetchHomePageData");

  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    flag: "0",
  });

  // Add selected categories to query params if provided
  if (selectedCategories?.length) {
    queryParams.append("categories", selectedCategories.join(","));
  }

  try {
    const response = await apiClient(
      `/homepageData?${queryParams.toString()}`,
      "GET",
    );
    if (response.success && response.data) {
      return response;
    } else {
      console.error("Failed to fetch landing page data:", response.error);
      // Show toast and redirect when response is not successful
      toast.error("Session expired. Please login again.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500); // Redirect after 1.5 seconds to allow toast to be seen
      return null;
    }
  } catch (error) {
    console.error("Error fetching home page data:", error);

    // Type checking the error
    if (isApiError(error) && error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return null;
  }
}

// Type guard for API errors

// Type guard to check if the error is an API error with response
function isApiError(
  error: unknown,
): error is { response?: { status?: number } } {
  return typeof error === "object" && error !== null && "response" in error;
}

export async function logout() {
  const response = await apiClient(`/logout-all`, "POST");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export const signupWithSocialProvider = async (
  payload: Record<string, any>,
) => {
  try {
    const response = await apiClient(
      "/signupWithSocialProvider",
      "POST",
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
};

export const sendPushSubscription = async (
  payload: Record<string, any>,
) => {
  try {
    const response = await apiClient(
      "/notificationObj",
      "POST",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error sending push subscription:", error);
    throw error;
  }
};

export async function getViewingHistory() {
  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    latestFirst : "true",
  });
  try {
      const response = await apiClient(
      `/viewingHistory?${queryParams.toString()}`,
      "GET",
    );
    return response;
  } catch (error) {
    console.error("Error fetching viewing history:", error);
    throw error;
  }
}

export async function getLikedVideos() {
  try {
    const userDataString = localStorage.getItem("uib");
    if (!userDataString) {
      throw new Error("User data not found");
    }

    const userData = JSON.parse(userDataString);
    const userId = userData._id;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const queryParams = new URLSearchParams({
      limit: "100",
      skip: "0",
    });

    const response = await apiClient(
      `me/likesHistory/?${queryParams.toString()}`,
      "GET",
    );
    return response;
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    throw error;
  }
}