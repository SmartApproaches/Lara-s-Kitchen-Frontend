import React from "react";
import { ICONS, IMAGES } from "../../../../constants";
import { StarFilled } from "@ant-design/icons";

const MenuHero = () => {
  return (
    <div className="mx-auto h-fit w-full overflow-hidden md:min-h-screen">
      {/* Desktop / Web Layout */}
      <div className="relative mx-auto hidden h-[32rem] max-w-[100rem] items-center md:flex md:min-h-screen">
        <div className="animate-slide-in-right absolute top-0 right-0 hidden md:block">
          <img src={IMAGES.menuPolyGon} alt="menu polygon" className="md:w-lg 2xl:w-2xl" />
        </div>
        <div className="animate-slide-in-right absolute top-0 right-0 hidden md:block">
          <img src={IMAGES.menuTrasperent} alt="menuTrasperent" className="md:w-lg xl:w-2xl" />
        </div>
        <div className="animate-slide-in-right absolute top-20 right-10 hidden md:block 2xl:right-24">
          <img src={ICONS.jollofRice} alt="jollof rice" className="md:w-lg 2xl:w-2xl" />
        </div>
        <div className="animate-slide-in-right absolute top-28 right-20 hidden h-24 w-24 items-center justify-center rounded-full bg-[#EF9825] p-4 md:block 2xl:right-48">
          <p className="text-primary text-center text-base leading-tight font-bold">
            Available Now
          </p>
        </div>
        <div className="animate-slide-in-left w-lg pl-20">
          <h3 className="text-3xl font-medium text-black">Menu</h3>
          <p className="mt-3 text-6xl font-medium text-black">Spicy Tasty Jollof</p>
          <div>
            <div className="mt-3 flex items-center gap-2 text-yellow-500">
              <StarFilled className="text-md" />
              <StarFilled className="text-md" />
              <StarFilled className="text-md" />
              <StarFilled className="text-md" />
              <StarFilled className="text-md" />
              <span className="text-md text-primary font-medium">4.5 (230 reviews)</span>
            </div>
            <p className="text-primary text-lg">
              It’s now easier than ever, scan in the restaurant, order for delivery, or even as a
              guest. No stress, just good food.
            </p>
            <button
              onClick={() =>
                window.open("https://apps.apple.com/us/app/laras-kitchen/id6753684107", "_blank")
              }
              className="bg-primary mt-3 cursor-pointer rounded-md px-10 py-2 text-white"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="relative flex h-[55rem] flex-col items-center justify-between px-6 py-10 md:hidden">
        {/* Text Section */}
        <div className="w-full">
          <h3 className="mt-16 text-3xl font-medium text-black">Menu</h3>
          <p className="mt-2 text-5xl leading-tight font-semibold text-black">Spicy Tasty Jollof</p>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2 text-yellow-500">
            <StarFilled className="text-sm" />
            <StarFilled className="text-sm" />
            <StarFilled className="text-sm" />
            <StarFilled className="text-sm" />
            <StarFilled className="text-sm" />
            <span className="text-xs font-medium text-gray-600">4.5 (230 reviews)</span>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            It’s now easier than ever, scan in the restaurant, order for delivery, or even as a
            guest. No stress, just good food.
          </p>

          {/* Button */}
          <button
            onClick={() =>
              window.open("https://apps.apple.com/us/app/laras-kitchen/id6753684107", "_blank")
            }
            className="mt-4 rounded-md bg-green-900 px-6 py-2 text-sm text-white"
          >
            Order Now
          </button>
        </div>

        {/* Image Section */}
        <div className="relative flex w-full items-center justify-center pb-6">
          {/* Mobile Polygon Background */}
          <img
            src={IMAGES.menuMobilePolygon}
            alt="mobile polygon"
            className="absolute bottom-12 w-72"
          />

          {/* Food Image */}
          <img
            src={ICONS.jollofRice}
            alt="jollof rice"
            className="relative right-10 -bottom-10 z-10 h-72 w-72 rounded-full object-cover"
          />

          {/* Badge */}
          <div className="absolute top-6 right-36 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF9825] p-2 shadow-md">
            <p className="text-primary text-center text-xs leading-tight font-bold">
              Available Now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuHero;
