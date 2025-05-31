"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ProfileDataProps } from "./dataTypes";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditForm from "./edit-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  data: {
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
    userName: string; 
    location: string; 
    interest: string;
    categoryPref: string[]; 
  };
  profileData: ProfileDataProps;
  reload: (
    fname: string,
    lname: string,
    desc: string,
    title: string,
    dob: Date,
    gender: string,
    email: string,
    phone: string,
    whatsapp: string,
    linkedin: string,
    facebook: string,
    instagram: string,
    twitter: string,
  ) => void;
}

export default function EditProfile({ profileData, data, reload }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <DialogContent className="lg:max-w-3xl xl:max-w-5xl xl:h-[700px] sm:max-w-xl max-w-sm h-[400px] rounded-md">
      <DialogHeader>
        <DialogTitle>Edit</DialogTitle>
        <DialogDescription>
          Please Edit Your Profile Information{" "}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea
        className="h-full w-full"
        // ref={scrollContainerRef}
        // onScroll={handleScrollEvent}
      >
        <div className="h-full">
          <div
            className="flex flex-col md:flex-row items-center mb-6 border border-gray-600 p-4
              rounded-lg"
          >
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
              <Image
                src={profileData.indPic.original}
                width={1000}
                height={1000}
                alt="Profile Image"
                className="lg:w-16 lg:h-16 w-10 h-10 object-cover rounded-full"
              />
              <div className="flex flex-col flex-grow">
                <h2 className="text-base font-semibold">
                  {data.fname} {data.lname}
                </h2>
                <p className="text-sm text-gray-500">{profileData.userName}</p>
                {/* <Button className="mt-2 md:hidden">Change photo</Button> */}
              </div>
            </div>

            {/* <Button className="hidden md:inline ml-auto">Change photo</Button> */}
          </div>

          <EditForm profileData={profileData} data={data} reload={reload} />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </DialogContent>
  );
}
