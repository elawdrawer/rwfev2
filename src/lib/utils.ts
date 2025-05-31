import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false; // Ensure code doesn't run on the server (for SSR)

  const token = localStorage.getItem("token");

  return !!token && token.trim().length > 0;
};

export const getStoredLocation = (): [string, string] => {
  if (typeof window === "undefined") {
    return ["20.5937", "78.9629"];
  }

  const lat = localStorage.getItem("loc_lat");
  const lng = localStorage.getItem("loc_lng");

  const parsedLat = lat ? parseFloat(lat) : NaN;
  const parsedLng = lng ? parseFloat(lng) : NaN;

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return ["20.5937", "78.9629"];
  }

  return [parsedLat.toString(), parsedLng.toString()];
};

export function isOwnProfilePath(pathname: string): boolean {
  // Normalize path (remove trailing slashes)
  const normalizedPath = pathname.replace(/\/+$/, "");

  // Case 1: Exactly '/profile' → own profile
  if (normalizedPath === "/profile") return true;

  // Case 2: Has '/profile/' but no username after → treat as own profile
  if (normalizedPath.startsWith("/profile/")) {
    const parts = normalizedPath.split("/");
    return parts.length <= 2; // ['', 'profile'] or ['', 'profile', '']
  }

  return false;
}

export function formatHours(time: string): string {
  // Convert from 24-hour format to 12-hour format
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
