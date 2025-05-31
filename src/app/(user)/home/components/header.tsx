"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Bell,
  UserCircle2,
  Upload,
  Settings,
  LogOut,
  SearchIcon,
  Handshake,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import SearchInputContainer from "../../search/components/search-Input-component";
import { useIsMobile } from "@/hooks/use-mobile";
import { logout } from "@/apis/home";
import { isUserLoggedIn } from "@/lib/utils";

import whiteLogo from "../../../../../public/brand_logo/PNG/RW_White_Name.png";
import blackLogo from "../../../../../public/brand_logo/PNG/RW_Black_Name.png";

import Image from "next/image";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

export function Header() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const isLoggedIn = isUserLoggedIn();

  const userDataString = localStorage.getItem("uib");
  // const userData = JSON.parse(userDataString);
  // const userId = userData._id;
  console.log(JSON.parse(userDataString || "")._id,"userDataString");

  return (
    isLoggedIn && (
      <header
        className="flex items-center justify-between px-4 h-16 sticky top-0 bg-background z-50"
        style={{
          paddingTop: "12px",
          paddingBottom: "12px",
          // marginBlockEnd: "8px",
        }}
      >
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button> */}
          {isMobile && <Sidebar />}
        </div>
        <div
          onClick={() => router.push("/")}
          onKeyUp={(e) => {
            if (e.key === "Enter") router.push("/");
          }}
          tabIndex={0}
          role="button"
        >
          <Image
            alt="Rewardwale"
            src={whiteLogo}
            className="w-[160px] hidden dark:inline"
          />
          <Image
            alt="Rewardwale"
            src={blackLogo}
            className="w-[160px] inline dark:hidden"
          />
        </div>
        <div className={"flex items-center w-full justify-center"}>
          <SearchInputContainer />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center space-x-4">
            <ThemeModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle2 className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => router.push("createBusiness")}>
                <Handshake className="mr-2 h-4 w-4" />
                Create Business Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  localStorage.removeItem("uib");
                  localStorage.removeItem("token");
                  router.push("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    )
  );
}
