"use client";

import { Metadata } from "next";
import React, { useEffect, useRef } from "react";
import { BrandHeader } from "./components/BrandPageBanner";
import { brandInfo, dummyCategoryData, posts, reviews } from "./data/mockdata";
import { PostCard } from "./components/post-card";
import { Footer } from "@/components/layout";
import SingleCategoryShorts from "./components/postSection";

export default function BrandPage({ params }: { params: any }) {


  // Fetch brand data (replace this with API call)
  //   const brandData = {
  //     name: brand,
  //     description: `This is the page for the brand ${brand}.`,
  //   };

  return (
    <main className="min-h-screen bg-gray-50">
      <BrandHeader info={brandInfo} />

      {/* product review section */}
      {/* <div className="container">
        <SingleCategoryShorts categoryData={dummyCategoryData} />
      </div> */}

      {/* post section */}

      <div className="container">
        <div className="text-black">Posts</div>
      </div>

      <Footer />
    </main>
  );
}

// export default BrandPage;
