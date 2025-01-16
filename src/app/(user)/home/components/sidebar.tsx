"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Library,
  Menu,
  Wallet,
  CircleEllipsis,
  UserRound,
  Bookmark,
  CircleHelp,
  CirclePlus,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBusinessPageList } from "@/apis/business";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const [businessPageData, setBusinessPageData] = useState<any[]>([]);
  const [isBusinessPageOpen, setIsBusinessPageOpen] = useState(false);

  useEffect(() => {
    const getBusinessPages = async () => {
      try {
        const res = await getBusinessPageList();
        setBusinessPageData(res.data.data || []);
      } catch (error) {
        console.error("Error fetching business pages", error);
      }
    };

    getBusinessPages();
  }, []);

  console.log("checking business Page data", businessPageData);

  const SidebarContent = () => (
    <ScrollArea className="h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            className="space-y-1 flex-col gap-12"
          >
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/home")}
            >
              <Home className="mr-2 h-4 w-4" />
              Reviews
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/post")}
            >
              {/* <Library className="mr-2 h-4 w-4" /> */}
              <CirclePlus
                size={32}
                absoluteStrokeWidth
                className="mr-2 h-4 w-4"
              />
              Post
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/bookmark")}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmarks
            </Button>
            {/* <Button variant="ghost" className="w-full justify-start">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button> */}
            {/* <Button variant="ghost" className="w-full justify-start">
              <CircleHelp className="mr-2 h-4 w-4" />
              FAQs
            </Button> */}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/profile")}
            >
              <UserRound className="mr-2 h-4 w-4" />
              My Profile
            </Button>

            {businessPageData.length > 0 && (
              <div>
                <button
                  onClick={() => setIsBusinessPageOpen(!isBusinessPageOpen)}
                  className="flex items-center justify-between w-full px-4 py-2"
                >
                  My Business Page
                  <span
                    className={`transform transition-transform duration-300 ${
                    isBusinessPageOpen ? "rotate-180" : "rotate-0" }`}
                  >
                    <ChevronDown/>
                  </span>
                </button>
                <div
                  className={`transition-[max-height] duration-500 overflow-hidden ${
                  isBusinessPageOpen ? "max-h-96" : "max-h-0" }`}
                >
                  <div className="pl-6 space-y-2">
                    {businessPageData.map((business) => (
                      <button
                        key={business._id}
                        onClick={() => router.push(`/${business.handle}`)}
                        className="block w-full text-left px-4 py-2 "
                      >
                        {business.businessName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* <Button variant="ghost" className="w-full justify-start">
              <CircleEllipsis className="mr-2 h-4 w-4" />
              More
            </Button> */}
          </div>
        </div>
        <Separator />
      </div>
    </ScrollArea>
  );

  return (
    <div className={`sidebar ${className}`}>
      <SidebarContent />
    </div>
  );
}
