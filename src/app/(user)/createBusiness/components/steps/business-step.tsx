"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessFormData } from "@/lib/types/business";

interface BusinessStepProps {
  form: UseFormReturn<BusinessFormData>;
}

export function BusinessStep({ form }: BusinessStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name*</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your business name"
                maxLength={100}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, " ");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="handle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Handle*</FormLabel>
            <FormControl>
              <Input
                placeholder="your-business-handle"
                maxLength={30}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9._-]/g, "");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title*</FormLabel>
            <FormControl>
              <Input
                placeholder="Business title"
                maxLength={30}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, " ");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="desc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description*</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your business (minimum 20 characters)"
                className="resize-none"
                maxLength={1000}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, ' ');
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input placeholder="your-website.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
