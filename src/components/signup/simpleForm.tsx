"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newSignupRwSchema,
  newSignupSchema,
  PersonalInfoFormSchema,
} from "@/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import Link from "next/link";
import { PersonalInfo, simpleForm } from "../../actions/signup";
import { json } from "node:stream/consumers";
import { SelectGender } from "./Gender-dropDown";
import { Checkbox } from "@radix-ui/react-checkbox";
import { LocationInput } from "./locationFiled";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { cn } from "@/lib/utils";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EyeClosed } from "lucide-react";
import {
  checkUserNameAvailability,
  signup,
  verifyOTPEmail,
  verifyOTPMobile,
} from "@/apis/signUp";
import { FcCancel } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

export default function SimpleForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<string | undefined>();
  const [error_1, setError_1] = useState<string | undefined>();
  const [success_1, setSuccess_1] = useState<string | undefined>();
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [showPassword_1, setShowpassword_1] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const [otpMobile, setOtpMobile] = useState<string>("");
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const fingerPrints = getDeviceFingerprint();
  const isLocalStorageAvailable = localStorage;
  // Safely access location data from localStorage
  const latitude = isLocalStorageAvailable
    ? (localStorage.getItem("loc-lat") ?? "90")
    : "90";
  const longitude = isLocalStorageAvailable
    ? (localStorage.getItem("loc-lng") ?? "90")
    : "90";

  const form = useForm<z.infer<typeof newSignupRwSchema>>({
    resolver: zodResolver(newSignupRwSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      lastname: "",
      firstname: "",
      userName: "",
      password: "",
      mobile: "",
      TnC: false,
      TnC2: false,
    },
  });

  const onSubmit = (values: z.infer<typeof newSignupRwSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      simpleForm(values, fingerPrints, latitude, longitude)
        .then((res) => {
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            setShowOtp(true);
            setSuccess(res?.success);
          }
        })
        .catch((error) => setError(error.message));
    });
  };

  const registerUser = async (values: z.infer<typeof newSignupRwSchema>) => {
    const data = await newSignupRwSchema.parseAsync(values);
    // const data = validatedFields.data;
    let val = {
      firstName: data?.firstname || "",
      lastName: data?.lastname || "",
      email: data?.email || "",
      mobile: data?.mobile || "",
      userName: data?.userName || "",
      password: data?.password || "",
      fingerPrints: fingerPrints || "",
    };
    //validate otp here
    const validateOtp = await verifyOTPEmail(
      otp,
      val.email,
      fingerPrints,
      latitude,
      longitude,
    );

    const validateOtpMobile = await verifyOTPMobile(
      "91",
      val.mobile,
      otpMobile,
      fingerPrints,
      latitude,
      longitude,
    );

    if (validateOtp.status && validateOtpMobile.status) {
      const register = await signup(val, latitude, longitude);
      if (register.status) {
        setError_1("");
        setSuccess_1(register.message);
        router.push("/login");
      } else {
        setSuccess_1("");
        setError_1(register.message);
      }
    } else {
      validateOtp.status?"":setError_1("Email : "+validateOtp.message)
     validateOtpMobile.status?"": setError_1("Phone Number : "+ validateOtpMobile.message);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 sm:space-y-4">
            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="max-sm:text-xs">
                      First Name<span className="text-red-600"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="max-sm:text-xs max-sm:p-2 max-sm:h-7"
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

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="max-sm:text-xs">
                      Last Name<span className="text-red-600"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        className="max-sm:text-xs max-sm:p-2 max-sm:h-7"
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
            {/* <div className="flex" > */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-sm:text-xs">
                    Email<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@domain.com"
                      className="max-sm:text-xs max-sm:p-2 max-sm:h-7"
                      type="email"
                      disabled={pending}
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

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-sm:text-xs">
                    Phone Number<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-sm:text-xs max-sm:p-2 max-sm:h-7"
                      placeholder="1234567890"
                      type="text"
                      maxLength={10}
                      disabled={pending}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
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

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-sm:text-xs">
                    User Name<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="user name"
                      className="max-sm:text-xs max-sm:p-2 max-sm:h-7"
                      disabled={pending}
                      minLength={3}
                      maxLength={30}
                      onChange={async (e) => {
                        field.onChange(e.target.value);
                        await checkUserNameAvailability(
                          e.target.value,
                          latitude,
                          longitude,
                        )
                          .then((res) => {
                            //  setMessage(res?.message)
                          })
                          .catch((err) => {
                            setMessage(err.message);
                          });
                      }}
                    />
                  </FormControl>
                  <FormMessage>{message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-sm:text-xs">
                    Password<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        disabled={pending}
                      /> */}

                    <div
                      className="flex border shadow-sm 
                      focus:ring-1 max-sm:text-xs max-sm:p-2 
                      max-sm:h-7 justify-center items-center
                        active:ring-1 selection:ring-1 rounded-sm"
                    >
                      <Input
                        {...field}
                        placeholder="********"
                        type={showPassword_1 ? "text" : "password"}
                        disabled={pending}
                        className={cn(
                          ` focus:border-none focus-visible:outline-none max-sm:text-xs max-sm:p-2
                          max-sm:h-7 focus-visible:ring-0`,
                          "border-none",
                        )}
                        maxLength={12}
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant={"ghost"}
                        className="hover:bg-transparent focus:ring-0"
                        disabled={field.value.length === 0}
                        onClick={() => setShowpassword_1(!showPassword_1)}
                      >
                        {showPassword_1 ? <EyeOpenIcon /> : <EyeClosed />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm">
              <FormField
                control={form.control}
                name="TnC"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Input
                        // {...field}
                        type="checkbox"
                        disabled={pending}
                        // Bind the checkbox state
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="border-2 h-4 w-4 checked:bg-black"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      {/* <FormLabel>
                            </FormLabel> */}
                      <FormDescription className="text-xs">
                        I have read and agree to accept and abide by the{" "}
                        <Link
                          href="/"
                          className="text-blue-500 underline font-medium"
                        >
                          Community Guidelines
                        </Link>
                        ,{" "}
                        <Link
                          href="/"
                          className="text-blue-500 underline font-medium"
                        >
                          Term & Conditions,
                        </Link>{" "}
                        <Link
                          href="/"
                          className="text-blue-500 underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TnC2"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Input
                        // {...field}
                        type="checkbox"
                        disabled={pending}
                        // Bind the checkbox state
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="border-2 h-4 w-4 checked:bg-black"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      {/* <FormLabel></FormLabel> */}
                      <FormDescription className="text-xs">
                        I authorise and allow Rewardwale and its associates,
                        partners, participating merchants and brands to contact
                        me on Email, SMS, WhatsApp and Push Notifications
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {(error || urlError) && <FormError message={error || urlError} />}
          {success && <FormSuccess message={success} />}
          <div className="flex flex-row justify-center gap-12 w-full">
            <Button className="w-full" type="submit">
              Next
            </Button>
            <AlertDialog open={showOtp} onOpenChange={setShowOtp}>
              <AlertDialogContent className="w-[300px] rounded-xl sm:w-full">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex justify-between">
                    OTP Verification
                    <AlertDialogCancel
                      className="rounded-full w-8 h-8"
                      onClick={() => {
                        setOtp("");
                        setOtpMobile("");
                        setError_1("");
                        setSuccess_1("");
                      }}
                    >
                      <IoClose />
                    </AlertDialogCancel>
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="text-xs sm:text-sm">
                  Kindly enter the OTP sent to your Email and Phone number for
                  verification.
                </AlertDialogDescription>
                <div className="flex flex-col items-start gap-3 w-full">
                  <p className="text-sm font-medium">
                    Please enter your Email OTP
                  </p>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={otp}
                    onChange={(e) => setOtp(e)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <p className="text-sm font-medium">
                    Please enter your Phone number OTP
                  </p>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={otpMobile}
                    onChange={(e) => setOtpMobile(e)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  {(error_1 || urlError) && (
                    <FormError message={error_1 || urlError} />
                  )}
                  {success_1 && <FormSuccess message={success_1} />}
                </div>

                <AlertDialogFooter>
                  {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                  <AlertDialogAction
                    className="w-full"
                    type={"button"}
                    onClick={form.handleSubmit(registerUser)}
                  >
                    Register
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
      {/* <Button
          variant={"link"}
          className="w-full hover:text-blue-500 font-bold"
          size="sm"
          asChild
        >
          <Link href={"/login"}>Already have an account ? </Link>
        </Button> */}
      {/* </CardWrapper> */}
    </div>
  );
}