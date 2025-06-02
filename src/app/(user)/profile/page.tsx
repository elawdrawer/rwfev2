"use client";

import { lazy, Suspense, useEffect, useState } from "react";
// import ProfilePage from "./components/profile-page";

import { fetchProfileData } from "@/apis/profile";
import { Header } from "./../home/components/header";
import { Sidebar } from "./../home/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileDataProps } from "./components/dataTypes";
const ProfilePage = lazy(() => import("./components/profile-page"));

export default function HomePage() {
  const [data, setData] = useState<ProfileDataProps | undefined>(undefined);
  const [userId, setUserId] = useState<any>(null);

  const isMobile = useIsMobile();

  console.log("data in profile", data);

  const init = async () => {
    const profileData = await fetchProfileData();
    setData(profileData.data);
    setUserId(profileData.data._id);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex h-screen bg-background flex-col">
      <Header />

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div
          className={`flex-1 ${isMobile ? "overflow-scroll" : "overflow-hidden"} scrollbar-hide`}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {data && <ProfilePage profileData={data} id={userId} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
