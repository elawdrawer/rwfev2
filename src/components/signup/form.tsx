"use client";

import type * as React from "react";
import { useState } from "react";
import { signup } from "@/apis/signUp";
import { useRouter } from "next/navigation";
import PersonalInfoForm from "./subFormPersonal";
import CredentialVerificationForm from "./subFormVerify";
import FinalProviderForm from "./subFormPassword";
import { error } from "node:console";
import Image from "next/image";
import blackLogo from "../../../public/brand_logo/PNG/RW_Black_Name.png";
import whiteLogo from "../../../public/brand_logo/PNG/RW_White_Name.png";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import SimpleForm from "./simpleForm";

export default function SignupForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [signupForm, setSignupForm] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    city: string;
    gender: string;
    email: string;
    mobile: string;
    userName: string;
    password: string;
    fingerPrints:string;
  }>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    city: "",
    gender: "",
    email: "",
    mobile: "",
    userName: "",
    password: "",
    fingerPrints:""
  });
  const [step, setStep] = useState<{
    stepOne: boolean;
    stepTwo: boolean;
    stepThree: boolean | string;
  }>({
    stepOne: true,
    stepTwo: false,
    stepThree: false,
  });

  const handleChangeState = async (
    one: boolean,
    two: boolean,
    three: boolean | string,
  ) => {
    console.log("SIGNUP API ==>", signupForm);
    if (!one && !two && !three) {
      //signupapi
      signupForm.fingerPrints = getDeviceFingerprint();
      const isLocalStorageAvailable = localStorage;
      // Safely access location data from localStorage
      const latitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lat") ?? "90")
        : "90";
      const longitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lng") ?? "90")
        : "90";
      const signUp = await signup(signupForm,latitude,longitude);
      console.log(":::::::=>", signUp);
      if (signUp.status) {
        router.push("/login");
      }
  // const handleChangeState = async () => {
  //   console.log("SIGNUP API ==>", signupForm);

  //   //signupapi
  //   signupForm.fingerPrints = getDeviceFingerprint();
  //   const isLocalStorageAvailable = localStorage;
  //   // Safely access location data from localStorage
  //   const latitude = isLocalStorageAvailable
  //     ? (localStorage.getItem("loc-lat") ?? "90")
  //     : "90";
  //   const longitude = isLocalStorageAvailable
  //     ? (localStorage.getItem("loc-lng") ?? "90")
  //     : "90";
  //   const signUp = await signup(signupForm, latitude, longitude);
  //   console.log(":::::::=>", signUp);
  //   if (signUp.success) {
  //     router.push("/login");
  //   }

      if (!signUp.status) {
        setMessage(signUp.message);
      }
    } else {
      setStep({
        stepOne: one,
        stepThree: three,
        stepTwo: two,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-1  justify-center">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <Image
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full top-0 left-0"
          width={10000}
          height={10000}
          // inset-0 size-full object-cover
        />
      </div>
      <div
        className=" w-[500px] space-y-9 
        sm:px-6  min-h-screen  m-5 lg:m-2"
      >
        <div className="mx-auto pt-8 ">
          <div className="flex flex-col items-center">
            <Image
              alt="Rewardwale"
              src={whiteLogo}
              className="md:w-[220px] sm:w-[170px] w-[150px] hidden dark:inline"
            />
            <Image
              alt="Rewardwale"
              src={blackLogo}
              className="md:w-[220px] sm:w-[170px] w-[150px] inline dark:hidden"
            />
            <h2 className="mt-6  text-xl md:text-2xl lg:text-2xl/9 tracking-tight
             text-primary
              font-Inter font-bold">
              Sign Up
            </h2>
          </div>
        </div>
        <div className="w-full px-4 lg:px-0">
          {" "}
          {/* {step.stepOne && (
            <PersonalInfoForm
              stateChange={handleChangeState}
              data={(
                firstName: string,
                lastName: string,
                email: string,
                mobile: string,
                city: string,
                gender: string,
                dataOfBirth: string,
              ) =>
                setSignupForm((prev) => ({
                  ...prev,
                  firstName: firstName,
                  lastName: lastName,
                  gender: gender,
                  dateOfBirth: dataOfBirth,
                  email: email,
                  mobile: mobile,
                  city: city,
                }))
              }
            />
          )}
          {step.stepTwo && (
            <CredentialVerificationForm
              stateChange={handleChangeState}
              mobile={signupForm.mobile}
              email={signupForm.email}
            />
          )}
          {step.stepThree && (
            <FinalProviderForm
              // stateChange={handleChangeState}
              errormsg={message}
              data={(userName: string, password: string) => {
                signupForm.userName = userName;
                signupForm.password = password;
                handleChangeState(false, false, false);
              }}
            />
          )}
          {!step.stepOne && !step.stepTwo && !step.stepThree && (
            <p>{message}</p>
          )} */}

          <SimpleForm/>
        </div>
      </div>
    </div>
  );
}