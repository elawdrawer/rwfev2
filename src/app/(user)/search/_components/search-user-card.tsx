"use client";
import React, { useEffect, useState } from "react";
import { Profile } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import UserItem from "./search-user-item";
import { searchNonBusinessUsers } from "@/apis/search";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { followUser } from "@/lib/usersApi/userapi";

export default function User() {
  let router = useRouter();
  const [userData, setuserData] = useState<Profile[]>([]);
  const [count, setCount] = useState<number>(0);
  const [searchWord, setSearchWord] = useState<string | null>("");

  useEffect(() => {
    init();
    return () => {};
  }, []);

  const init = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchNonBusinessUsers(paramInput, count, 10);
      setuserData(responseData);
      setSearchWord(paramInput);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowMerchants = async (id: string) => {
    try {
      // const request = await followUser(id);
      const index = userData.findIndex((item: Profile) => item._id === id);
      const newData = userData;
      newData[index] = {
        ...newData[index],
        isFollow: true,
      };
      setuserData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="space-y-1 flex justify-between w-full">
          <h2 className="text-base font-semibold tracking-tight max-sm:text-sm">
            Users
          </h2>
          <Link
            href={`/searchNew/result/user?i=${searchWord}`}
            className="text-blue-500 max-sm:text-xs"
          >
            See All
          </Link>
        </div>
      </div>
      <div className=" relative">
        <ScrollArea className="w-full  ">
          <div className="flex space-x-4 pb-4">
            {userData.length > 0 || !userData ? (
              userData.map((item: Profile, index: number) => (
                <UserItem
                  data={item}
                  key={index}
                  handleFollow={handleFollowMerchants}
                />
              ))
            ) : (
              <div>no data</div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
