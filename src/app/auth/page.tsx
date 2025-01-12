"use client";

import { useState } from "react";
import { AuthForm } from "./components/auth-form";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={authType === "signin" ? "default" : "ghost"}
            onClick={() => setAuthType("signin")}
          >
            Sign In
          </Button>
          <Button
            variant={authType === "signup" ? "default" : "ghost"}
            onClick={() => setAuthType("signup")}
          >
            Sign Up
          </Button>
        </div>
        <AuthForm type={authType} />
      </div>
    </div>
  );
}