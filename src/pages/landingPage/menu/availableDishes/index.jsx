import React from "react";
import { IMAGES, ICONS } from "../../../../constants";
import { StarFilled } from "@ant-design/icons";
import { Card } from "antd";

const dishes = [
  {
    name: "Abula",
    description: "1 wrap of Amala, Gbegiri, Ewedu, Beef and Ponmo",
    img: IMAGES.abula,
    time: "20 mins",
    rating: "4.5",
  },
  {
    name: "Semo",
    description: "1 wrap of Semo, Efo riro/ Egusi soup Beef and Ponmo",
    img: ICONS.efoIcon,
    time: "20 mins",
    rating: "4.5",
  },
  {
    name: "Jollof",
    description: "1 plate of Jollof rice, Beef/ chicken",
    img: ICONS.jollofRice,
    time: "20 mins",
    rating: "4.5",
  },
];

const AvailableDishes = () => {
  return (
    <div className="bg-[#FAFAFA] py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h3 className="text-primary text-center text-3xl font-bold">Available Dishes</h3>

        {/* Grid wrapper */}
        <div className="my-8 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <Card
              key={i}
              className="animate-fade-in-up overflow-hidden rounded-2xl"
              bodyStyle={{ padding: "0" }}
            >
              {/* Top green section */}
              <div className="flex justify-center bg-[#C8FFD1] py-6">
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="animate-zoom-in h-40 w-40 rounded-full object-cover"
                />
              </div>

              {/* Text section */}
              <div className="p-4 text-center">
                <h3 className="text-2xl font-bold text-black">{dish.name}</h3>
                <p className="mt-1 text-base text-[#404040]">{dish.description}</p>

                <div className="mt-4 flex items-center justify-between text-[#C0BFBF]">
                  <div className="flex items-center gap-2">
                    <img src={ICONS.potIcon} alt="potIcon" />
                    <span className="text-sm">{dish.time}</span>
                  </div>

                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarFilled className="text-lg text-yellow-500" />
                    <span className="text-sm">{dish.rating}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableDishes;
