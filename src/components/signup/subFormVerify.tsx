"use client";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTPFormSchema } from "@/schema";
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
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Verification } from "@/actions/signup";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { CountdownTimerIcon, MobileIcon } from "@radix-ui/react-icons";
import { resendOTPEmail, resendOTPMobile } from "@/apis/signUp";

interface Props {
  stateChange: (one: boolean, two: boolean, three: boolean) => void;
  email: string;
  mobile: string;
}
export default function CredentialVerificationForm({
  stateChange,
  email,
  mobile,
}: Props) {
  const fingerPrints = getDeviceFingerprint();
  const isLocalStorageAvailable = localStorage;
  // Safely access location data from localStorage
  const latitude = isLocalStorageAvailable
    ? (localStorage.getItem("loc-lat") ?? "90")
    : "90";
  const longitude = isLocalStorageAvailable
    ? (localStorage.getItem("loc-lng") ?? "90")
    : "90";

  const [pending, startTransition] = useTransition();
  const [otpSentEmail, setOtpSentEmail] = useState<boolean>(false);
  const [timerEmail, setTimerEmail] = useState<number>(30);
  const [countTimeEmail, setCountTimeEmail] = useState<boolean>(true);

  const [otpSentMobile, setOtpSentMobile] = useState<boolean>(false);
  const [timerMobile, setTimerMobile] = useState<number>(30);
  const [countTimeMobile, setCountTimeMobile] = useState<boolean>(true);

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [active, setActive] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    mode: "onChange",
    defaultValues: {
      verifyEmail: "",
      verifyMobileNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof OTPFormSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      Verification(
        values,
        "91",
        mobile,
        email,
        fingerPrints,
        latitude,
        longitude,
      )
        .then((res) => {
          //console.log("===res===", res);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // OTPVerificationForm.reset();

            setSuccess(res?.success);

            //start transition will tell when the validation has ended till then the feilds will be disabled
            stateChange(false, false, true);
          }
        })
        .catch((error) => setError(error.message));
    });
  };

  const sendOTPMobile = async () => {
    try {
      // Simulate an API call to send OTP
      console.log("Sending OTP...Mobile");
      setOtpSentMobile(true);
      setCountTimeMobile(true);

      await resendOTPMobile("91", mobile, fingerPrints, latitude, longitude).then(
        (res) => {
          res.status ? setSuccess(res.message) : setError(res.message);
        },
      ).catch((err)=>console.log("error::1:",err));
      // Reset the timer for resend cooldown
      setTimerMobile(30);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  const sendOTPEmail = async () => {
    try {
      // Simulate an API call to send OTP
      console.log("Sending OTP...Email");
      setOtpSentEmail(true);
      setCountTimeEmail(true);

      await resendOTPEmail(email, fingerPrints, latitude, longitude).then(
        (res) => {
          res.status ? setSuccess(res.message) : setError(res.message);
        },
      ).catch((err)=>console.log("error:2::",err));
      // Reset the timer for resend cooldown
      setTimerEmail(30);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  useEffect(() => {
    let countdown: any;
    if (countTimeMobile) {
      countdown = setInterval(() => {
        setTimerMobile((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCountTimeMobile(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [countTimeMobile]);

  useEffect(() => {
    let countdown: any;
    if (countTimeEmail) {
      countdown = setInterval(() => {
        setTimerEmail((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCountTimeEmail(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [countTimeEmail]);

  return (
    <div>
      {/* <CardWrapper
        headerLabel="welcome back!"
        backButtonHref="/signup"
        backButtonLabel="Dont have an account?"
        showSocial
      > */}{" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
              <FormField
                control={form.control}
                name="verifyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email One-Time Password
                      <span className="text-red-600"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        type="number"
                        disabled={pending}
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          if (value.length <= 6) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      please enter the one-time password sent to your Email{" "}
                      <b>{email}</b>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-end">
                <Button onClick={sendOTPEmail} disabled={countTimeEmail}>
                  {countTimeEmail
                    ? `Resend OTP in ${timerEmail}s`
                    : "Resend OTP"}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <FormField
                control={form.control}
                name="verifyMobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number One-Time Password <b>{mobile}</b>
                      <span className="text-red-600"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        type="text"
                        disabled={pending}
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          if (value.length <= 6) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      please enter the one-time password sent to your phone
                      number <b>{mobile}</b>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-end">
                <Button onClick={sendOTPMobile} disabled={countTimeMobile}>
                  {countTimeMobile
                    ? `Resend OTP in ${timerMobile}s`
                    : "Resend OTP"}
                </Button>
              </div>
            </div>
          </div>
          {(error || urlError) && <FormError message={error || urlError} />}
          {success && <FormSuccess message={success} />}
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </Form>
      {/* </CardWrapper> */}
    </div>
  );
}
