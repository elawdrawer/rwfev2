import Image from "next/image";
import Link from "next/link";
import { ProfileDataProps } from "./dataTypes";

interface Props {
  profileData: ProfileDataProps;
}

export default function SocialMedia({ profileData }: Props) {
  console.log("checking profileData", profileData.socialUrls?.whatsapp.length);

  return (
    <div className="social-icons flex sm:flex-col ms-4 mt-1 items-center justify-center sm:mt-0">
      {profileData.socialUrls?.whatsapp.length !== 0 && (
        <Link href={profileData.socialUrls?.whatsapp.trim()}>
          <Image
            className="mb-2 mr-5"
            src="/whatsApp-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.socialUrls?.twitter.length !== 0 && (
        <Link href={profileData.socialUrls?.twitter}>
          <Image
            className="mb-2 mr-5"
            src="/twitter-old-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.socialUrls?.instagram.length !== 0 && (
        <Link href={profileData.socialUrls?.instagram}>
          {" "}
          <Image
            className="mb-2 mr-5"
            src="/Instagram-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.socialUrls?.linkedin.length !== 0 && (
        <Link href={profileData.socialUrls?.linkedin}>
          {" "}
          <Image
            className="mb-2 mr-5"
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
