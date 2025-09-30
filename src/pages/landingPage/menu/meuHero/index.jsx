import React from "react";
import { ICONS, IMAGES } from "../../../../constants";
import { StarFilled } from "@ant-design/icons";
const MenuHero = () => {
  return (
    <div className="mx-auto h-fit w-full overflow-hidden md:min-h-screen">
      <div className="relative mx-auto flex h-[32rem] max-w-[100rem] items-center md:min-h-screen">
        <div className="animate-slide-in-right absolute top-0 right-0">
          <img src={IMAGES.menuPolyGon} alt="menu polygon" className="w-md" />
        </div>
        <div className="animate-slide-in-right absolute top-0 right-0">
          <img src={IMAGES.menuTrasperent} alt="menuTrasperent" className="w-md" />
        </div>
        <div className="animate-slide-in-right absolute top-20 right-10">
          <img src={ICONS.jollofRice} alt="jollof rice" className="w-md" />
        </div>
        <div className="animate-slide-in-right absolute top-28 right-20 flex h-24 w-24 items-center justify-center rounded-full bg-[#EF9825] p-4">
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
            <button className="bg-primary mt-3 rounded-md px-10 py-2 text-white">Order Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuHero;
