import api, { getDeviceFingerprint } from "@/lib/api";
import axios from "axios";

export async function sendForgotPassword(email: string) {
  console.log("::::::sendForgotPassword:::::");
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/forgotPassword`,
      {
        indEmail: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("forgot password response===>", response);
    if (response.status === 200) {
      return {
        status: true,
        message: "Reset passwork link has been Please check your Mail",
      };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}

export async function sendResetPassword(token: string, password: string) {
  console.log("::::::sendForgotPassword:::::");
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resetPassword/${token}`,
      {
        indPwd: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("forgot password response===>", response);
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}

//validate token
export async function validateToken(token: string) {
  console.log("::::::validateToken:::::");
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validateLink/${token}`,

      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("validateToken===>", response);
    if (response.status === 200 && response.data.data.isValid) {
      return { status: true, message: response.data.data.reason };
    } else {
      return { status: false, message: response.data.data.reason };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}

export const handleGetLandingPage = async () => {
  try {
    //   const response = await apiClient(
    //     `viewProfileByUsername/vanathixy`,
    //     "GET"
    //   );

    const response = await api.get(`profile`);
    console.log("}{response}{", response.data.data);
  } catch (error) {
    console.log("error=>", error);
  }
};
