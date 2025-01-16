export interface BusinessFormData {
  businessName: string;
  contactUsDetails: {
    indEmail: string;
    indCountryCode: string;
    indMobileNum: string;
  };
  operationalHours: {
    [key: string]: Array<{ open: string; close: string }>;
  };
  handle: string;
  title: string;
  desc: string;
  websiteUrl: string;
  location: string;
  locationCoordinates: {
    latitude: number;
    longitude: number;
  };
  socialUrls: {
    whatsapp: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  keywords: string[];
  content: Record<string, string[]>;
}

export type FormStep = 
  | "business"
  | "contact"
  | "hours"
  | "location"
  | "social"
  | "content";