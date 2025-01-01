"use client";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTPFormSchema } from "@/schema";
import {
  Form,
  FormControl,
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
import { Verification } from "@/actions/signup";
import { getDeviceFingerprint } from "@/lib/fingerPrint";

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
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
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
      const fingerPrints = getDeviceFingerprint();
      const isLocalStorageAvailable = localStorage;
      // Safely access location data from localStorage
      const latitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lat") ?? "90")
        : "90";
      const longitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lng") ?? "90")
        : "90";
      Verification(values, "91", mobile, email,fingerPrints,latitude,longitude)
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

  return (
    <div>
      {/* <CardWrapper
        headerLabel="welcome back!"
        backButtonHref="/signup"
        backButtonLabel="Dont have an account?"
        showSocial
      > */}{" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <>
              <FormField
                control={form.control}
                name="verifyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Please Enter OTP From Your Email <b>{email}</b>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="verifyMobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Please Enter OTP From Your Mobile <b>{mobile}</b>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
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
