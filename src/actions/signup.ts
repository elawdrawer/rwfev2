"use server";
import {
  combinedSchema,
  newSignupRwSchema,
  newSignupSchema,
  OTPFormSchema,
  PasswordFormSchema,
  PersonalInfoFormSchema,
  SignupSchema,
} from "@/schema";
import * as z from "zod";
import {
  checkUserNameAvailability,
  validateEmail,
  validatePhone,
  verifyOTPEmail,
  verifyOTPMobile,
} from "@/apis/signUp";

export const NewSignUp = async (values: z.infer<typeof combinedSchema>) => {
  const validatedFields = combinedSchema.safeParse(values);
};

export const PersonalInfo = async (
  values: z.infer<typeof PersonalInfoFormSchema>,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) => {
  const validatedFields = PersonalInfoFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, mobile, firstname, lastname, city, dob } =
    validatedFields.data;

  const validatedEmail = await validateEmail(
    email,
    fingerPrints,
    latitude,
    longitude,
  );
  const validateMobile = await validatePhone(
    "91",
    mobile,
    fingerPrints,
    latitude,
    longitude,
  );
  if (!validatedEmail.status) {
    return { error: validatedEmail.message };
  }

  if (!validateMobile.status) {
    return { error: validateMobile.message };
  }
  //check if email is already is in use or not- api
  if (validatedEmail.status && validateMobile.status) {
    return { success: "OTP has been sent to your email id and mobile number" };
  }
};

export const Verification = async (
  values: z.infer<typeof OTPFormSchema>,
  code: string,
  number: string,
  email: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) => {
  const validatedFields = OTPFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { verifyEmail, verifyMobileNumber } = validatedFields.data;

  const getMobileOtp = await verifyOTPMobile(
    code,
    number,
    verifyMobileNumber,
    fingerPrints,
    latitude,
    longitude,
  );
  const getEmailOtp = await verifyOTPEmail(
    verifyEmail,
    email,
    fingerPrints,
    latitude,
    longitude,
  );
  // if (getEmailOtp?.status) {
  //   return { success: getEmailOtp.message };
  // }
  if (!getMobileOtp?.status) {
    return { error: getMobileOtp.message + "for mobile" };
  }

  if (!getEmailOtp?.status) {
    return { error: getEmailOtp.message + " for email" };
  }
  if (getMobileOtp?.status && getEmailOtp?.status) {
    return { success: "Mobile and Email OTPs are verified" };
  }
};

export const Final = async (
  values: z.infer<typeof PasswordFormSchema>,
  latitude: string,
  longitude: string,
) => {
  const validatedFields = PasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { userName, password, confirmPassword } = validatedFields.data;

  const verifyUserName = await checkUserNameAvailability(
    userName,
    latitude,
    longitude,
  );
  if (!verifyUserName?.status) {
    return { error: verifyUserName?.message };
  }

  return { success: "Success" };
};

export const simpleForm = async (
  values: z.infer<typeof newSignupRwSchema>,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) => {
  const validatedFields = await newSignupRwSchema.parseAsync(values);

  if (!validatedFields) {
    return { error: "Invalid fields!" };
  }
  const { firstname, lastname, email, mobile } = validatedFields;

  const validatedEmail = await validateEmail(
    email,
    fingerPrints,
    latitude,
    longitude,
  );
  const validateMobile = await validatePhone(
    "91",
    mobile,
    fingerPrints,
    latitude,
    longitude,
  );
  if (!validatedEmail.status) {
    return { error: validatedEmail.message };
  }

  if (!validateMobile.status) {
    return { error: validateMobile.message };
  }
  //check if email is already is in use or not- api
  if (validatedEmail.status && validateMobile.status) {
    return { success: "OTP has been sent to your email id and mobile number" };
  }
  // if (validatedEmail.status) {
  //   console.log("done!! email");
  //   return { success: "OTP has been sent to your email" };
  // }

  //no need to validate email

  //username avaiability
  // return {success:"signed up successfully!"}
};

export const simpleProviderForm = async (
  values: z.infer<typeof newSignupSchema>,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) => {
  const validatedFields = await newSignupSchema.parseAsync(values);

  if (!validatedFields) {
    return { error: "Invalid fields!" };
  }
  const { firstname, lastname, email, userName, mobile } = validatedFields;

  // const validatedEmail = await validateEmail(email,fingerPrints,latitude,longitude);
  const validateMobile = await validatePhone(
    "91",
    mobile,
    fingerPrints,
    latitude,
    longitude,
  );
  // if (!validatedEmail.status) {
  //   return { error:validatedEmail.message };
  // }

  if (!validateMobile.status) {
    return { error: validateMobile.message };
  }
  //check if email is already is in use or not- api
  // if (validatedEmail.status && validateMobile.status) {
  //   console.log("done!! email");
  //   return { success: "OTP has been sent to your email id and mobile number" };
  // }
  if (validateMobile.status) {
    return { success: "OTP has been sent to your  mobile number" };
  }

  //no need to validate email

  //username avaiability

  //provider signup
};

// export const registerSignupProvider = async (
//   values: z.infer<typeof newSignupSchema>,
//   fingerPrints: string,
//   latitude: string,
//   longitude: string,
//   providerToken: string,
//   provider: string,
// ) => {
//   const validatedFields =await newSignupSchema.parseAsync(values);

//   console.log(":::::::::!!!!", validatedFields);
//   if (!validatedFields) {
//     return { error: "Invalid fields!" };
//   }
//   const { firstname, lastname, email, userName ,mobile} =
//     validatedFields;

//   const signup = await signupWithProvider(
//     {
//       firstName: firstname,
//       lastName: lastname,
//       email: email,
//       userName: userName,
//       mobile:mobile,
//       // password: password,
//       fingerPrints: fingerPrints,
//     },
//     latitude,
//     longitude,
//     providerToken,
//     provider,
//   );

//   if (signup.status) {
//     //login here
//     const login = await signInWithProviders(
//       provider,
//       providerToken,
//       fingerPrints,
//       latitude,
//       longitude,
//     );
//     if (login.status) {
//       return { success: login.message };
//     } else {
//       return { error: login.message };
//     }
//   } else {
//     return { error: signup.message };
//   }
// };

