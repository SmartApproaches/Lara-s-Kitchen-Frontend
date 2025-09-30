import React from "react";
import { IMAGES } from "../../../../constants";

const HerSection = () => {
  return (
    <div className="mx-auto h-fit w-full overflow-hidden md:min-h-screen md:bg-[#DBFFE6]">
      <div className="relative mx-auto h-[32rem] max-w-[100rem] md:min-h-screen">
        {/* Top left splash */}
        <div className="animate-slide-in-left absolute top-0 left-0">
          <img
            src={IMAGES.landingSplash}
            alt="landing splash"
            className="w-28 sm:w-36 md:w-52 lg:w-64"
          />
        </div>

        {/* Bottom right watermelon */}
        <div className="animate-slide-in-right absolute right-0 bottom-0">
          <img
            src={IMAGES.watermelonbg}
            alt="watermelon"
            className="w-72 md:w-80 lg:w-[28rem] xl:w-2xl"
          />
        </div>

        {/* Woman eating */}
        <div className="animate-zoom-in absolute right-6 bottom-0 sm:right-12">
          <img
            src={IMAGES.womanLandingPage}
            alt="woman eating"
            className="w-72 md:w-80 lg:w-[28rem] xl:w-2xl"
          />
        </div>

        {/* Hero heading */}
        <div className="animate-fade-in-up absolute top-1/4 left-6 sm:top-1/3 sm:left-12 md:left-20 md:max-w-xl">
          <h2 className="text-primary text-2xl leading-snug font-bold sm:text-3xl md:text-5xl">
            A True Taste of Nigeria,
            <span className="text-[#FFC107]"> Just for You</span>
          </h2>
          <p className="mt-2 text-sm text-[#0C4113] md:text-xl">
            We bring you the most delicious Nigerian dishes, served fresh in our restaurant or
            delivered straight to the comfort of your home.
          </p>
          <div className="animate-fade-in-down mt-4">
            <img
              src={IMAGES.scanToView}
              alt="scan to view"
              className="w-28 sm:w-36 md:w-52 lg:w-64"
            />
          </div>
        </div>

        {/* Cloud */}
        <div className="animate-slide-in-bottom absolute right-0 -bottom-20 left-0 sm:-bottom-32 md:-bottom-44">
          <img src={IMAGES.cloudimge} alt="cloud" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default HerSection;
