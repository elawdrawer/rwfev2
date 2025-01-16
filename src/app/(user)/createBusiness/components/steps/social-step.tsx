"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessFormData } from "@/lib/types/business";

interface SocialStepProps {
  form: UseFormReturn<BusinessFormData>;
}

const SOCIAL_PLATFORMS = [
  { name: "whatsapp", label: "WhatsApp" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "facebook", label: "Facebook" },
  { name: "instagram", label: "Instagram" },
  { name: "twitter", label: "Twitter" },
] as const;

export function SocialStep({ form }: SocialStepProps) {
  return (
    <div className="space-y-4">
      {SOCIAL_PLATFORMS.map((platform) => (
        <FormField
          key={platform.name}
          control={form.control}
          name={`socialUrls.${platform.name}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{platform.label}</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Enter your ${platform.label} URL`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}