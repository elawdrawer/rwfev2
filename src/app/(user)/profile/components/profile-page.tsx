"use client";
import { fetchProfilePosts } from "@/apis/profile";
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

interface SocialUrls {
  whatsapp: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

interface IndPic {
  original: string;
  thumbnail: string;
}

interface ProfileData {
  _id: string;
  indFirstName: string;
  indLastName: string;
  businessName: string;
  userName: string;
  desc: string;
  indDob: string;
  interest: string;
  socialUrls: SocialUrls;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  isBusinessUser: boolean;
  indEmailNotify: boolean;
  indMobileNotify: boolean;
  isAccountVerified: boolean;
  isPrivateAccount: boolean;
  avgRating: number;
  totalRating: number;
  indGender: string;
  indPic: IndPic;
  indLanPref: string;
  indContentPref: string;
  totalUnpublishedPosts: number;
  totalPublishedPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  indCategories: string[];
  profileImages: string[];
  title: string;
}

interface ProfilePageProps {
  profileData: {
    message: string;
    data: ProfileData;
  };
}

export async function generateMetadata({
  profileData,
}: ProfilePageProps): Promise<Metadata> {
  const username = profileData.data.indFirstName;
  return {
    title: `${username}'s Profile | Rewardwale`,
    description: `View the profile of ${username} on Rewardwale.`,
  };
}

export interface videoData {
  _id: string;
  userDetails: {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
  };
  videoId: string;
  hashtags: string[];
  title: string;
  desc: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  totalViewCount: number;
  totalShareCount: number;
  totalLikes: number;
  totalComments: number;
  isCommentingAllowed: boolean;
  avgRating: number;
  status: string;
  uploadedAt: string;
  videoLocation: {
    type: string;
    coordinates: number[];
  };
  locationName: string;
  isSponsored: boolean;
  isAdvertisement: boolean;
  categoryId: string;
  categoryName: string;
}

const ProfilePage = ({ profileData }: ProfilePageProps) => {
  const [videoData, setvideodata] = useState<videoData[] | []>([]);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const init = async () => {
    try {
      const data = localStorage.getItem("uib");
      const userId = JSON.parse(data || "")._id;
      const responseData = await fetchProfilePosts(userId, count);
      console.log("checking res of fetchProfilePosts", responseData);

      setvideodata(responseData?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMoreData = async () => {
    try {
      setCount(count + 10);
      const data = localStorage.getItem("uib");
      const userId = JSON.parse(data || "")._id;
      const responseData = await fetchProfilePosts(userId, count + 10);

      let newData = responseData?.data;
      if (newData.length > 0) {
        setvideodata(videoData.concat(newData));
      } else {
        return;
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

  useEffect(() => {
    init();
  }, []);
  return (
    profileData && (
      <div className="min-h-screen p-4">
        {/* Profile Header Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Image
              src={profileData?.data?.indPic?.original}
              width={500}
              height={500}
              alt="Profile Image"
              className="w-180 h-auto sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg"
            />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col gap-2 flex-grow">
            <p className="font-bold text-lg sm:text-xl md:text-2xl">
              {profileData?.data?.indFirstName} {profileData?.data?.indLastName}
            </p>
            <div className="flex items-center gap-2 text-sm sm:text-md md:text-base text-muted-foreground">
              <span>{profileData?.data?.userName}</span>
              <span>{profileData?.data?.totalFollowers}</span>
              <span>{profileData?.data?.totalPublishedPosts} Reviews</span>
            </div>
            <div className="max-w-[650px]">
              <p className="text-md font-normal sm:text-base md:text-lg leading-tight">
                {profileData?.data?.title}
              </p>
              <p className="text-sm sm:text-md md:text-base text-muted-foreground mt-2">
                {profileData?.data?.desc}
              </p>
            </div>
            <div className="flex items-center mt-1 gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                  index < Math.round(profileData?.data?.avgRating || 0)
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                />
              ))}
              <span className="text-xs sm:text-sm md:text-base">
                <span className="text-green-500">
                  {profileData?.data?.avgRating}/5
                </span>{" "}
                on{" "}
                <span className="text-red-500">
                  {profileData?.data?.totalRating}
                </span>{" "}
                Ratings
              </span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="social-icons flex sm:flex-col ms-4 mt-1 items-center justify-center sm:mt-0">
            <Link href={profileData.data.socialUrls.whatsapp}>
              {" "}
              <Image
                className="mb-2 mr-5"
                src="/whatsApp-logo.png"
                alt="social-icon"
                height={50}
                width={40}
              />{" "}
            </Link>
            {/* <Link href="http://">
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/facebook-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link> */}
            <Link href={profileData.data.socialUrls.twitter}>
              {" "}
              <Image
                className="mb-2 mr-5"
                src="/twitter-old-logo.png"
                alt="social-icon"
                height={50}
                width={40}
              />{" "}
            </Link>
            <Link href={profileData.data.socialUrls.instagram}>
              {" "}
              <Image
                className="mb-2 mr-5"
                src="/Instagram-logo.png"
                alt="social-icon"
                height={50}
                width={40}
              />{" "}
            </Link>
            <Link href={profileData.data.socialUrls.linkedin}>
              {" "}
              <Image
                className="mb-2 mr-5"
                src="/Linkedin-logo.png"
                alt="social-icon"
                height={50}
                width={40}
              />{" "}
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="py-4">
          <div className="flex justify-evenly cursor-pointer">
            {/* POSTS */}
            <div className="flex items-center gap-2">
              <Grip className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="text-xs sm:text-sm md:text-base">POSTS</span>
            </div>

            {/* TAG */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="text-xs sm:text-sm md:text-base">TAG</span>
            </div>

            {/* SAVED */}
            {/* <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="text-xs sm:text-sm md:text-base">SAVED</span>
            </div> */}
          </div>
        </div>

        <Separator />

        {/* Posts Section */}
        <div className="py-6">
          <div className="flex w-full justify-center">
            {/* <div>No Posts Available, start posting to see!!!</div>
             */}

            <ScrollArea
              className="h-full w-full pb-36"
              ref={scrollContainerRef}
              onScroll={handleScrollEvent}
            >
              <div className="flex flex-wrap w-full h-full gap-3">
                {videoData.length > 0 || !videoData ? (
                  videoData.map((item: videoData, index: number) => (
                    <ProfileItem
                      data={item}
                      key={index}
                      height={1000}
                      width={1000}
                      className="w-[100px] h-[200px] sm:w-[140px] sm:h-[300px] lg:w-[190px] lg:h-[380px]"
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
      </div>
    )
  );
};

export default ProfilePage;
