import Image from "next/image";
import Link from "next/link";
import { ProfileDataProps } from "./dataTypes";

interface Props {
  profileData: {
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
    SocialUrls: {
      whatsapp: string;
      linkedin: string;
      // facebook: string;
      instagram: string;
      twitter: string;
    };
  };
}

export default function SocialMedia({ profileData }: Props) {
  console.log("checking profileData", profileData.SocialUrls);

  return (
    <div className=" flex sm:flex-col px-4 sm:ms-4 sm:mt-1 items-center justify-center">
      {profileData.SocialUrls?.whatsapp.length !== 0 && (
        <Link href={profileData.SocialUrls?.whatsapp.trim()}>
          <Image
            className="mb-2 mr-5 w-8 h-8 sm:w-12 sm:h-12"
            src="/whatsApp-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.SocialUrls?.twitter.length !== 0 && (
        <Link href={profileData.SocialUrls?.twitter}>
          <Image
            className="mb-2 mr-5 w-8 h-8 sm:w-12 sm:h-12"
            src="/twitter-old-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.SocialUrls?.instagram.length !== 0 && (
        <Link href={profileData.SocialUrls?.instagram}>
          {" "}
          <Image
            className="mb-2 mr-5 w-8 h-8 sm:w-12 sm:h-12"
            src="/Instagram-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.SocialUrls?.linkedin.length !== 0 && (
        <Link href={profileData.SocialUrls?.linkedin}>
          {" "}
          <Image
            className="mb-2 mr-5 w-8 h-8 sm:w-12 sm:h-12"
            src="/Linkedin-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}
    </div>
  );
}
