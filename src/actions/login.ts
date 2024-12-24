"use server";
import {
  signInWithEmail,
  signInWithMobile,
  signInWithUserName,
} from "../apis/login";
import { LoginSchema } from "@/schema";
import * as z from "zod";

export const Newlogin = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  console.log("STEP 2:", values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { userIdentity, password, code } = validatedFields.data;

  //validate the user identity if it mail or username or phonenumber
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?\d{10}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

  let identity;
  if (emailRegex.test(userIdentity)) {
    identity = "Email";
  } else if (phoneRegex.test(userIdentity)) {
    identity = "Phone Number";
  } else if (usernameRegex.test(userIdentity)) {
    identity = "Username";
  } else {
    identity = "Unknown";
  }

  if (identity === "Email") {
    const email = await signInWithEmail(password, userIdentity);
    if (email.status) {
      // window.localStorage.setItem("UID", email.message.data.indDetail);
      return { success: email.message.data.indDetail };
    }
  }

  if (identity === "Phone Number") {
    const mobile = await signInWithMobile(password, "91", userIdentity);
    if (mobile.status) {
      // window.localStorage.setItem("UID", mobile.message.data.indDetail);
      return { success: mobile.message.data.indDetail };
    }
  }

  if (identity === "Username") {
    const username = await signInWithUserName(password, userIdentity);
    if (username.status) {
      // window.localStorage.setItem(
      //   "UID",
      //   username.message.data.indDetail
      // );
      return { success: username.message.data.indDetail };
    }
  }

  //check if the user is available or not
  if (identity === "Unknown") {
    return { error: "Login identity doesnt belong to mobile/email/userName" };
  }

  return { error: "Login Failed , try again" };
};