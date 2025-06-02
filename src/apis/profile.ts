import { ProfileDataProps } from "@/app/(user)/profile/components/dataTypes";
import { apiClient } from "@/lib/apiClient";

export async function fetchProfileData() {
  const response = await apiClient("/profile", "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function othersProfileData(userName: string) {
  const response = await apiClient(`/viewProfileByUsername/${userName}`, "GET");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function fetchProfilePosts(id: string, count?: number, flag?: any) {
  const queryParams = new URLSearchParams({
    limit: "100",
    skip: JSON.stringify(count),
    flag: flag,
    userId: id,
  }).toString();
  const response = await apiClient(`/userPosts?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchProfilePosts data:", response.error);
    return null;
  }
}

export async function fetchTaggedVideos(id: string, count: number) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: JSON.stringify(count),
    // flag: "1",
    userId: id,
  }).toString();
  const response = await apiClient(`/userTaggedPosts?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data.data;
  } else {
    console.error("Failed to fetch fetchTaggedVideos data:", response.error);
    return null;
  }
}

export const followUser = async (id: string) => {
  const response = await apiClient(`/user/follow/${id}`, "PUT");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};

export const unFollowUser = async (id: string) => {
  const response = await apiClient(`/user/unfollow/${id}`, "PUT");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};

export const getfollowerList = async (id: string, count: number) => {
  let queryParams;
  if (id.length === 0) {
    queryParams = new URLSearchParams({
      limit: "10",
      skip: JSON.stringify(count),
      // userId: id,
    }).toString();
  } else {
    queryParams = new URLSearchParams({
      limit: "10",
      skip: JSON.stringify(count),
      userId: id,
    }).toString();
  }

  const response = await apiClient(`/followerList?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};

export const uploadProfileImage = async (formdata: FormData) => {
  const response = await apiClient(`/uploadProfileImage`, "PUT", formdata);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};

export const updateUserProfile = async (value: {
  email: string;
  lastname: string;
  firstname: string;
  mobile: string;
  dob: Date;
  gender: string;
  userName: string;
  location: string;
  interest?: string;
  categoryPref: string[];
  title?: string;
  desc?: string;
  watsapp?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkdin?: string;
}) => {
  const response = await apiClient(`/profile`, "PUT", {
    indFirstName: value.firstname,
    indLastName: value.lastname,
    userName: value.userName,
    location: value.location,
    interest: value.interest,
    categoryPref: value.categoryPref,
    title: value.title,
    desc: value.desc,
    indDob: new Date(value.dob)
      .toISOString()
      .split("T")[0]
      .replace(/^"|"$/g, ""),
    indGender: value.gender,
    socialUrls: {
      whatsapp: value.watsapp,
      linkedin: value.linkdin,
      facebook: value.facebook, // Updated from empty string to use the value
      instagram: value.instagram,
      twitter: value.twitter,
    },
  });

  if (response.status === 200) {
    return { status: true, message: response.data.message };
  } else {
    return { status: false, message: response.error };
  }
};
export const getfollowingList = async (id: string, count: number) => {
  let queryParams;
  if (id.length === 0) {
    queryParams = new URLSearchParams({
      limit: "100",
      skip: JSON.stringify(count),
      // userId: id,
    }).toString();
  } else {
    queryParams = new URLSearchParams({
      limit: "100",
      skip: JSON.stringify(count),
      userId: id,
    }).toString();
  }

  const response = await apiClient(`/followingList?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch followingList data:", response.error);
    return null;
  }
};

export const postShareUrl = async (url: string) => {
  const path = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  const response = await apiClient(`/shorten`, "POST", { originalUrl: path });

  if (response.success && response.data) {
    return response.data;
    // return {
    //   data: {
    //     shortUrl: "https://rewl.in/CLTc5",
    //     expirationDate: "2025-01-24T07:12:40.612Z",
    //   },
    // }
    // };
  } else {
    console.error("Failed to fetch postShareUrl data:", response.error);
    return null;
  }
};

export const getShareUrl = async (shortCode: string) => {
  const response = await apiClient(`${shortCode}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch postShareUrl data:", response.error);
    return null;
  }
};

export const deletePost = async (id: string) => {
  const response = await apiClient(`/video/${id}`, "DELETE");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};
