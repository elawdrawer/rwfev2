"use server";
import axios, { AxiosError } from "axios";

export const checkUserNameAvailability = async (
  userName: string,
  latitude: string,
  longitude: string,
) => {
  console.log("checkUserNameAvailability\t", userName);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/userNameAvailability/${userName}?type=user`,
      {
        headers: {
          "Content-Type": "application/json",
          // fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          // lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("response:::", response.data.data);
    if (response.status === 200) {
      if (response.data.data.isAvailable) {
        return { status: true, message: response.data.message };
      } else if (!response.data.data.isAvailable) {
        return {
          status: false,
          message: "User Name already exists!,try new",
        };
      }
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.log("error\n\t", error);
    console.error("error", error.response);
    return {status:false,message:error.response.data.message}  }
}

export async function validateEmail(
  email: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  console.log("validateEmail", email);
  //   const response = await  apiClient(`/validateEmail/${email}`, "GET");
  try {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validateEmail/${email}?isBusinessUser=false`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validateEmail/${email}?isBusinessUser=false`,
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
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.log("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function validatePhone(
  countryCode: string,
  mobile: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  console.log("validatePhone\t", countryCode, mobile);
  try {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validatePhoneNumber/${countryCode}/${mobile}?isBusinessUser=false`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validatePhoneNumber/${countryCode}/${mobile}?isBusinessUser=false`,
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
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.log("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function verifyOTPMobile(
  code: string,
  number: string,
  otp: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  console.log("verifyOTPMobile\n");
  try {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?countryCode=${code}&phoneNumber=${number}&otp=${otp}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?countryCode=${code}&phoneNumber=${number}&otp=${otp}`,
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
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function verifyOTPEmail(
  otp: string,
  email: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  console.log("verifyOTPEmail\n");
  try {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?otp=${otp}&emailId=${email}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?otp=${otp}&emailId=${email}`,
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
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function signup(
  value: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    mobile: string;
    password: string;
    fingerPrints: string;
  },
  latitude: string,
  longitude: string,
) {
  try {
    console.log("Signup\n", value);
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/signup`);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/signup`,
      {
        indFirstName: value.firstName,
        indLastName: value.lastName,
        userName: value.userName,
        locationCoordinates: {
          latitude: latitude,
          longitude: longitude,
        },
        indEmail: value.email,
        indPwd: value.password,
        location:"karnataka",
        indCountryCode: "91",
        indMobileNum: value.mobile,
        // indDob: "",
        // indGender: "Male",
        indEmailNotify: true,
        indMobileNotify: true,
        indPushNotify: true,
        indWhatsappNotify: true,
        notificationObj: {
          endpoint: "/signup",
          expirationTime: "string",
          keys: {
            p256dh: "string",
            auth: "string",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: value.fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000,
      },
    );
    if (response.status === 200) {
      return {status:true,message:"successfully created"} 
    } else {
      return {status:false,message:response.data.message}; 
    }
  } catch (error: any) {
    console.log("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function resendOTPEmail( email: string,  fingerPrints:string,latitude:string,longitude:string) {
  console.log("resendOTPEmail\n",email,fingerPrints,latitude,longitude);
  try {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resendOTP?emailId=${email}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resendOTP?emailId=${email}`,
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
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error\n\t", error, error.response.data);
    return { status: false, message: error.response.data.message };
  }
}

export async function resendOTPMobile(
  code: string,
  number: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  console.log("resendOTPMobile\n");
  try {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resendOTP?countryCode=${code}&phoneNumber=${number}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resendOTP?countryCode=${code}&phoneNumber=${number}`,
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
    if (response.status === 200) {
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error\n\t", error, error.response.data);
    return { status: false, message: error.response.data.message };
  }
}

export async function signupWithProvider(
  value: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    mobile: string;
    fingerPrints: string;
  },
  latitude: string,
  longitude: string,
  providerToken: string,
  provider: string,
) {
  try {
    console.log(
      "Signup\n",
      value,
      latitude,
      longitude,
      providerToken,
      provider.toLocaleUpperCase(),
    );
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/signup`);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/signupWithSocialProvider`,
      {
        indFirstName: value.firstName,
        indLastName: value.lastName,
        userName: value.userName,
        location: "chennai",
        locationCoordinates: {
          latitude: latitude,
          longitude: longitude,
        },
        indEmail: value.email,
        indCountryCode: "91",
        indDob: "2000-01-11",
        indGender: "male",
        indMobileNum: value.mobile,
        indEmailNotify: true,
        indMobileNotify: true,
        indPushNotify: true,
        indWhatsappNotify: true,
        socialProviderType: "GOOGLE",
        socialProviderToken: providerToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: value.fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000,
      },
    );
    if (response.status === 200) {
      return { status: true, message: "successfully created" };
    } else {
      return { status: false, message: "Signup isnt successful" };
    }
  } catch (error: any) {
    console.log("error\n\t", error.response.data);
    return { status: false, message: error.response.data.message };
  }
}