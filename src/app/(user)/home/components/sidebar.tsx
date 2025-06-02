"use client";

import { cn, isUserLoggedIn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Menu,
  UserRound,
  Bookmark,
  CirclePlus,
  ChevronDown,
  Building2,
  History,
  CreditCard,
  Watch,
  HistoryIcon,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBusinessPageList } from "@/apis/business";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const [businessPageData, setBusinessPageData] = useState<any[]>([]);
  const [isBusinessPageOpen, setIsBusinessPageOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("sidebarCollapsed");
      return storedValue ? JSON.parse(storedValue) : true; // Default to true (collapsed)
    }
    return true;
  });
  const [isHovered, setIsHovered] = useState(false);
  const isLoggedIn = isUserLoggedIn();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const getBusinessPages = async () => {
      try {
        const res = await getBusinessPageList();
        setBusinessPageData(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching business pages", error);
      }
    };

    getBusinessPages();
  }, [isLoggedIn]);

  const NavButton = ({
    icon: Icon,
    label,
    onClick,
    forceExpanded = false,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    forceExpanded?: boolean;
  }) => {
    const shouldShowCollapsed = isCollapsed && !isHovered && !forceExpanded;

    if (shouldShowCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={onClick}
              >
                <Icon
                  className="h-4 w-4"
                  style={{ width: "24px", height: "24px" }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={onClick}
      >
        <Icon
          className="mr-2 h-4 w-4"
          style={{ width: "24px", height: "24px" }}
        />
        {label}
      </Button>
    );
  };

  const SidebarContent = ({
    forceExpanded = false,
  }: {
    forceExpanded?: boolean;
  }) => (
    <ScrollArea className="h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {!isMobile && (
            <div className="flex justify-start mb-4 ml-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8"
              >
                <Menu
                  className="h-8 w-8"
                  style={{ width: "24px", height: "24px" }}
                />
              </Button>
            </div>
          )}
          <div
            className="space-y-4"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <NavButton
              icon={Home}
              label="Reviews"
              onClick={() => router.push("/home")}
              forceExpanded={forceExpanded}
            />
            <NavButton
              icon={CirclePlus}
              label="Post"
              onClick={() => router.push("/post")}
              forceExpanded={forceExpanded}
            />
            <NavButton
              icon={Bookmark}
              label="Bookmarks"
              onClick={() => router.push("/bookmark")}
              forceExpanded={forceExpanded}
            />
            <NavButton
              icon={UserRound}
              label="My Profile"
              onClick={() => router.push("/profile")}
              forceExpanded={forceExpanded}
            />
            <NavButton
              icon={HistoryIcon}
              label="History"
              onClick={() => router.push("/history")}
              forceExpanded={forceExpanded}
            />
            <NavButton
              icon={ThumbsUp}
              label="Likes"
              onClick={() => router.push("/likes")}
              forceExpanded={forceExpanded}
            />
            {/* <NavButton
              icon={CreditCard}
              label="Pricing"
              onClick={() => router.push("/pricing")}
            />  */}

            {businessPageData.length > 0 &&
              (!isCollapsed || isHovered || forceExpanded) && (
                <div>
                  <button
                    onClick={() => setIsBusinessPageOpen(!isBusinessPageOpen)}
                    className="flex items-center justify-between w-full px-4 py-2"
                  >
                    My Business Page
                    <span
                      className={`transform transition-transform duration-100 ${
                      isBusinessPageOpen ? "rotate-180" : "rotate-0" }`}
                    >
                      <ChevronDown />
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
                          className="block w-full text-left px-4 py-2 hover:bg-accent"
                        >
                          {business.businessName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {businessPageData.length > 0 &&
              isCollapsed &&
              !isHovered &&
              !forceExpanded && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        onClick={() =>
                          isCollapsed
                            ? setIsCollapsed(false)
                            : setIsCollapsed(true)
                        }
                      >
                        <Building2
                          className="h-4 w-4"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      My Business Pages
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
          </div>
        </div>
        <Separator />
      </div>
    </ScrollArea>
  );

  return (
    isLoggedIn && (
      <>
        <aside
          className={cn(
            "pb-12 hidden md:block transition-all duration-300",
            isMobile ? "w-16" : isCollapsed && !isHovered ? "w-16" : "w-64",
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <SidebarContent />
        </aside>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent forceExpanded={true} />
          </SheetContent>
        </Sheet>
      </>
    )
  );
}
