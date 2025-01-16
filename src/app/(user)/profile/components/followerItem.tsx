import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowerList } from "./dataTypes";
import { Button } from "@/components/ui/button";
import { followUser, unFollowUser } from "@/apis/profile";
import { useEffect, useState } from "react";

interface Props {
  item: FollowerList;
}
export default function FollowerItem({ item }: Props) {
  const [follow, setFollow] = useState<boolean>(false);
  const [myProfile, setMyProfile] = useState<boolean>(false);
  useEffect(() => {
    const data = localStorage.getItem("uib");
    const name = JSON.parse(data || "").userName;
    setFollow(item.isFollowed);
    if (name === item.userName) {
      setMyProfile(true);
    }
  }, []);
  return (
    <div className="flex items-center justify-between space-x-4 w-full">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={item?.profilePic?.original} />
          <AvatarFallback>
            {item?.firstName[0]}
            {item?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">
            {item?.firstName} {item?.lastName}
          </p>
        </div>
      </div>
      {!myProfile && (
        <Button
          variant={"ghost"}
          className="text-blue-700 hover:bg-blue-100 cursor-pointer"
          onClick={async () => {
            follow
              ? await unFollowUser(item.userId)
                  .then((res) => {
                    setFollow(false);
                  })
                  .catch((err) => {
                    console.log(err);
                  })
              : await followUser(item.userId)
                  .then((res) => {
                    setFollow(true);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
          }}
        >
          {follow ? "Un Follow" : "Follow"}
        </Button>
      )}
    </div>
  );
}
