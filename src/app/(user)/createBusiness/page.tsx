"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "../home/components/header";
import { Sidebar } from "../home/components/sidebar";
import { BusinessForm } from "./components/business-form";

export default function BusinessPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex-1">
        <Header />
        {/* <div className="flex justify-center w-full"><SearchInputContainer/></div> */}
        <h1 className="text-3xl font-bold text-center mb-8">
          Business Registration
        </h1>
        <BusinessForm />

        {/* <Footer/> */}
      </div>
    </div>
  );
}


