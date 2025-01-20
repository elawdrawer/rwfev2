import axios from "axios";

export async function signInWithMobile(
  password: string,
  code: string,
  mobile: string,
  fingerPrint:string
  ,latitude:string,longitude:string
) {
  console.log("::::::login mobile:::::");
  try {


    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/login`,
      {
        // indEmail: email,
        indPwd: password,
        // userName: "",
        indCountryCode: code,
        indMobileNum: mobile,
        // isBusinessUser: false,
        indPushNotify: true,
        notificationObj: {
          endpoint: "signin",
          expirationTime: "20",
          keys: {
            p256dh: "tyutw",
            auth: "werw",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrint,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("response::::::::",response)
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    // console.error("error", error.response);
    return {status:false,message:error.response.data.message};   }
}

export async function signInWithEmail(password: string, email: string,  fingerPrint:string,latitude:string,longitude:string) {
  console.log("::::::login email:::::");
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/login`,
      {
        indEmail: email,
        indPwd: password,
        // userName: "",
        isBusinessUser: false,
        indPushNotify: true,
        notificationObj: {
          endpoint: "signin",
          expirationTime: "20",
          keys: {
            p256dh: "tyutw",
            auth: "werw",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrint,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("response::::::::",response)
    if (response.status === 200) {

      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error", error);
    return {status:false,message:error.response.data.message};  }
}

export async function signInWithUserName(password: string, userName: string,  fingerPrint:string,latitude:string,longitude:string) {
  console.log("::::::login userName:::::");
  try {
     const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/login`,
      {
        indPwd: password,
        userName: userName,

        // isBusinessUser: false,
        indPushNotify: true,
        notificationObj: {
          endpoint: "signin",
          expirationTime: "20",
          keys: {
            p256dh: "tyutw",
            auth: "werw",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrint,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("response::::::::",response)
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data.message};
    }
  } catch (error: any) {
    // console.error("error", error.response);
    return {status:false,message:error.response.data.message};   }
}

export async function signInWithProviders(provider: string, token: string,  
  fingerPrint:string,latitude:string,longitude:string) {
  console.log("::::::login userName:::::", provider,token);
  try {
     const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/loginWithSocialProivder`,
      {
        
          "socialProviderType": provider.toLocaleUpperCase(),
          "socialProviderToken": token,
          "indPushNotify": true,
          "notificationObj": {
            "endpoint": "login",
            "expirationTime": "",
            "keys": {
              "p256dh": "key",
              "auth": "auth"
            }
          }
        
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrint,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("response::::::::",response)
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data };
    }
  } catch (error: any) {
    // console.error("error", error.response);
    return {status:false,message:error.response.data.message};   }
}