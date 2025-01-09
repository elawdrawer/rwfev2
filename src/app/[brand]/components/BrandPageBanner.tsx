import Image from "next/image";
import styles from "./BrandPageBanner.module.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Pencil, PhoneCall, Share2, Star, StarHalf } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandInfo } from "../types/brands";
import { animateFollow } from "@/lib/animation";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveImages from "@/components/responsiveImages/images.component";
import WhatsappLogo from "../../../../public/whatsApp-logo.png";
import {
  followMerchant,
  unFollowMerchant,
  uploadBusinessBanner,
  uploadBusinessProfile,
} from "@/apis/business";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BusinessModal } from "./BusinessModal";
import useIsOwner from "@/hooks/use-owner";

export function BrandHeader({ info }: { info: BrandInfo }) {
  const followButtonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFollowed, setIsFollowed] = useState(info?.isFollow);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // const [isOwner, setIsOwner] = useState(false);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockData = {
    _id: "677d5c17f10ff888fd2440e2",
    custId: "677d5c17f10ff888fd2440e3",
    businessName: "breakfast.ai",
    contactUsDetails: {
      indCountryCode: "+91",
      indMobileNum: "8210317882",
      indEmail: "test@gamil.com",
    },
    operationalHours: {
      monday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440e6" },
      ],
      tuesday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440e7" },
      ],
      wednesday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440e8" },
      ],
      thursday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440e9" },
      ],
      friday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440ea" },
      ],
      saturday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440eb" },
      ],
      sunday: [
        { open: "09:00", close: "17:00", _id: "677d5c17f10ff888fd2440ec" },
      ],
    },
    handle: "breakfast.ai",
    title: "breakfast server with ai",
    desc: "breakfastbreakfastbreakfastbreakfast",
    websiteURLs: "",
    location: "Bannerghatta Road, Bengaluru, Karnataka, India",
    locationCoordinates: {
      type: "Point",
      coordinates: [77.6019453, 12.9380513],
    },
    socialUrls: {
      whatsapp: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
    status: "Pending",
    avgRating: 0,
    totalRating: 0,
    defaultBusinessBanner: {
      original:
        "https://d1scqik6tlhrr8.cloudfront.net/profile-pic/businessPage/677d5c17f10ff888fd2440e2/IMG/original/WhatsAppImage2024-11-25at15.jpg",
      thumbnail:
        "https://d1scqik6tlhrr8.cloudfront.net/profile-pic/businessPage/677d5c17f10ff888fd2440e2/IMG/thumbnail/WhatsAppImage2024-11-25at15.jpg",
      _id: "1",
    },
    defaultBusinessImage: {
      original:
        "https://d1scqik6tlhrr8.cloudfront.net/profile-pic/businessPage/677d5c17f10ff888fd2440e2/IMG/original/naradBhakti.jpg",
      thumbnail:
        "https://d1scqik6tlhrr8.cloudfront.net/profile-pic/businessPage/677d5c17f10ff888fd2440e2/IMG/thumbnail/naradBhakti.jpg",
      _id: "2",
    },
    businessBanners: [],
    businessImages: [
      {
        original:
          "https://d1scqik6tlhrr8.cloudfront.net/profile-pic/businessPage/677d5c17f10ff888fd2440e2/IMG/original/Screenshot2024-11-15203330.png",
        thumbnail:
          "https://d1scqik6tlhrr8.cloudfront.net/profile-pic/businessPage/677d5c17f10ff888fd2440e2/IMG/thumbnail/Screenshot2024-11-15203330.png",
        _id: "3",
      },
    ],
  };

  const isOwner = useIsOwner(info.businessPageOwner);


  console.log("checking isOwner", isOwner);

  const handleFollow = async () => {
    try {
      if (!isFollowed) {
        let res = await followMerchant(info.Id);
        if (res) {
          setIsFollowed(!isFollowed);
        } else {
          // console.log("checking res of follow", res);
          setIsFollowed(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (isFollowed) {
        await unFollowMerchant(info.Id); // Call the API to unfollow the user
        setIsFollowed(false); // Update the state to reflect that the user is no longer followed
      }
    } catch (error) {
      console.error("Error unfollowing user:", error); // Handle any errors
    }
  };

  const handleLogoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBannerModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleBannerFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setSelectedBannerFile(file || null);
  };

  const handleUpload = async (id: string) => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);

      // Boilerplate for API call to upload logo
      const formData = new FormData();
      formData.append("image", selectedFile);

      // Call API to upload the logo
      let res = await uploadBusinessProfile(id, formData);
      if (res.message === "Success.") {
        toast.success("Logo updated");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      console.log("checking res of upload", res.message === "Success.");
      // alert("Logo uploaded successfully!");
      handleCloseModal();
    } else if (selectedBannerFile) {
      console.log("Uploading file:", selectedBannerFile);

      // Boilerplate for API call to upload logo
      const formData = new FormData();
      formData.append("image", selectedBannerFile);

      // Call API to upload the logo
      let res = await uploadBusinessBanner(id, formData);
      if (res.message === "Success.") {
        toast.success("Banner updated");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      console.log("checking res of upload", res.message === "Success.");
      // alert("Logo uploaded successfully!");
      handleCloseModal();
    } else {
      alert("Please select a file.");
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <StarHalf
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else {
            return <Star key={index} className="w-4 h-4 text-gray-300" />;
          }
        })}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this video",
          text: "I found this interesting video. Take a look!",
          url: window.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.log("Error sharing content:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log("Web Share API not supported");
      // You can implement a custom share dialog here
      alert(
        "Sharing is not supported on this browser. You can copy the URL to share.",
      );
    }
  };

  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <div className="relative w-full">
      <div
        className="w-full h-[400px] relative bg-gradient-to-b from-gray-200 to-white"
        style={{
          backgroundImage: info?.banner
            ? `url(${info.banner})`
            : 'url("m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/090833d5-7b09-4745-9d2d-3f4d31a035c1._CR0%2C0%2C3000%2C600_SX1920_.png")', // Fallback background
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOwner && (
          <div className="absolute bottom-0 top-2 right-3 cursor-pointer">
            <Pencil
              size={isMobile ? 28 : 38}
              strokeWidth={1.5}
              color="black"
              onClick={() => setIsBannerModalOpen(true)}
            />
          </div>
        )}
        {!isMobile ? (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-6">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="bg-white"
                  style={{
                    borderRadius: "50%",
                    minWidth: "70px",
                    width: "120px",
                    height: "120px",
                    display: "flex",
                    alignContent: "center",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  onClick={handleLogoClick}
                >
                  <ResponsiveImages
                    imageSrc={info?.logo}
                    objectFitProp="contain"
                    layout="fixed"
                    classname="circularImage"
                    width={isMobile ? 70 : 120}
                    height={isMobile ? 70 : 120}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-black">
                      {info.name}
                    </h1>
                    {/* {info.isVerified && (
                    <Badge variant="secondary">Verified Brand</Badge>
                  )} */}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-300">
                        Rating:
                      </span>
                      <StarRating rating={info.rating} />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Rank:</span>
                      {/* <span>#{info.rank}</span> */}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="cursor-pointer absolute"
                  style={{
                    top: "-220%",
                    right: "3%",
                  }}
                >
                  <PhoneCall size={36} />
                </div>
                <div
                  className="cursor-pointer absolute"
                  style={{
                    top: "-180%",
                    right: "3%",
                  }}
                >
                  <Image
                    src={WhatsappLogo}
                    alt="social-icon"
                    height={40}
                    width={36}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button onClick={() => setIsDetailsModalOpen(true)}>
                  More Details
                </Button>
                {isOwner && (
                  <Button
                    onClick={() =>
                      router.push(`/post?data=${encodeURIComponent(info.Id)}`)
                    }
                  >
                    Post Review
                  </Button>
                )}
                <Button
                  ref={followButtonRef}
                  onClick={isFollowed ? handleUnfollow : handleFollow}
                  className="px-6"
                >
                  {isFollowed ? "UnFollow" : "Follow"}
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              paddingTop: "40px",
            }}
          >
            {/* <div> */}
            <div
              className="bg-white"
              style={{
                borderRadius: "50%",
                minWidth: "70px",
                width: "70px",
                height: "70px",
                display: "flex",
                alignContent: "center",
                padding: "5px",
                cursor: "pointer",
              }}
              onClick={handleLogoClick}
            >
              <ResponsiveImages
                imageSrc={info?.logo}
                objectFitProp="contain"
                layout="fixed"
                classname="circularImage"
                width={70}
                height={70}
              />
            </div>
            {/* </div> */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-black">{info.name}</h1>
                {/* {info.isVerified && (
                    <Badge variant="secondary">Verified Brand</Badge>
                  )} */}
              </div>
            </div>
            <div>
              <Button
                ref={followButtonRef}
                onClick={isFollowed ? handleUnfollow : handleFollow}
                className="px-6"
              >
                {isFollowed ? "UnFollow" : "Follow"}
              </Button>
            </div>
            <div className="flex gap-5">
              <Button onClick={() => setIsDetailsModalOpen(true)}>
                More Details
              </Button>
              <Button
                onClick={() =>
                  router.push(`/post?data=${encodeURIComponent(info.Id)}`)
                }
              >
                Post Review
              </Button>
            </div>
            {/* <div>5</div>
            <div>6</div> */}
          </div>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && isOwner &&(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Change Logo
              </h2>
              <p className="text-gray-500 text-sm">
                Upload a new logo to update your brand identity.
              </p>
            </div>

            {/* Preview Section */}
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2
                  border-gray-200 shadow-md"
              >
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={info?.logo}
                    alt="Current logo"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>

              <button
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                Select New Image
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {/* Upload and Cancel Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                onClick={() => handleUpload(info.Id)}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Change Background
              </h2>
              <p className="text-gray-500 text-sm">
                Upload a new Banner to update your brand identity.
              </p>
            </div>

            {/* Preview Section */}
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2
                  border-gray-200 shadow-md"
              >
                {selectedBannerFile ? (
                  <img
                    src={URL.createObjectURL(selectedBannerFile)}
                    alt="Selected logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={info?.banner}
                    alt="Current logo"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>

              <button
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                Select New Image
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleBannerFileChange}
              />
            </div>

            {/* Upload and Cancel Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                onClick={() => handleUpload(info.Id)}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
      <BusinessModal
        business={mockData}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}
