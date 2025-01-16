export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  date: string;
}

export interface BrandInfo {
  name: string;
  logo: string;
  banner: string;
  Id: string;
  isFollow: boolean;
  // isVerified: boolean;
  rating: number;
  businessPageOwner: string[]
  // rank: number;
}

export interface BusinessHours {
  open: string;
  close: string;
  _id: string;
}

export interface OperationalHours {
  monday: BusinessHours[];
  tuesday: BusinessHours[];
  wednesday: BusinessHours[];
  thursday: BusinessHours[];
  friday: BusinessHours[];
  saturday: BusinessHours[];
  sunday: BusinessHours[];
}

export interface ContactUsDetails {
  indCountryCode: string;
  indMobileNum: string;
  indEmail: string;
}

export interface Image {
  original: string;
  thumbnail: string;
  _id: string;
}

export interface Business {
  _id: string;
  custId: string;
  businessName: string;
  contactUsDetails: ContactUsDetails;
  operationalHours: OperationalHours;
  handle: string;
  title: string;
  desc: string;
  websiteURLs: string;
  location: string;
  locationCoordinates: {
    type: string;
    coordinates: number[];
  };
  socialUrls: {
    whatsapp: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  status: string;
  avgRating: number;
  totalRating: number;
  defaultBusinessBanner: Image;
  defaultBusinessImage: Image;
  businessBanners: Image[];
  businessImages: Image[];
}
