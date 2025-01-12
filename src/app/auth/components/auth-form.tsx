"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { apiClient } from "@/lib/apiClient";

interface AuthFormProps {
  type: "signin" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    indEmail: "",
    indPwd: "",
    userName: "",
    indFirstName: "",
    indLastName: "",
    indCountryCode: "+91",
    indMobileNum: "",
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(true);
        if (type === "signin") {
          const result = await apiClient("/loginWithSocialProivder", "PUT", {
            socialProviderType: "GOOGLE",
            socialProviderToken: response.access_token,
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

          if (result.success) {
            router.push("/home");
          }
        } else {
          // For signup, we need to get user details from Google
          const userInfo = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${response.access_token}` },
            },
          ).then((res) => res.json());

          const result = await apiClient("/signupWithSocialProvider", "POST", {
            indFirstName: userInfo.given_name,
            indLastName: userInfo.family_name,
            userName: "", // Will be set in next step
            locationCoordinates: {
              latitude: 90,
              longitude: 180,
            },
            indEmail: userInfo.email,
            indCountryCode: "+91",
            indMobileNum: "",
            indEmailNotify: true,
            indMobileNotify: true,
            indPushNotify: true,
            indWhatsappNotify: true,
            socialProviderType: "GOOGLE",
            socialProviderToken: response.access_token,
          });

          if (result.success) {
            router.push("/home");
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
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Google authentication failed",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "signin") {
        const result = await apiClient("/login", "PUT", {
          indEmail: formData.indEmail,
          indPwd: formData.indPwd,
          // userName: formData.userName,
          // indCountryCode: formData.indCountryCode,
          // indMobileNum: formData.indMobileNum,
          // isBusinessUser: false,
          indPushNotify: true,
        });

        if (result.success) {
          router.push("/home");
        }
      } else {
        const result = await apiClient("/api/signup", "POST", {
          ...formData,
          locationCoordinates: {
            latitude: 90,
            longitude: 180,
          },
        });

        if (result.success) {
          router.push("/home");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {type === "signin"
            ? "Sign in to your account"
            : "Create a new account"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.indEmail}
              onChange={(e) =>
                setFormData({ ...formData, indEmail: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.indPwd}
              onChange={(e) =>
                setFormData({ ...formData, indPwd: e.target.value })
              }
              required
            />
          </div>

          {type === "signup" && (
            <>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.indFirstName}
                  onChange={(e) =>
                    setFormData({ ...formData, indFirstName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.indLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, indLastName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="countryCode"
                    value={formData.indCountryCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        indCountryCode: e.target.value,
                      })
                    }
                    className="w-20"
                    required
                  />
                  <Input
                    id="mobile"
                    value={formData.indMobileNum}
                    onChange={(e) =>
                      setFormData({ ...formData, indMobileNum: e.target.value })
                    }
                    className="flex-1"
                    required
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {type === "signin" ? "Sign In" : "Sign Up"}
          </Button>

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

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </form>
    </div>
  );
}
