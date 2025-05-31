import { Hash, Upload, Users, X, Building2 } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { VideoThumbnailGenerator } from "./VideoThumbnailGenerator";

import { fetchTagSuggestions, fetchBusinessTagSuggestions } from "@/apis/post";

interface Tag {
  id: string;
  handle: string;
  businessName?: string;
}

interface TagResponse {
  id: string;
  handle: string;
  businessName?: string;
}

interface ApiResponse {
  message: string;
  data: {
    count: number;
    data: TagResponse[];
  };
}

interface ReviewDetailsProps {
  title: string;
  category: string;
  description: string;
  location: string;
  thumbnailUrl: string;
  videoUrl: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onThumbnailUpload: (url: string, file: File) => void;
  onHashtagsChange: (hashtags: string[]) => void;
  onTagsChange: (tags: Tag[]) => void;
  onNext: () => void;
  setStep: (step: any) => void;
  isEdit?: boolean;
}

export function ReviewDetails({
  title,
  category,
  description,
  location,
  thumbnailUrl,
  videoUrl,
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
  onLocationChange,
  onThumbnailUpload,
  onHashtagsChange,
  onTagsChange,
  onNext,
  setStep,
  isEdit = false,
}: ReviewDetailsProps) {
  const [hashtagInput, setHashtagInput] = useState("");
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const [tagSearchValue, setTagSearchValue] = useState("");
  const [tagSearchResults, setTagSearchResults] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "businesses">("users");
  const [businessSearchValue, setBusinessSearchValue] = useState("");
  const [businessSearchResults, setBusinessSearchResults] = useState<Tag[]>([]);
  const [isBusinessSearching, setIsBusinessSearching] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title,
      category,
      description,
      location,
      thumbnailUrl: isEdit ? undefined : thumbnailUrl,
      hashtags: [],
      tags: [],
    },
    mode: "onChange",
  });

  const {
    formState: { isValid, errors },
  } = form;

  const isHLSStream = (url: string) => {
    return url.includes(".m3u8") || url.endsWith(".mls");
  };

  useEffect(() => {
    const searchTags = async () => {
      if (!tagSearchValue || tagSearchValue.length < 3) {
        setTagSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetchTagSuggestions(tagSearchValue);
        console.log("Raw API Response:", response);

        // Check if response exists and has the expected structure
        if (response?.data?.data) {
          const suggestions = response.data.data.map((item: TagResponse) => ({
            id: item.id,
            handle: item.handle,
            businessName: item.handle,
          }));
          console.log("Final suggestions array:", suggestions);
          setTagSearchResults(suggestions);
        } else {
          setTagSearchResults([]);
        }
      } catch (error) {
        console.error("Failed to search tags:", error);
        setTagSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(searchTags, 300);
    return () => clearTimeout(debounceTimeout);
  }, [tagSearchValue]);

  useEffect(() => {
    const searchBusinesses = async () => {
      if (!businessSearchValue || businessSearchValue.length < 3) {
        setBusinessSearchResults([]);
        return;
      }

      setIsBusinessSearching(true);
      try {
        const response = await fetchBusinessTagSuggestions(businessSearchValue);
        if (response?.data?.data) {
          const suggestions = response.data.data.map((item: TagResponse) => ({
            id: item.id,
            handle: item.handle,
            businessName: item.businessName || item.handle,
          }));
          setBusinessSearchResults(suggestions);
        } else {
          setBusinessSearchResults([]);
        }
      } catch (error) {
        console.error("Failed to search businesses:", error);
        setBusinessSearchResults([]);
      } finally {
        setIsBusinessSearching(false);
      }
    };

    const debounceTimeout = setTimeout(searchBusinesses, 300);
    return () => clearTimeout(debounceTimeout);
  }, [businessSearchValue]);

  const handleBusinessSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.key === "Enter" &&
      businessSearchValue &&
      businessSearchValue.length >= 3
    ) {
      e.preventDefault();
      // If no results or still searching, add the raw input as a tag
      if (businessSearchResults.length === 0 || isBusinessSearching) {
        handleTagSelect(businessSearchValue);
      }
    }
  };

  const handleTagSelect = (tag: Tag | string) => {
    // If we get a string (from no results case), create a new tag object
    const newTag =
      typeof tag === "string"
        ? { id: tag, handle: tag, businessName: tag }
        : tag;

    if (!selectedTags.find((t) => t.handle === newTag.handle)) {
      const newTags = [...selectedTags, newTag];
      setSelectedTags(newTags);
      form.setValue(
        "tags",
        newTags.map((t) => t.handle),
      );
      // onTagsChange(newTags.map((t) => t.handle));
      onTagsChange(newTags);
    }

    setTagSearchOpen(false);
    setTagSearchValue("");
    setBusinessSearchValue("");
  };

  const removeTag = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId);
    setSelectedTags(newTags);
    form.setValue(
      "tags",
      newTags.map((t) => t.handle),
    );
    onTagsChange(newTags);
    // onTagsChange(newTags.map((t) => t.handle));
  };

  const handleThumbnailUpload = (file: File | Blob) => {
    let url: string;

    if (file instanceof File) {
      url = URL.createObjectURL(file);
      onThumbnailUpload(url, file);
    } else {
      url = URL.createObjectURL(file);
      onThumbnailUpload(url, file as unknown as File); // Cast Blob to File for compatibility
    }

    form.setValue("thumbnailUrl", url);
    form.trigger("thumbnailUrl");
  };

  const isFile = (file: File | Blob): file is File => {
    return (file as File).lastModified !== undefined;
  };

  const handleRemoveThumbnail = () => {
    const dummyFile = new Blob([]);
    onThumbnailUpload(
      "",
      isFile(dummyFile)
        ? dummyFile
        : new File([], "", { type: "application/octet-binary" }),
    );
    form.setValue("thumbnailUrl", "");
    form.trigger("thumbnailUrl");
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const hashtag = e.currentTarget.value.trim().replace(/^#/, "");

      if (hashtag && !form.getValues("hashtags").includes(hashtag)) {
        const currentHashtags = form.getValues("hashtags");
        const newHashtags = [...currentHashtags, hashtag];
        form.setValue("hashtags", newHashtags);
        onHashtagsChange(newHashtags);
        setHashtagInput("");
      }
    }
  };

  const removeHashtag = (hashtagToRemove: string) => {
    const currentHashtags = form.getValues("hashtags");
    const newHashtags = currentHashtags.filter(
      (tag) => tag !== hashtagToRemove,
    );
    form.setValue("hashtags", newHashtags);
    onHashtagsChange(newHashtags);
  };

  const onSubmit = (data: ReviewFormData) => {
    onTitleChange(data.title);
    onCategoryChange(data.category);
    onDescriptionChange(data.description);
    onLocationChange(data.location);
    onNext();
  };

  console.log("checking location", location);

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

        {!isEdit && (
          <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <VideoThumbnailGenerator
                  videoUrl={videoUrl}
                  selectedThumbnail={field.value}
                  onThumbnailSelect={(url, blob) => {
                    handleThumbnailUpload(blob);
                  }}
                />
                <div
                  className="mt-4 border-2 border-dashed rounded-lg p-4 hover:bg-secondary/50
                    transition-colors cursor-pointer"
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
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white
                          transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveThumbnail();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload a custom cover photo
                      </p>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="hashtags"
          render={({ field }) => (
            <FormItem>
              <Label>Hashtags</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {field.value.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeHashtag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={handleHashtagKeyDown}
                    placeholder="Type a hashtag and press Enter"
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Press Enter or comma to add a hashtag
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <Label>Tag Users or Businesses</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-sm"
                    >
                      <span>@{tag.handle}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex border-b mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "users"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    Users
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("businesses")}
                    className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "businesses"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    Businesses
                  </button>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2">
                    {activeTab === "users" ? (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      value={
                        activeTab === "users"
                          ? tagSearchValue
                          : businessSearchValue
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (activeTab === "users") {
                          setTagSearchValue(value);
                          if (!value || value.length < 3) {
                            setTagSearchResults([]);
                            setIsSearching(false);
                          }
                        } else {
                          setBusinessSearchValue(value);
                          if (!value || value.length < 3) {
                            setBusinessSearchResults([]);
                            setIsBusinessSearching(false);
                          }
                        }
                      }}
                      onKeyDown={
                        activeTab === "businesses"
                          ? handleBusinessSearchKeyDown
                          : undefined
                      }
                      placeholder={`Search ${activeTab} to tag (minimum 3 characters)`}
                      className="flex-1"
                    />
                  </div>

                  {activeTab === "businesses" &&
                    (isBusinessSearching ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : businessSearchResults.length > 0 ? (
                      <div className="max-h-[200px] overflow-y-auto">
                        {businessSearchResults.map((tag) => (
                          <button
                            key={tag.id}
                            className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
                            onClick={() => {
                              handleTagSelect(tag);
                              setBusinessSearchValue("");
                              setBusinessSearchResults([]);
                            }}
                          >
                            <Building2 className="h-4 w-4" />
                            <span>@{tag.handle}</span>
                          </button>
                        ))}
                      </div>
                    ) : businessSearchValue.length >= 3 ? (
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
                        onClick={() => {
                          handleTagSelect(businessSearchValue);
                          setBusinessSearchValue("");
                        }}
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Add "@{businessSearchValue}" as tag</span>
                      </button>
                    ) : null)}

                  {(activeTab === "users"
                    ? tagSearchValue
                    : businessSearchValue) &&
                    (activeTab === "users"
                      ? tagSearchValue
                      : businessSearchValue
                    ).length > 0 &&
                    (activeTab === "users"
                      ? tagSearchValue
                      : businessSearchValue
                    ).length < 3 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Please enter at least 3 characters to search
                      </p>
                    )}

                  {(activeTab === "users"
                    ? tagSearchValue
                    : businessSearchValue) &&
                    (activeTab === "users"
                      ? tagSearchValue
                      : businessSearchValue
                    ).length >= 3 && (
                      <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50">
                        {activeTab === "users" ? (
                          isSearching ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              Searching...
                            </div>
                          ) : tagSearchResults.length > 0 ? (
                            <div className="max-h-[200px] overflow-y-auto">
                              {tagSearchResults.map((tag) => (
                                <button
                                  key={tag.id}
                                  className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
                                  onClick={() => {
                                    handleTagSelect(tag);
                                    setTagSearchValue("");
                                    setTagSearchResults([]);
                                  }}
                                >
                                  <Users className="h-4 w-4" />
                                  <span>@{tag.handle}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No results found
                            </div>
                          )
                        ) : isBusinessSearching ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Searching...
                          </div>
                        ) : businessSearchResults.length > 0 ? (
                          <div className="max-h-[200px] overflow-y-auto">
                            {businessSearchResults.map((tag) => (
                              <button
                                key={tag.id}
                                className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
                                onClick={() => {
                                  handleTagSelect(tag);
                                  setBusinessSearchValue("");
                                  setBusinessSearchResults([]);
                                }}
                              >
                                <Building2 className="h-4 w-4" />
                                <span>@{tag.handle}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Search and select {activeTab} to tag in your review
                </p>
              </div>
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
          {" "}
          {!isEdit && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button type="submit" disabled={!isValid}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
