"use client";

import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BusinessDetailsDialog from "./BusinessDetailsDialog";
import { useRouter } from "next/navigation";
import { BusinessPage } from "../types/brands";
import useIsOwner from "@/hooks/use-owner";
import {
  editBusiness,
  followMerchant,
  unFollowMerchant,
  uploadBusinessBanner,
  uploadBusinessProfile,
} from "@/apis/business";
import { toast } from "sonner";
import { EditBusinessDialog } from "./EditBusinessDialog";
import { Pencil, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BusinessHeaderProps {
  business: BusinessPage;
}

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState<boolean>(business.isFollow);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isFollowed, setIsFollowed] = useState(business?.isFollow);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const isOwner = useIsOwner(business.businessPageOwner);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  const handleLogoClick = () => {
    if (isOwner) {
      setIsModalOpen(true);
    } else {
      setZoomedImage(business.defaultBusinessImage.original);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleClaimPage = () => {
    router.push("/contact-us");
  };

  const handleEditSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        keywords: data.keywords || [],
        content: data.content || {},
        websiteURLs:
          Array.isArray(data.websiteURLs) && data.websiteURLs.length > 0
            ? data.websiteURLs[0]
            : "",
      };

      const response = await editBusiness(business.handle, formattedData);
      console.log("checking response fo edit business", data);
      if (response.message === "Success.") {
        toast.success("Business details updated successfully");
        setIsEditModalOpen(false);
      } else {
        toast.error("Failed to update business details");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business details");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBannerModalOpen(false);
    setSelectedFile(null);
  };

  // Check if the business is currently open
  const getCurrentDayHours = () => {
    const days: DayOfWeek[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    return business.operationalHours[today][0];
  };

  const isBusinessOpen = () => {
    const hours = getCurrentDayHours();
    if (!hours.isOpen) return false;

    const now = new Date();
    const [openHour, openMinute] = hours.open.split(":").map(Number);
    const [closeHour, closeMinute] = hours.close.split(":").map(Number);

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTime = currentHour * 60 + currentMinute;
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const handleFollow = async () => {
    setIsAnimating(true);
    setIsFollowing(!isFollowing);
    setTimeout(() => setIsAnimating(false), 300);
    try {
      if (!isFollowed) {
        let res = await followMerchant(business._id);
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
    setIsAnimating(true);
    setIsFollowing(!isFollowing);
    setTimeout(() => setIsAnimating(false), 300);
    try {
      if (isFollowed) {
        await unFollowMerchant(business._id); // Call the API to unfollow the user
        setIsFollowed(false); // Update the state to reflect that the user is no longer followed
      }
    } catch (error) {
      console.error("Error unfollowing user:", error); // Handle any errors
    }
  };

  const handleBannerFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setSelectedBannerFile(file || null);
  };

  const handleUpload = async (id: string) => {
    if (selectedFile) {
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
      // alert("Logo uploaded successfully!");
      handleCloseModal();
    } else if (selectedBannerFile) {
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
      // alert("Logo uploaded successfully!");
      handleCloseModal();
    } else {
      alert("Please select a file.");
    }
  };

  return (
    <div className="relative w-full">
      {/* Banner Image */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-b-lg">
        <img
          src={business.defaultBusinessBanner.original}
          alt={business.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

        {/* Claim Page Button - Only show if not verified */}
        {!business.isVerified && (
          <Button
            onClick={handleClaimPage}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-900
              dark:text-white hover:bg-white dark:hover:bg-gray-700 rounded-full shadow-lg
              backdrop-blur-sm"
          >
            Claim Your Page
          </Button>
        )}
        {isOwner && (
          <div className="absolute bottom-0 top-12 right-3 cursor-pointer">
            <Pencil
              size={isMobile ? 28 : 38}
              strokeWidth={1.5}
              color="black"
              onClick={() => setIsBannerModalOpen(true)}
            />
          </div>
        )}
      </div>

      {zoomedImage && (
        <Dialog
          open={!!zoomedImage}
          onOpenChange={(open) => {
            if (!open) setZoomedImage(null);
          }}
        >
          <DialogContent className="max-w-[45vw] max-h-[45vh] p-0 overflow-hidden">
            <img
              src={zoomedImage}
              alt={`Zoomed ${business.businessName} logo`}
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Business business */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 z-10">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-6">
          <div className="flex flex-col items-center text-center">
            <div
              className="rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg -mt-16 mb-4 cursor-pointer"
              onClick={handleLogoClick}
            >
              <img
                src={business.defaultBusinessImage.original}
                alt={business.businessName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-1 dark:text-white">
              {business.businessName}
            </h1>
            <p className="text-xl md:text-xl font-bold mb-1 dark:text-white">
              {business.title}
            </p>

            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-1 text-sm rounded-full ${
                  isBusinessOpen()
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                  }`}
              >
                {isBusinessOpen() ? "Open Now" : "Closed"}
              </span>
              <span className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="dark:text-gray-300">
                  {business.avgRating || "New"}
                </span>
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {business.location}
            </p>

            <div className="flex items-center gap-4 mb-2">
              <a
                href={`tel:${business.contactUsDetails.indCountryCode}${business.contactUsDetails.indMobileNum}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {business.contactUsDetails.indCountryCode}{" "}
                {business.contactUsDetails.indMobileNum}
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href={`mailto:${business.contactUsDetails.indEmail}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {business.contactUsDetails.indEmail}
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-3 mb-6">
              {/* Social media buttons remain unchanged as they have their own brand colors */}
              {business.socialUrls.whatsapp && (
                <a
                  href={
                    business.socialUrls.whatsapp.startsWith("http")
                      ? business.socialUrls.whatsapp
                      : `https://${business.socialUrls.whatsapp}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white
                    hover:bg-green-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
              {business.socialUrls.instagram && (
                <a
                  href={business.socialUrls.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r
                    from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90
                    transition-opacity"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {business.socialUrls.facebook && (
                <a
                  href={business.socialUrls.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white
                    hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: `${!isMobile ? "row" : "column"}`,
                gap: "20px",
              }}
            >
              <div className="flex gap-3">
                {isOwner && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="rounded-full lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100
                    dark:hover:bg-gray-700"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {!isOwner && (
                  <Button
                    variant={isFollowing ? "default" : "outline"}
                    className={`rounded-full transition-all duration-300 ${
                    isAnimating ? "scale-95" : "scale-100" } ${
                    isFollowing
                        ? `bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800
                          dark:hover:bg-gray-100`
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={isFollowed ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100
                        dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      More Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[90vh] overflow-hidden p-0">
                    <BusinessDetailsDialog business={business} />
                  </DialogContent>
                </Dialog>
              </div>

              {isOwner && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/post?data=${encodeURIComponent(business._id)}`,
                    )
                  }
                  className="rounded-full lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                >
                  Post Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && isOwner && (
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
                    src={business?.logo}
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
                onClick={() => handleUpload(business._id)}
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
                    src={business?.banner}
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
                onClick={() => handleUpload(business._id)}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
      <EditBusinessDialog
        business={business}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default BusinessHeader;
