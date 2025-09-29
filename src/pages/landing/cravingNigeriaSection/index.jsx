import React from "react";
import { IMAGES } from "../../../constants";

const CravingNigeriaFood = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center bg-white">
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
          <div className="animate-zoom-in mx-auto mt-8 w-56 sm:mt-10 sm:w-72 md:w-80">
            <img src={IMAGES.PlayStoreApple} alt="playstore & apple download" className="w-full" />
          </div>

          {/* Phones Image */}
          <div className="animate-slide-in-bottom relative mt-10 sm:mt-12">
            <img
              src={IMAGES.phones}
              alt="phones preview"
              className="mx-auto -mt-6 w-full max-w-3xl sm:-mt-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CravingNigeriaFood;
