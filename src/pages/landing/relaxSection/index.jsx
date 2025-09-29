import React from "react";
import { IMAGES } from "../../../constants";

const RelaxSection = () => {
  return (
    <div className="bg-[#FAFAFA] py-12">
      <h1 className="animate-fade-in-down text-center text-4xl font-bold text-[#B2B3B26E]">
        Relax. Eat. Connect.
      </h1>
      <div className="mx-auto mt-3 flex max-w-6xl">
        <div className="flex max-w-md flex-col justify-center px-6">
          <h3 className="text-primary text-start text-3xl font-bold">Our Lounge</h3>
          <p className="text-start text-lg text-black">
            Step into our cozy lounge where good vibes meet great food.
          </p>
        </div>
        <div className="mt-6 flex flex-1 justify-center">
          <img src={IMAGES.ourLounge} alt="Our Lounge" className="w-full rounded-lg object-cover" />
        </div>
      </div>
    </div>
  );
};

export default RelaxSection;
