import { SelectGender } from "@/components/signup/Gender-dropDown";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditPersonalInfoFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProfileDataProps } from "./dataTypes";
import { EditPersonalInfo } from "@/actions/profile";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useRouter } from "next/navigation";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { MdWhatsapp } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { IoLogoInstagram } from "react-icons/io5";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { FaXTwitter } from "react-icons/fa6";
import { Textarea } from "@/components/ui/textarea";
import { fetchHomeCategories } from "@/apis/home";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Props {
  data: {
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
    userName: string;
    location: string;
    interest?: string;
    categoryPref: string[];
  };
  profileData: ProfileDataProps;
  reload: (
    fname: string,
    lname: string,
    desc: string,
    title: string,
    dob: Date,
    gender: string,
    email: string,
    phone: string,
    whatsapp: string,
    linkedin: string,
    instagram: string,
    twitter: string,
    userName: string,
    location: string,
    interest: string,
    categoryPref: string[],
  ) => void;
}

const categoryOptions = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "art", label: "Art" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
];

export default function EditForm({ data, reload, profileData }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const form = useForm<z.infer<typeof EditPersonalInfoFormSchema>>({
    resolver: zodResolver(EditPersonalInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      email: data.email || "",
      lastname: data.lname || "",
      firstname: data.fname || "",
      mobile: data.phone || "",
      dob: data.dob ? new Date(data.dob) : new Date(),
      gender: data.gender || "",
      title: data.title || "",
      desc: data.desc || "",
      userName: data.userName || "",
      location: data.location || "",
      interest: data.interest || "",
      categoryPref: data.categoryPref || [],
    },
  });

  const closeRef = React.useRef<HTMLButtonElement>(null);

  const [categoryOptions, setCategoryOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchHomeCategories();
        if (response.data) {
          setCategoryOptions(
            response.data.map((item: any) => ({
              value: item._id, // Using _id as the value
              label: item.name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = (values: z.infer<typeof EditPersonalInfoFormSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      EditPersonalInfo(values)
        .then((res) => {
          if (res?.error) {
            setError(res?.error);
          }

          if (res?.success) {
            toast.success("Profile updated successfully.");
            setSuccess(res?.success);
            reload(
              values.firstname,
              values.lastname,
              values.desc || "",
              values.title || "",
              new Date(values.dob),
              values.gender,
              values.email,
              values.mobile,
              values.watsapp || "",
              values.linkdin || "",
              values.instagram || "",
              values.twitter || "",
              values.userName,
              values.location,
              values.interest || "",
              values.categoryPref,
            );

            setTimeout(() => {
              closeRef.current?.click();
            }, 500);
          }
        })
        .catch((error: any) => setError(error.message));
    });
  };

  console.log("Form data received:", data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="border border-gray-600 p-4 rounded-lg">
            <div className="mb-6">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="title"
                          type="text"
                          maxLength={50}
                          minLength={3}
                          disabled={pending}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const capitalizedValue =
                              value.charAt(0).toUpperCase() + value.slice(1);
                            field.onChange(capitalizedValue);
                          }}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="description..."
                          type="text"
                          maxLength={500}
                          minLength={20}
                          disabled={pending}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const capitalizedValue =
                              value.charAt(0).toUpperCase() + value.slice(1);
                            field.onChange(capitalizedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* New Fields Section */}
          <div className="border border-gray-600 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="username"
                        type="text"
                        disabled={pending}
                        onBlur={(e) => {
                          const value = e.target.value;
                          field.onChange(value.toLowerCase());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your location"
                        type="text"
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Your interests (separated by commas)"
                      disabled={pending}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryPref"
              render={({ field }) => {
                const currentValues = field.value || [];

                return (
                  <FormItem className="mt-4">
                    <FormLabel>Category Preferences</FormLabel>
                    {loadingCategories ? (
                      <div className="flex flex-wrap gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-9 w-24 rounded-full" />
                        ))}
                      </div>
                    ) : (
                      <>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {categoryOptions.map((option) => (
                              <Button
                                key={option.value}
                                type="button"
                                variant={
                                  currentValues.includes(option.value)
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => {
                                  const newValue = currentValues.includes(
                                    option.value,
                                  )
                                    ? currentValues.filter(
                                        (v) => v !== option.value,
                                      )
                                    : [...currentValues, option.value];
                                  field.onChange(newValue);
                                }}
                                className="rounded-full px-4 py-2 text-sm"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        {/* <FormDescription>
                          Selected IDs: {currentValues.join(", ")}
                        </FormDescription> */}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Social Media Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6 border border-gray-600 p-4
              rounded-lg"
          >
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="watsapp"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-10 w-full">
                    <FormLabel className="col-span-1">
                      <Badge className="flex h-9 w-full md:text-sm mt-2 rounded-l-md rounded-r-none">
                        <MdWhatsapp className="h-7 w-7" />
                      </Badge>
                    </FormLabel>
                    <FormControl className="col-span-9">
                      <Input
                        {...field}
                        placeholder="Enter Valid Watsapp Url"
                        type="text"
                        className="rounded-l-none rounded-r-md"
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage className="col-span-9" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-10 w-full">
                    <FormLabel className="col-span-1">
                      <Badge className="flex h-9 w-full md:text-sm mt-2 rounded-l-md rounded-r-none">
                        <IoLogoInstagram className="h-7 w-7" />
                      </Badge>
                    </FormLabel>
                    <FormControl className="col-span-9">
                      <Input
                        {...field}
                        placeholder="Enter Valid Instagram Url"
                        type="text"
                        disabled={pending}
                        className="rounded-l-none rounded-r-md"
                      />
                    </FormControl>
                    <FormMessage className="col-span-9" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-10 w-full">
                    <FormLabel className="col-span-1">
                      <Badge className="flex h-9 w-full md:text-sm mt-2 rounded-l-md rounded-r-none">
                        <FaXTwitter className="h-7 w-7" />
                      </Badge>
                    </FormLabel>
                    <FormControl className="col-span-9">
                      <Input
                        {...field}
                        placeholder="Enter Valid Twitter Url"
                        type="text"
                        className="rounded-l-none rounded-r-md"
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage className="col-span-9" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="linkdin"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-10 w-full">
                    <FormLabel className="col-span-1">
                      <Badge className="flex h-9 w-full md:text-sm mt-2 rounded-l-md rounded-r-none">
                        <LinkedInLogoIcon className="h-7 w-7" />
                      </Badge>
                    </FormLabel>
                    <FormControl className="col-span-9">
                      <Input
                        {...field}
                        placeholder="Enter Valid Linkdein Url"
                        type="text"
                        className="rounded-l-none rounded-r-md"
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage className="col-span-9" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Personal Info Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6 border border-gray-600 p-4
              rounded-lg"
          >
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Jhon"
                        type="text"
                        maxLength={30}
                        minLength={3}
                        disabled={pending}
                        onBlur={(e) => {
                          const value = e.target.value;
                          const capitalizedValue =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          field.onChange(capitalizedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        type="text"
                        maxLength={30}
                        minLength={3}
                        disabled={pending}
                        onBlur={(e) => {
                          const value = e.target.value;
                          const capitalizedValue =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          field.onChange(capitalizedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@domain.com"
                        type="email"
                        disabled
                        onBlur={(e) => {
                          const value = e.target.value;
                          const lowerCase = value.toLocaleLowerCase();
                          field.onChange(lowerCase);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234567890"
                        type="text"
                        maxLength={10}
                        disabled
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <SelectGender
                        {...field}
                        error={form.formState.errors.mobile?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={pending}
                        value={
                          field.value instanceof Date &&
                          !isNaN(field.value.getTime())
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const dateValue = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          field.onChange(dateValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <div className="flex flex-row justify-center gap-12 w-full">
          <DialogFooter className="w-full">
            <DialogClose ref={closeRef} className="hidden" />
            <Button className="w-full" type="submit">
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
}
