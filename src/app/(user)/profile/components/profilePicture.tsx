import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useRef, useState } from "react";
// import { useDropzone } from "react-dropzone";
import { ProfileDataProps } from "./dataTypes";
import { toast } from "sonner";
import { Pen, Share2Icon } from "lucide-react";
import { uploadProfileImage } from "@/apis/profile";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IoWarning } from "react-icons/io5";

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
    profileImage: string;
    SocialUrls: {
      whatsapp: string;
      linkedin: string;
      // facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  imageReload: (image: string) => void;
}

export default function EditProfilePicture({
  profileData,
  imageReload,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const handleCloseModal = () => {
    setWarning("");
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      // Boilerplate for API call to upload profile

      const formData = new FormData();

      formData.append("image", selectedFile);

      // Call API to upload the profile image
      let res = await uploadProfileImage(formData);

      if (res.message === "Success.") {
        imageReload(res.data.original);
      }

      // handleCloseModal();
    } else {
      alert("Please select a file.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(
      !["image/jpeg", "image/png", "image/jpg"].includes(file?.type || ""),
      (file?.size || 0) / 1048576,
    );
    if ((file?.size || 0) / 1048576 > 4) {
      setWarning("please upload image less than 5MB");
    } else if (
      !["image/jpeg", "image/png", "image/jpg"].includes(file?.type || "")
    ) {
      setWarning("please upload a png, jpeg, jpg file type");
    } else {
      setSelectedFile(file || null);
      setActive(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="w-8 h-8 rounded-full"
        >
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={() => handleCloseModal()}
      >
        <DialogHeader>
          <DialogTitle>Edit Profile Image</DialogTitle>
          <DialogDescription>
            Select image from your device to update profile image.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex flex-col items-center justify-center gap-4">
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2
              border-gray-200 shadow-md"
          >
            {selectedFile ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Profile Image"
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={profileData.profileImage}
                alt="Current Profile Image"
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          <Button
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => fileInputRef.current?.click()}
          >
            Select New Image
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {warning.length > 0 && (
            <Badge
              className="p-2 bg-orange-100 w-full shadow-none rounded-none text-orange-500 font-normal
                text-sm space-x-4 flex items-center justify-center"
            >
              <IoWarning className="h-6 w-6" />
              <span>{warning} </span>{" "}
            </Badge>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex justify-between w-full items-center">
              <Button
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                onClick={() => handleUpload()}
                disabled={!active}
              >
                Upload Image
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
