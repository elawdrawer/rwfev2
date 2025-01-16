import { z } from "zod";

export const reviewFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title must be less than 20 characters")
    .nonempty("Title cannot be empty"),
  category: z
    .string()
    .nonempty("Category cannot be empty"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .nonempty("Description cannot be empty"),
  location: z
    .string()
    .nonempty("Location cannot be empty"),
  thumbnailUrl: z
    .string()
    .nonempty("Cover photo is required")
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;