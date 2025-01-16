import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "./LocationInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewFormSchema, type ReviewFormData } from "../validation/review";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface ReviewDetailsProps {
  title: string;
  category: string;
  description: string;
  location: string;
  thumbnailUrl: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onThumbnailUpload: (url: string, file: File) => void;
  onNext: () => void;
}

export function ReviewDetails({
  title,
  category,
  description,
  location,
  thumbnailUrl,
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
  onLocationChange,
  onThumbnailUpload,
  onNext,
}: ReviewDetailsProps) {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title,
      category,
      description,
      location,
      thumbnailUrl,
    },
    mode: "onChange",
  });

  const { formState: { isValid, errors } } = form;

  const handleThumbnailUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      onThumbnailUpload(url, file);
      form.setValue("thumbnailUrl", url);
      form.trigger("thumbnailUrl");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: ReviewFormData) => {
    onTitleChange(data.title);
    onCategoryChange(data.category);
    onDescriptionChange(data.description);
    onLocationChange(data.location);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="title">Video Title</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter a title for your review"
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("title");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <Label>Category</Label>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger("category");
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="place">Places</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe your experience"
                  className="min-h-[100px]"
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("description");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <Label>Cover Photo</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleThumbnailUpload(file);
                  };
                  input.click();
                }}
              >
                {field.value ? (
                  <div className="aspect-video relative">
                    <img
                      src={field.value}
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload a cover photo
                    </p>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <LocationInput 
                value={field.value} 
                onChange={(value) => {
                  field.onChange(value);
                  form.trigger("location");
                }} 
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={!isValid}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}