import React from "react";
import { IMAGES } from "../../../../constants";
import Lottie from "react-lottie-player";
import cravingAnimation from "../../../../../public/phoneAnimation.json";

const CravingNigeriaFood = () => {
  return (
    <section className="relative flex h-fit w-full items-center bg-white md:min-h-screen">
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Heading */}
          <h3 className="text-primary animate-fade-in-up text-2xl leading-snug font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            Craving Nigerian food?
          </h3>

          {/* Paragraph */}
          <p className="text-primary animate-fade-in-down mx-auto mt-5 max-w-xl text-base leading-snug font-medium sm:text-lg md:text-xl">
            It’s now easier than ever — scan in the restaurant, order for delivery, or even as a
            guest. No stress, just good food.
          </p>

          {/* Store Buttons */}
          <div className="animate-zoom-in relative z-10 mx-auto mt-8 flex justify-center gap-4 sm:mt-10">
            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps/details?id=org.laraskitchen&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={IMAGES.appStore}
                alt="Get it on Google Play"
                className="h-10 w-auto cursor-pointer transition-transform hover:scale-105 sm:h-12"
              />
            </a>

            {/* Apple Store */}
            <a
              href="https://apps.apple.com/us/app/laras-kitchen/id6753684107"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={IMAGES.playStore}
                alt="Download on the App Store"
                className="h-10 w-auto cursor-pointer transition-transform hover:scale-105 sm:h-12"
              />
            </a>
          </div>

          {/* Lottie Animation */}
          <div className="animate-slide-in-bottom pointer-events-none relative -mt-20 md:-mt-64">
            <Lottie
              loop
              play
              animationData={cravingAnimation}
              className="mx-auto w-full max-w-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CravingNigeriaFood;
