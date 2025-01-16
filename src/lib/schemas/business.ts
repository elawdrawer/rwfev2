import * as z from "zod";

// Helper function to validate domain extensions
const validateDomainExtension = (url: string) => {
  const commonExtensions = ['.com', '.org', '.net', '.edu', '.gov', '.co', '.in', '.io', '.dev'];
  return commonExtensions.some(ext => url.endsWith(ext));
};

// Helper function to validate website URL without requiring http/https
const websiteUrlSchema = z.string().refine(
  (url) => {
    if (!url) return true; // Optional field
    return validateDomainExtension(url);
  },
  {
    message: "Website URL must end with a valid domain extension (e.g., .com, .org, .net)",
  }
);

// Helper function to prevent continuous spaces
const preventContinuousSpaces = (value: string) => !value.includes("  ");

// Social media URL validation schemas
const socialUrlSchemas = {
  whatsapp: z.string().refine(
    (url) => {
      if (!url) return true; // Optional
      return url.includes("whatsapp.com") || url.includes("wa.me");
    },
    { message: "Invalid WhatsApp URL format" }
  ),
  linkedin: z.string().refine(
    (url) => {
      if (!url) return true;
      return url.includes("linkedin.com/in/") || url.includes("linkedin.com/company/");
    },
    { message: "Invalid LinkedIn URL format" }
  ),
  facebook: z.string().refine(
    (url) => {
      if (!url) return true;
      return url.includes("facebook.com/") || url.includes("fb.com/");
    },
    { message: "Invalid Facebook URL format" }
  ),
  instagram: z.string().refine(
    (url) => {
      if (!url) return true;
      return url.includes("instagram.com/");
    },
    { message: "Invalid Instagram URL format" }
  ),
  twitter: z.string().refine(
    (url) => {
      if (!url) return true;
      return url.includes("twitter.com/") || url.includes("x.com/");
    },
    { message: "Invalid Twitter URL format" }
  ),
};

export const businessFormSchema = z.object({
  businessName: z.string()
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name must not exceed 100 characters")
    .refine(preventContinuousSpaces, "Continuous spaces are not allowed"),
  contactUsDetails: z.object({
    indEmail: z.string().email(),
    indCountryCode: z.string().default("+91"),
    indMobileNum: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  }),
  operationalHours: z.record(z.array(z.object({
    open: z.string(),
    close: z.string(),
  }))),
  handle: z.string()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Handle can only contain letters, numbers, dots, underscores, and hyphens"),
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must not exceed 30 characters")
    .refine(preventContinuousSpaces, "Continuous spaces are not allowed"),
  desc: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .refine(preventContinuousSpaces, "Continuous spaces are not allowed"),
  websiteUrl: websiteUrlSchema.optional(),
  location: z.string().min(1, "Location is required"),
  locationCoordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  socialUrls: z.object(socialUrlSchemas).optional(),
  keywords: z.array(z.string()),
  content: z.record(z.array(z.string())),
});