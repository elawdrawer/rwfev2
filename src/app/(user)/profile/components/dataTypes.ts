export interface ProfileDataProps {
    _id: string;
    indFirstName: string;
    indLastName: string;
    businessName: string;
    userName: string;
    desc: string;
    indDob: string;
    interest: string;
    socialUrls: SocialUrls;
    isMobileVerified: boolean;
    isEmailVerified: boolean;
    isBusinessUser: boolean;
    indEmailNotify: boolean;
    indMobileNotify: boolean;
    isAccountVerified: boolean;
    isPrivateAccount: boolean;
    avgRating: number;
    totalRating: number;
    indGender: string;
    indPic: IndPic;
    indLanPref: string;
    indContentPref: string;
    totalUnpublishedPosts: number;
    totalPublishedPosts: number;
    totalFollowers: number;
    totalFollowing: number;
    indCategories: string[];
    profileImages: string[];
    title: string;
    isFollow?: boolean;
    status?: string;
    websiteUrl?: string;
    indEmail?:string;
    indMobileNum?:string;
     fname: string;
  lname: string;
  location: string;
  categoryPref: string[];
  }


  export interface SocialUrls {
    whatsapp: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  }
  
  export  interface IndPic {
    original: string;
    thumbnail: string;
  }
  
export interface VideoData {
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
  categoryId: string;
  categoryName: string;
}


export interface FollowerList{
  
    "_id": string,
    "userId": string,
    "firstName": string,
    "lastName":string,
    "userName": string,
    "profilePic": {
      "original":string,
      "thumbnail": string
    },
    "isAccountVerified": boolean,
    "isPrivateAccount": boolean,
    "isFollowed": boolean
  
}