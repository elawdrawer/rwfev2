"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
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

  const handleTouchStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = "auto";
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.overflow = "hidden";
        }
      }, 10000); // Adjust the delay in milliseconds (e.g., 3000ms = 3 seconds)
    }
  };

  return (
    <div className="flex bg-background  h-screen"

    >
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 h-screen max-sm:overflow-y-scroll max-sm:overscroll-none"
          ref={scrollContainerRef}
          // onScroll={handleScrollEvent}
          onMouseEnter={(e) =>
           { 
     
            Object.assign(e.currentTarget.style, { overflow: "auto", overscrollBehavior: "none" });
      
           }
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.overflow = "hidden")
          }
          onTouchStart={handleTouchStart}
      >
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
