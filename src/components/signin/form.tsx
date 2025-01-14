"use client";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema";
import { GoogleLogin } from "@react-oauth/google"; // Ensure this is properly imported
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
import { Newlogin } from "@/actions/login";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeClosed } from "lucide-react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import blackLogo from "../../../public/brand_logo/PNG/RW_Black_Name.png";
import whiteLogo from "../../../public/brand_logo/PNG/RW_White_Name.png";
import Image from "next/image";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const [showPassword, setShowpassword] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const [shwoTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userIdentity: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      const fingerPrint = getDeviceFingerprint();
      const isLocalStorageAvailable = localStorage;
      // Safely access location data from localStorage
      const latitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lat") ?? "90")
        : "90";
      const longitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lng") ?? "90")
        : "90";
      Newlogin(values, fingerPrint, latitude, longitude)
        .then((res) => {
          console.log("===res===", res);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            router.push("/home");
            localStorage.removeItem("uib");
            localStorage.removeItem("token");
            localStorage.setItem("uib", JSON.stringify(res.success));
            localStorage.setItem("token", res.success.accessToken);
            setSuccess("logging In.....");
          }

          // if (res?.twoFactor) {
          //   setShowTwoFactor(true);
          // }
          // setSuccess(res?.success);
          //start transition will tell when the validation has ended till then the feilds will be disabled
        })
        .catch((error) => setError(error.message));
    });
  };

  const handleLoginSuccess = async (response: any) => {
    console.log("Google login successful:1", response);
    try {
      setLoading(true);
      {
        const result = await apiClient("/loginWithSocialProivder", "PUT", {
          socialProviderType: "GOOGLE",
          socialProviderToken: response.credential,
          indPushNotify: true,
          notificationObj: {
            endpoint: "string",
            expirationTime: "string",
            keys: {
              p256dh: "string",
              auth: "string",
            },
          },
        });

        console.log("Google login successful:2", result);

        if (result.success) {
          router.push("/home");

          const fingerPrint = getDeviceFingerprint();
          const isLocalStorageAvailable = localStorage;
          // Safely access location data from localStorage
          const latitude = isLocalStorageAvailable
            ? (localStorage.getItem("loc-lat") ?? "90")
            : "90";
          const longitude = isLocalStorageAvailable
            ? (localStorage.getItem("loc-lng") ?? "90")
            : "90";
          // Newlogin(values, fingerPrint, latitude, longitude)
          //   .then((res) => {
          //     console.log("===res===", res);
          //     if (res?.error) {
          //       // form.reset();
          //       setError(res?.error);
          //     }

          // form.reset();
          localStorage.removeItem("uib");
          localStorage.removeItem("token");
          localStorage.setItem("uib", JSON.stringify(result.data.data.indDetail));
          localStorage.setItem("token", result.data.data.indDetail.accessToken);
          // setSuccess("logging In.....");

          // if (res?.twoFactor) {
          //   setShowTwoFactor(true);
          // }
          // setSuccess(res?.success);
          //start transition will tell when the validation has ended till then the feilds will be disabled
          // })
          // .catch((error) => setError(error.message));
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginFailure = (error: any) => {
    console.error("Google login failed:", error);
    toast({
      title: "Error",
      description: "Google login failed",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-1">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <Image
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full"
          width={10000}
          height={10000}
          // inset-0 size-full object-cover
        />
      </div>
      <div
        className="flex-1 flex-col w-1/3 space-y-14 px-4 py-12 sm:px-6 xl:flex-none xl:px-20
          min-h-screen"
      >
        <div className="mx-auto py-4">
          <div className="flex flex-col items-center">
            <Image
              alt="Rewardwale"
              src={whiteLogo}
              className="w-[220px] hidden dark:inline"
            />
            <Image
              alt="Rewardwale"
              src={blackLogo}
              className="w-[220px] inline dark:hidden"
            />
            <h2 className="mt-6 text-2xl/9 tracking-tight text-primary font-Inter font-bold">
              Sign In
            </h2>
          </div>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <>
                  <FormField
                    control={form.control}
                    name="userIdentity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Login with Email, Mobile Number or Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter username,mobile number or Email"
                            type="text"
                            disabled={pending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div
                            className={
                              "flex border shadow-sm focus:ring-1 active:ring-1 selection:ring-1 rounded-sm "
                            }
                          >
                            <Input
                              {...field}
                              placeholder="********"
                              type={showPassword ? "password" : "text"}
                              disabled={pending}
                              className={cn(
                                " focus:border-none focus-visible:outline-none focus-visible:ring-0",
                                "border-none",
                              )}
                            />
                            <Button
                              type="button"
                              variant={"ghost"}
                              className="hover:bg-transparent focus:ring-0"
                              disabled={field.value.length === 0}
                              onClick={() => setShowpassword(!showPassword)}
                            >
                              {showPassword ? <EyeClosed /> : <EyeOpenIcon />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
                {/* )} */}

                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="px-0 font-normal"
                >
                  <Link href="/reset">Forgot Password?</Link>
                </Button>
              </div>
              {(error || urlError) && <FormError message={error || urlError} />}
              {success && <FormSuccess message={success} />}
              <Button type="submit" className="w-full">
                {/* {shwoTwoFactor ? "Confirm" : "login"} */}
                login
              </Button>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleLogin
                  onSuccess={(response) => handleLoginSuccess(response)}
                  onError={() => handleLoginFailure("Google login failed")} // Pass a string or handle it as needed
                />
              </div>

              <Button
                variant={"link"}
                className="font-normal w-full hover:text-blue-500"
                size="sm"
                asChild
              >
                <Link href={"/signup"}>Dont have an account ? </Link>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
