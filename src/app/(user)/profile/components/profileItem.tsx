import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MdDelete } from "react-icons/md";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import AllVideoCardItem from "../../search/components/search-allReviews-item";
import { ScrollBar } from "@/components/ui/scroll-area";
import { VideoData } from "./dataTypes";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteModal from "./deleteModal";

export interface videoProps extends React.HTMLAttributes<HTMLDivElement> {
  data: VideoData;
  width: number;
  height: number;
  aspectRatio: "portrait";
}

export default function ProfileItem({
  data,
  height,
  width,
  aspectRatio,
  className,
  ...props
}: videoProps) {
  const router = useRouter();
  console.log("data:::", data);
  return (
    <div className={cn(" relative h-full w-full p-0.5", className)} {...props}>
      <div
        className="overflow-hidden relative cursor-pointer h-full rounded-sm"
        onClick={() => router.push("/watch?v=" + data.videoId)}
      >
        <Image
          src={data.cdnThumbPath[0]}
          alt={data.title}
          width={width}
          height={height}
          className={
            "w-full h-full object-cover transition-all hover:scale-105"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/90" />

        <div className="absolute right-1 top-1">
          <DeleteModal />
        </div>

        <div className="flex-1 w-full absolute bottom-0 p-3">
          <p
            className={`font-semibold text-xs sm:text-sm text-md text-ellipsis overflow-hidden
              whitespace-nowrap text-pretty w-full h-5 hover:h-auto text-white cursor-pointer`}
          >
            {data.title}
          </p>

          <div className="flex items-center gap-1 sm:text-xs text-[8px] text-white/70">
            <span>{data.totalViewCount.toLocaleString()} views</span>
            <span>•</span>
            <span>{data.avgRating} ★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
