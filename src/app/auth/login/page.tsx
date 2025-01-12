"use client";
import LoginForm from "@/components/signin/form";
import { useEffect } from "react";

export default function SigninPage() {
  useEffect(() => {
    if (!navigator.geolocation) {
      // setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem(
          "loc_lat",
          JSON.stringify(position.coords.latitude),
        );
        localStorage.setItem(
          "loc_lng",
          JSON.stringify(position.coords.longitude),
        );
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            // setError("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            // setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            // setError("The request to get user location timed out.");
            break;
          default:
          // setError("An unknown error occurred.");
        }
      },
    );
  }, []);
  return (
    <div>
      <LoginForm />
    </div>
  );
}
