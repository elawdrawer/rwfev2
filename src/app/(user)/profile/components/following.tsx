import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FollowerList } from "./dataTypes";
import { useEffect, useRef, useState } from "react";
import { getfollowerList, getfollowingList } from "@/apis/profile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FollowerItem from "./followerItem";

interface Props {
  id: string;
  usern:string;
  followers:boolean
}
export function FollowingList({ id ,usern,followers}: Props) {
  const [follower, setFollower] = useState<FollowerList[]>([]);
  const [count, setCount] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [myProfile, setMyProfile] = useState<boolean>(false);


  useEffect(() => {

    if (id&&followers) {
      init();
    }
  }, []);


  const init = async () => {
    const data = localStorage.getItem("uib");
    const name = JSON.parse(data || "").userName;
    if (name === usern) {
      setMyProfile(true);
    }
    const response = await getfollowingList(name === usern?"":id, count);
    setFollower(response.data.data);
  };

  const getMoreData = async () => {
    try {
      if (id) {
        setCount(count + 10);
        const responseData = await getfollowingList(myProfile?"":id, count + 10);

        let newData = responseData?.data.data;
        if (newData.length > 0) {
          setFollower(follower.concat(newData));
        } else {
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleScrollEvent(e: React.UIEvent<HTMLDivElement>) {
    if (
      e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
      e.currentTarget.scrollHeight
    ) {
      // setCount(count + 10);
      await getMoreData();
    }
  }

  return (
    <DialogContent className="max-w-[375px] sm:max-w-[425px] rounded-md">
      <DialogHeader>
        <DialogTitle>Following</DialogTitle>
        <DialogDescription>
          You are following {follower.length} people 
        </DialogDescription>
      </DialogHeader>
      <div className="py-6">
        <div className="flex w-full justify-center">
          <ScrollArea
            className="h-full w-full pb-36"
            ref={scrollContainerRef}
            onScroll={handleScrollEvent}
          >
            <div className="flex flex-wrap w-full h-full gap-3">
              {follower.length > 0 || !follower ? (
                follower.map((item: FollowerList, index: number) => (
                  <FollowerItem item={item} key={index} />
                ))
              ) : (
                <div className="w-full text-center">no data</div>
              )}
            </div>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>
    
    </DialogContent>
  );
}
