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
  console.log("response::::::::::;", response);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

// export async function fetchProfilePosts(id: string,count:number) {
//   console.log("fetchProfilePosts==>",id,count,`/uploadedVideos?limit=10&skip=${count}&flag=1&userId=672b4a14f7f2f5ada4ee34eb`)
//   const response = await apiClient(`/uploadedVideos?limit=10&skip=${count}&flag=1&userId=672b4a14f7f2f5ada4ee34eb`, "GET");
//   console.log("fetchProfilePosts::",response)
//   if (response.success && response.data) {
//     return response.data.data;
//   } else {
//     console.error("Failed to fetch fetchProfilePosts data:", response.error);
//     return null;
//   }
// }

export async function fetchProfilePosts(id: string, count?: number) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: JSON.stringify(count),
    flag: "1",
    userId: id,
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

export async function fetchTaggedVideos(id: string, count: number) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: JSON.stringify(count),
    // flag: "1",
    userId: id,
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

export const followUser = async (id: string) => {
  console.log(":::::::::::::::::::", id);
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
  console.log("::::::::::::::::", id, count);
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
  console.log("getFollowersLIst", response);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
};

export const uploadProfileImage = async ( formdata:FormData) => {

  const response = await apiClient(`/uploadProfileImage`, "PUT",formdata);
  console.log("uploadProfileImage", response);
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
  title: string | undefined;
  desc: string | undefined;
  watsapp: string | undefined;
  instagram: string | undefined;
  twitter: string | undefined;
  // facebook: string | undefined;
  linkdin: string | undefined;
}) => {
  console.log("profile data::::::::", value.dob);
  const response = await apiClient(`/profile`, "PUT", {
    indFirstName: value.firstname,
    indLastName: value.lastname,
    title: value.title,
    desc: value.desc,
    indDob: new Date(value.dob)
      .toISOString()
      .split("T")[0]
      .replace(/^"|"$/g, ""),
    indGender: value.gender,
    // contactUsDetails: {
    //   indEmail: value.email,
    //   indCountryCode: "91",
    //   indMobileNum: value.mobile,
    // },
    socialUrls: {
      whatsapp: value.watsapp,
      linkedin: value.linkdin,
      facebook: "",
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
  console.log("::::::::::::::::", id, count);
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

  const response = await apiClient(`/followingList?${queryParams}`, "GET");
  console.log("followingList", response);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch followingList data:", response.error);
    return null;
  }
};

export const postShareUrl = async (url: string) => {
  const path = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  console.log("path::::=>", path);
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
