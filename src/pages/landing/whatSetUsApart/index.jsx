import React from "react";
import { ICONS } from "../../../constants";

const WhatSetsUsApart = () => {
  const features = [
    {
      icon: ICONS.freshlyCooked,
      title: "Freshly Cooked",
      description: "We prepare each meal fresh, just for you never pre-cooked, always flavorful.",
      animation: "animate-slide-in-left",
    },
    {
      icon: ICONS.authenticIcon,
      title: "Authentic Flavors",
      description: "Whether at home or work, enjoy your favorite meals delivered quickly and hot.",
      animation: "animate-fade-in-up",
    },
    {
      icon: ICONS.fastDelivery,
      title: "Fast Delivery",
      description:
        "Every dish is made with real Nigerian ingredients, bringing you the true taste of home.",
      animation: "animate-slide-in-right",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Section Title */}
      <h1 className="text-primary animate-fade-in-down text-center text-4xl font-bold">
        What Sets Us Apart
      </h1>

      {/* Features Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-3 rounded-xl bg-white p-4 transition-transform duration-300 hover:scale-105 ${feature.animation}`}
            style={{ animationDelay: `${index * 0.2}s` }} // staggered
          >
            <img src={feature.icon} alt={feature.title} className="animate-zoom-in h-12 w-12" />

            <h2 className="text-xl font-semibold text-[#FFC107]">{feature.title}</h2>
            <p className="text-center text-lg text-black">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatSetsUsApart;
