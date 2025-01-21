"use client";

import { lazy, Suspense, useEffect, useState } from "react";
// import ProfilePage from "./components/profile-page";

import { fetchProfileData, fetchProfilePosts } from "@/apis/profile";
import { Header } from "./../home/components/header";
import { Sidebar } from "./../home/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileDataProps } from "./components/dataTypes";
const ProfilePage = lazy(() => import("./components/profile-page"));

export default function HomePage() {
  const [data, setData] = useState<ProfileDataProps | undefined>(undefined);
  const [userId, setUserId] = useState<any>(null);

  const isMobile = useIsMobile();

  const init = async () => {
    const profileData = await fetchProfileData();
    setData(profileData.data);
    setUserId(profileData.data._id);
  };

  useEffect(() => {
    init();
  }, []);

  // console.log("checking for profile data----myProfile", data);

  return (
    <div className="flex bg-background ">
      {!isMobile && <Sidebar />}
      <div className="flex-1 h-screen overflow-y-scroll overscroll-none">
        <Header />
        {/* <div className="flex justify-center w-full"><SearchInputContainer/></div> */}
        <Suspense fallback={<div>Loading...</div>}>
          {data && <ProfilePage profileData={data} id={userId} />}
        </Suspense>
        {/* <Footer/> */}
      </div>
    </div>
  );
}
