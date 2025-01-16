"use client";
import {
  fetchProfilePosts,
  fetchTaggedVideos,
  followUser,
  unFollowUser,
} from "@/apis/profile";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Bookmark, Grip, Star, Tag } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProfileItem from "./profileItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FollowersList } from "./followers";
import { ProfileDataProps, VideoData } from "./dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialMedia from "./SocialMedia";
import EditProfile from "./edit-profile";
import { FollowingList } from "./following";

export async function generateMetadata(
  profileData: ProfileDataProps,
): Promise<Metadata> {
  const username = profileData.indFirstName;
  return {
    title: `${username}'s Profile | Rewardwale`,
    description: `View the profile of ${username} on Rewardwale.`,
  };
}

interface Props {
  profileData: ProfileDataProps | undefined;
  id: string;
}

const ProfilePage = ({ profileData, id }: Props) => {
  const [videoData, setvideodata] = useState<VideoData[] | []>([]);
  const [taggedVideo, setTaggedVideo] = useState<VideoData[] | []>([]);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [follower, setFollower] = useState<boolean>();
  const [data, setData] = useState<{
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
  }>({
    fname: "",
    lname: "",
    desc: "",
    title: "",
    dob: new Date(),
    gender: "",
    email: "",
    phone: "",
  });
console.log("profile data::::",profileData)
  useEffect(() => {
  
    if (profileData) {
      console.log("profile data::1::")
      const data = localStorage.getItem("uib");
      const name = JSON.parse(data || "").userName;
      if (name === profileData.userName) {
        setMyProfile(true);
  
       
      }
      init();
      setFollower(profileData?.isFollow||false );
    }
  }, []);

  const init = async () => {
    try {
      if (profileData?._id) {
        setData((prev) => ({
          ...prev,
          fname: profileData.indFirstName,
          lname: profileData.indLastName,
          desc: profileData.desc,
          title: profileData.title,
          dob: new Date(profileData.indDob),
          gender: profileData.indGender,
          email: profileData?.indEmail,
          phone: profileData?.indMobileNum,
        }));

        const responseData = await fetchProfilePosts(profileData?._id, count);
        setvideodata(responseData?.data);
        const responseDataTagged = await fetchTaggedVideos(
          profileData?._id,
          count,
        );

        setTaggedVideo(responseDataTagged?.data);
        // setFollower(profileData.isFollow)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMoreData = async () => {
    try {
      if (profileData?._id) {
        setCount(count + 10);
        const responseData = await fetchProfilePosts(
          profileData?._id,
          count + 10,
        );

        let newData = responseData?.data;
        if (newData.length > 0) {
          setvideodata(videoData.concat(newData));
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

  const getMoreDatatagged = async () => {
    try {
      if (profileData?._id) {
        setCount(count + 10);
        const responseData = await fetchTaggedVideos(
          profileData?._id,
          count + 10,
        );

        let newData = responseData?.data;
        if (newData.length > 0) {
          setTaggedVideo(taggedVideo.concat(newData));
        } else {
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleScrollEventTagged(e: React.UIEvent<HTMLDivElement>) {
    if (
      e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
      e.currentTarget.scrollHeight
    ) {
      // setCount(count + 10);
      await getMoreDatatagged();
    }
  }

  const handleUnfollowUser = async () => {
    const response = await unFollowUser(profileData?._id || "");
    if (response.message === "Success.") {
      setFollower(false);
      init();
    }
  };

  const handlefollowUser = async () => {
    const response = await followUser(profileData?._id || "");
    if (response.message === "Success.") {
      setFollower(true);
      init();
    }
  };
console.log("dfplll",follower,profileData?.isFollow)
  const reload = (
    fname: string,
    lname: string,
    desc: string,
    title: string,
    dob: Date,
    gender: string,
    email: string | undefined,
    phone: string | undefined,
  ) => {
    if (profileData) {
      setData((prev) => ({
        ...prev,
        fname: fname,
        lname: lname,
        desc: desc,
        title: title,
        dob: new Date(dob),
        gender: gender,
        email: email,
        phone: phone,
      }));
    }
  };
  console.log("follower state===>", follower);
  return (
    profileData && (
      <div className="min-h-screen p-4">
        {/* Profile Header Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Image
              src={
                profileData?.indPic?.original || "https://github.com/shadcn.png"
              }
              width={500}
              height={500}
              alt="Profile Image"
              className="w-180 h-auto sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg"
            />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col gap-6 flex-grow">
            <div className="flex flex-col px-4">
              <p className="font-bold text-lg sm:text-xl md:text-2xl">
                {data.fname} {data.lname}
              </p>
              <div 
              style={{
                paddingBlock:'4px'
              }}
              className="flex items-center gap-4">
                <small className="text-base font-semibold text-gray-500">
                  {profileData?.userName || "Username"}
                </small>

                <div className="flex gap-3">
                  {!myProfile && (
                    <Button
                      variant='outline'
                      className="hover:bg-transparent"
                      onClick={async () => {
                        if (follower) {
                          // await  handlefollowUser();
                          await handleUnfollowUser();
                        } else {
                          // await  handleUnfollowUser();
                          await handlefollowUser();
                        }
                      }}
                    >
                      {follower ? "UnFollow" : "Follow"}
                    </Button>
                  )}

                  {myProfile && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="hover:bg-transparent font-bold hover:underline"
                        >
                          Edit profile
                        </Button>
                      </DialogTrigger>
                      <EditProfile
                        profileData={profileData}
                        data={data}
                        reload={reload}
                      />
                    </Dialog>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-2 text-base font-semibold text-gray-500">
                <Button
                  variant={"ghost"}
                  className="hover:bg-transparent disabled:text-black dark:disabled:text-white"
                  disabled
                >
                  <div className="flex flex-col">
                    <span>{profileData?.totalPublishedPosts || 0} </span>
                    <span>Reviews</span>
                  </div>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="hover:bg-transparent"
                      disabled={!follower && !myProfile}
                    >
                      <div className="flex flex-col">
                        <span>
                          {!follower && !myProfile
                            ? profileData?.totalFollowers || 0
                            : profileData?.totalFollowers + 1}
                        </span>
                        <span> Followers</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  {follower && (
                    <FollowersList
                      id={profileData._id}
                      usern={profileData.userName}
                      followers={follower}
                    />
                  )}
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="hover:bg-transparent"
                      disabled={!follower && !myProfile}
                    >
                      <div className="flex flex-col">
                        <span> {profileData?.totalFollowing || 0}</span>
                        <span>Followings</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  {follower && (
                    <FollowingList
                      id={profileData._id}
                      usern={profileData.userName}
                      followers={follower}
                    />
                  )}
                </Dialog>
              </div>
            </div>

            <div className="max-w-[650px] flex flex-col px-4 pb-6">
              <p className="text-md font-normal sm:text-base md:text-lg leading-tight">
                {data?.title}
              </p>
              <p className="text-sm sm:text-md md:text-base text-muted-foreground mb-2">
                {data?.desc}
              </p>

              {/* rating */}
              <div className="flex items-center mt-1 gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                    index < Math.round(profileData?.avgRating || 0)
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                ))}
                <span className="text-xs sm:text-sm md:text-base">
                  <span className="text-green-500">
                    {profileData?.avgRating}/5
                  </span>{" "}
                  on{" "}
                  <span className="text-red-500">
                    {profileData?.totalRating || 0}
                  </span>{" "}
                  Ratings
                </span>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <SocialMedia profileData={profileData} />
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full flex items-center justify-center bg-black">
            <TabsTrigger
              value="posts"
              className="text-xs sm:text-sm md:text-base w-full"
            >
              POSTS
            </TabsTrigger>
            <TabsTrigger
              value="tag"
              className="text-xs sm:text-sm md:text-base w-full"
            >
              TAG
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <Separator />

            {/* Posts Section */}
            <div className="py-6">
              <div className="flex w-full justify-center">
                <ScrollArea
                  className="h-full w-full pb-36"
                  ref={scrollContainerRef}
                  onScroll={handleScrollEvent}
                >
                  <div className="flex flex-wrap w-full h-full gap-3 lg:gap-5">
                    {videoData.length > 0 || !videoData ? (
                      videoData.map((item: VideoData, index: number) => (
                        <ProfileItem
                          data={item}
                          key={index}
                          height={1000}
                          width={1000}
                          className="w-[127px] h-[200px] sm:w-[140px] sm:h-[300px] lg:w-[220px] lg:h-[380px]"
                          aspectRatio="portrait"
                        />
                      ))
                    ) : (
                      <div className="w-full text-center">no data</div>
                    )}
                  </div>

                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tag">
            <Separator />

            {/* Tgged Section */}
            <div className="py-6">
              <div className="flex w-full justify-center">
                <ScrollArea
                  className="h-full w-full pb-36"
                  ref={scrollContainerRef}
                  onScroll={handleScrollEventTagged}
                >
                  <div className="flex flex-wrap w-full h-full gap-3 lg:gap-5">
                    {taggedVideo.length > 0 || !taggedVideo ? (
                      taggedVideo.map((item: VideoData, index: number) => (
                        <ProfileItem
                          data={item}
                          key={index}
                          height={1000}
                          width={1000}
                          className="w-[127px] h-[200px] sm:w-[140px] sm:h-[300px] lg:w-[220px] lg:h-[380px]"
                          aspectRatio="portrait"
                        />
                      ))
                    ) : (
                      <div className="w-full text-center">no data</div>
                    )}
                  </div>

                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  );
};

export default ProfilePage;
