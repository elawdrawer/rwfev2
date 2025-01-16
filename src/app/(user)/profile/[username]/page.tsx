"use client";

import { Suspense, useEffect, useState } from "react";
import ProfilePage from "../components/profile-page";

import {
  fetchProfileData,
  fetchProfilePosts,
  othersProfileData,
} from "@/apis/profile";
import { Header } from "../../home/components/header";
import { Sidebar } from "../../home/components/sidebar";
import { Footer } from "@/components/layout";
import SearchInputContainer from "../../search/components/search-Input-component";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export default function OthersPage() {
  const [data, setData] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [postData, setPostData] = useState([]);
  const pathName = usePathname();

  const isMobile = useIsMobile();
  const init = async () => {
    const path = pathName.split("/");
    const profileData = await othersProfileData(path[path.length - 1] || "");
    setData(profileData.data.userInfo);
    setUserId(profileData.data.userInfo._id);
  };

  useEffect(() => {
    init();
  }, []);

  console.log("checking for profile data", data);

  // const params = {
  //   username: "Lokesh",
  // };

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex-1">
        <Header />
        {/* <div className="flex justify-center w-full"><SearchInputContainer/></div> */}
        <Suspense fallback={<div>Loading...</div>}>
        {data  &&  <ProfilePage profileData={data} id={userId} />}
        </Suspense>
        {/* <Footer/> */}
      </div>
    </div>
  );
}
