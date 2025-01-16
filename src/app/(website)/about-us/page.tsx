"use client";
import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import bg1 from "../../../../public/company-terms/bg01.jpg";
import bg2 from "../../../../public/company-terms/medium-shot-young-people-with-reviews 1.png";
import bg3 from "../../../../public/company-terms/customer-experience-creative-collage 1.png";
import BlockImage1 from "../../../../public/company-terms/Vector.png";
import BlockImage2 from "../../../../public/company-terms/Vector_dark_2.svg";
import Background1 from "../../../../public/company-terms/background.png";
import Background2 from "../../../../public/company-terms/Frame 1000003324.png";
import BlockImage3 from "../../../../public/company-terms/Group 2.png";
import BlockImage4 from "../../../../public/company-terms/Group 3.png";
import BlockImage5 from "../../../../public/company-terms/Group 4.png";
import BlockImage6 from "../../../../public/company-terms/Group 5.png";
import BlockImage7 from "../../../../public/company-terms/Vector_dark.png";
import FeatImage1 from "../../../../public/company-terms/character.png";
import FeatImage2 from "../../../../public/company-terms/character-2.png";
import FeatImage3 from "../../../../public/company-terms/character-3.png";
import FeatImage4 from "../../../../public/company-terms/Mask group.png";
import FeatImage5 from "../../../../public/company-terms/Mask group2.png";
import { Header } from "@/components/layout";

export default function AboutUs() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false,
  };
  // const [newTheme, setNewTheme] = useState("light");

  // useEffect(() => {
  //   const currenTheme = localStorage.getItem("theme");
  //   setNewTheme(currenTheme ?? "light");
  // }, []);

  const RewardWaleTitleCard = () => {
    return (
      <div className="relative">
        <div className="max-w-3xl mx-auto text-center md:pb-16 flex flex-col justify-center">
          <h1
            className="mb-4 mt-4 lg:mt-0 md:text-violet-600 text-neutral-700 dark:text-stone-300
              md:text-4xl 2xl:text-[50px] font-bold md:font-semibold"
          >
            Why <span className="text-violet-600">Rewardwale</span> ?
          </h1>
          <p
            className="text-xs md:text-lg 2xl:text-xl font-normal mb-10 text-center text-neutral-700
              dark:text-stone-300"
          >
            The current product review system is broken and fraught with
            loopholes
          </p>
        </div>
      </div>
    );
  };

  interface InfoCardType {
    title: string;
    description: string;
    sideImage: any;
  }

  const InfoCard = (props: InfoCardType) => {
    return (
      <div className="">
        <div className="relative">
          <div
            className="md:w-96 md:h-60 2xl:h-80 2xl:w-[30rem] bg-white dark:bg-neutral-800 shadow
              rounded-3xl py-6 md:py-14 px-8 md:px-10"
          >
            <div className="flex-col justify-items-start gap-2 md:gap-5 flex">
              <h1 className="text-blue-950 dark:text-stone-50 text-sm md:text-lg 2xl:text-2xl font-bold">
                {props.title}
              </h1>
              <p
                className="text-zinc-700 dark:text-neutral-400 text-xs md:text-base 2xl:text-xl font-normal
                  2xl:tracking-normal 2xl:mt-4"
              >
                {props.description}
              </p>
            </div>
          </div>
          <div className="absolute -top-11 -left-11 md:top-[-105px] md:left-[-118px]">
            <Image src={props.sideImage} alt="image" className="max-md:w-24" />
          </div>
        </div>
      </div>
    );
  };

  const ReviewMatterCard = () => {
    return (
      <div className="py-4 md:my-16">
        <h1
          className="h1 mb-6 md:text-violet-600 text-neutral-700 dark:text-stone-300 md:text-4xl
            2xl:text-4xl text-center font-bold md:font-semibold"
        >
          Why Do{" "}
          <span className="text-violet-600 lg:text-neutral-700 dark:text-violet-600">
            Reviews
          </span>{" "}
          matter?
        </h1>
        <div className="flex items-center justify-between gap-3 px-2 md:px-8 lg:px-20">
          <div
            className="flex flex-col gap-3 md:gap-5 md:w-96 text-xs 2xl:w-full md:text-base 2xl:text-xl
              text-neutral-700 dark:text-stone-300"
          >
            <p>
              <span className="font-bold">8</span> in
              <span className="font-bold">10</span> shoppers use their
              smartphones to look up product reviews while in-store.
            </p>
            <p>
              <span className="font-bold">91%</span> individuals aged 18 to 34
              trust online reviews as much as personal recommendations.
            </p>
            <p>
              The average dissatisfied customer tells{" "}
              <span className="font-bold">9 to 15</span> people about a bad
              experience.
            </p>
            <p>
              Online reviews have gotten{" "}
              <span className="font-bold">65% shorter</span> in the past decade.
            </p>
          </div>
          <div>
            <Image src={FeatImage1} alt="image" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 overflow-hidden">
      <Header />

      {/* <Slider {...settings}>
        {[
          {
            title: "Desh ka review platform",
            desc: "Your go-to app for sharing and discovering video reviews.What’s more? we make shopping decisions easier and reviews more rewarding",
            image: bg1,
          },
          {
            title: "Share your Video Reviews",
            desc: "RewardWale is a platform that allows customers across India to share their product/ service reviews through concise video content ranging from 16 seconds to 2 minutes.",
            image: bg2,
          },
          {
            title: "Brand Connect - Direct",
            desc: "Fostering transparency by enabling merchants to respond directly to feedback and reviews",
            image: bg3,
          },
        ].map((item, index) => (
          <section className="relative" key={index}>
            <Image
              src={item.image}
              alt="banner"
              // width={1500}
              // height={1500}
              className="bg-center bg-cover w-full"
            />

            <div
              className="mx-auto px-4 sm:px-6 absolute left-0 right-0 -bottom-36 sm:-bottom-8
                md:-bottom-10 lg:bottom-16 xl:bottom-20 2xl:bottom-40 mt-80 max-sm:hidden w-4/5"
            >
              <div className="z-40 mt-10 bg-gradient-to-r p-8 from-[#C84AD6] to-[#6F3CE3CC] rounded-lg">
                <div className="text-center justify-center items-center flex flex-col gap-4 max-md:gap-2">
                  <h1
                    className="text-white text-sm sm:text-2xl md:text-3xl xl:text-5xl lg:text-2xl 2xl:text-7xl
                      font-semibold font-['Nunito']"
                  >
                    {item.title}
                  </h1>
                  <p
                    className="text-white text-xs sm:text-sm md:text-lg xl:text-xl lg:text-xl 2xl:text-4xl
                      font-medium text-center"
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </Slider> */}
      <div className="relative">
        <div className="absolute lg:-top-24 2xl:-top-44 left-0 right-0 w-full">
          <Image
            src={BlockImage1}
            alt="vectors"
            className="w-full object-cover hidden lg:block"
          />
        </div>
      </div>

      <section className="relative">
        <div className="max-w-6xl mx-auto sm:px-6 px-4 h-full">
          <RewardWaleTitleCard />
          <div className="flex flex-wrap gap-10 justify-center">
            {/* <InfoCard
                title={"Scattered Review Market"}
                description={
                  "Review information is scattered, with written reviews on" +
                  "Google and video reviews mainly on YouTube, creating a" +
                  "disjointed landscape"
                }
                sideImage={BlockImage2}
              /> */}
            <InfoCard
              title={" No Dedicated Platform"}
              description={
                " Existing platforms lack a specific focus on video reviews."
              }
              sideImage={BlockImage3}
            />
            <InfoCard
              title={"Lack of User Incentives"}
              description={
                "Users are not motivated to post reviews on a centralized platform."
              }
              sideImage={BlockImage4}
            />
            <InfoCard
              title={" Lack of trust and feedback loop"}
              description={`Existing review platforms often struggle with a lack of
                      trust among users, compounded by an ineffective feedback
                      loop that limits their overall impact.`}
              sideImage={BlockImage5}
            />
            <InfoCard
              title={"Limited Buyer-Seller Connection"}
              description={`Absence of direct links between buyers and sellers hampers
                      real-time information access.`}
              sideImage={BlockImage6}
            />
          </div>
          <div className="flex justify-center items-center">
            <ReviewMatterCard />
          </div>

          <div className="flex justify-center items-center">
            <div
              className="flex items-center justify-between gap-4 px-4 md:px-28 py-4 md:py-10
                bg-purple-300 rounded-xl max-md:my-6 lg:m-12"
            >
              <div>
                <Image src={FeatImage2} alt="image" className="w-60" />
              </div>
              <div
                className="flex flex-col gap-5 text-xs md:text-base 2xl:text-2xl tracking-wide
                  2xl:tracking-tight 2xl:w-2/3"
              >
                <p>
                  Featuring reviews can increase a retail businesses conversion
                  rate by <span className="font-bold">270%</span>
                   -Spiegel Research Center
                </p>
                <p>
                  <span className="font-bold">95%</span> of customers read
                  online reviews before buying a product
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg shadow-violet-200
                dark:shadow-black my-12 lg:mx-12 p-7 md:block"
            >
              <h1 className="h1 mb-4 text-violet-600 md:text-4xl 2xl:text-4xl text-center font-semibold">
                Why Short Video format?
              </h1>

              <div className="flex items-center justify-between mx-10">
                <div
                  className="flex flex-col gap-5 text-xs md:text-base 2xl:text-xl 2xl:w-2/3 tracking-wide
                    text-neutral-700 dark:text-stone-300"
                >
                  <p>
                    According to sources from Inc24, Cisco, Statista and
                    Redseer, 96% global social media users watch videos lasting
                    &gt; 4 mins
                  </p>

                  <p>
                    Attention span of millenials has declined to 12 seconds and
                    Genz to 8 seconds
                  </p>
                  <p>
                    In India, short-form video platforms are projected to
                    constitute 40% of the $8–11 billion video commerce industry
                    by 2030.
                  </p>
                  <p>
                    Short video platform per session time for Tiktok is 45
                    minutes and Instagram is 53 minutes
                  </p>
                </div>
                <div className="hidden md:inline-block sm:block">
                  <Image src={FeatImage3} alt="image" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:my-12 lg:mx-12 2xl:mx-0 md:py-7 lg:px-7 max-md:pb-3">
            <div className="bg-purple-300 rounded-2xl relative">
              <div className="flex flex-col justify-center md:w-96 2xl:w-4/5 py-6 md:py-10 px-5">
                <h2 className="text-white text-xs md:text-2xl font-extrabold">
                  Our
                </h2>
                <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                  <h1 className="text-violet-600 md:text-3xl 2xl:text-3xl font-extrabold">
                    Vision
                  </h1>
                  <p className="text-xs md:text-base md:text-balance 2xl:text-2xl">
                    To build powerful connections between businesses and people
                    by empowering authentic feedback and transforming engagement
                    into actionable business insights.
                  </p>
                </div>
              </div>

              <div className="absolute top-0 2xl:right-0">
                <Image src={FeatImage5} alt="image" />
              </div>
            </div>
            <div className="bg-purple-300 rounded-2xl relative">
              <div className="flex flex-col justify-center md:w-96 2xl:w-4/5 py-6 md:py-10 px-5">
                <h2 className="text-white text-xs md:text-2xl font-extrabold">
                  Our
                </h2>
                <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                  <h1 className="text-violet-600 md:text-4xl 2xl:text-3xl font-extrabold">
                    Mission
                  </h1>
                  <p className="text-xs md:text-base 2xl:text-2xl">
                    To create a transparent future by fostering engagement,
                    loyalty and trust between customers and businesses
                  </p>
                </div>
              </div>

              <div className="absolute top-0 2xl:right-0">
                <Image src={FeatImage4} alt="image" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
