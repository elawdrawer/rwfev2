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

export function Header() {
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <header
      className="flex items-center justify-between px-4 h-16 border-b sticky top-0 bg-background
        z-50"
    >
      <div className="flex items-center gap-4">
        {/* <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button> */}
        <Sidebar />
      </div>

      <div
        className={"flex items-center w-full justify-center"}
      >
        <SearchInputContainer />
      </div>

      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserCircle2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
            onClick={()=> router.push('createBusiness')}
            >
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
  );
}
