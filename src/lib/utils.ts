import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token && token.length > 0;
};
