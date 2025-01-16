"use client";
import { Suspense } from "react";
import { Sidebar } from "../home/components/sidebar";
import { ReviewForm } from "../post/components/ReviewForm";
import SearchInputContainer from "../search/components/search-Input-component";
import { Header } from "../home/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "next/navigation";

export default function HomePage() {


  const isMobie = useIsMobile();
  return (
    <div className="flex h-screen bg-background">
      {!isMobie && <Sidebar />}
      <div className="flex-1 overflow-hidden">
        {/* <div className="flex justify-center w-full pt-4"><SearchInputContainer/></div>
      //  */}
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <main
            className="min-h-screen bg-gradient-to-b from-background to-secondary p-8 h-full
              overflow-scroll scrollbar-hide"
          >
            <div className="max-w-7xl mx-auto">
              <ReviewForm />
            </div>
          </main>
        </Suspense>
      </div>
    </div>
  );
}
