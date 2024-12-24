import { apiClient } from "../lib/apiClient";

export interface Comment {
  id: string;
  text: string;
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
  timeAgo: string;
  replies?: Comment[];
}

// watch

export async function fetchVideoDetails(videoId: any) {
  const response = await apiClient(`/watchVideo/${videoId}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

// Like a video
export async function likeVideo(videoId: string) {
  try {
    const response = await apiClient(`/video/like/${videoId}`, "PUT");

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error in Like video", error);
    return null;
  }
}

//Unlike a video

export async function unLikeVideo(videoId: string) {
  try {
    const response = await apiClient(`/video/unlike/${videoId}`, "PUT");

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error in Like video", error);
    return null;
  }
}

// Get video comments
export async function getVideoComments(iD: string) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: "0",
    lastCommentId: "null",
  }).toString();
  const response = await apiClient(`/video/comment/${iD}?${queryParams}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

// // Like a comment
export const likeComment = async (commentId: string) => {
  try {
    const response = await apiClient(`comment/like/${commentId}`,'PUT');
    return response.data;
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

// Unlike a comment
export const unlikeComment = async (commentId: string) => {
  try {
    const response = await apiClient(`comment/unlike/${commentId}`,'PUT');
    return response.data;
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
};

// // Add or edit a comment

export const addNewComment = async (videoId:string , payload: Record<string, any>) => {
  try {
    const response = await apiClient(`/commentOnVideo/${videoId}`,'POST', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// delete comment 


export async function deleteComment(videoId: string, commentId: string) {
  try {
    const response = await apiClient(`/comment/${videoId}/${commentId}`, "DELETE");

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error in Like video", error);
    return null;
  }
}



// // Reply to a comment
// export const replyToComment = async (commentId: string, text: string) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/v2/comment/${commentId}/comment`, { text });
//     return response.data;
//   } catch (error) {
//     console.error('Error replying to comment:', error);
//     throw error;
//   }
// };