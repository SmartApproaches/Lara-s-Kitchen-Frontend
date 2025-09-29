import React, { useRef } from "react";
import { IMAGES, ICONS } from "../../../constants";
import { Carousel, Card } from "antd";
import { StarFilled, RightOutlined, LeftOutlined } from "@ant-design/icons";

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

const MostPopularDishes = () => {
  const carouselRef = useRef(null);

  return (
    <div className="w-full bg-[#FAFAFA]">
      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-8 text-center text-2xl font-semibold text-green-900 md:text-3xl">
          Most Popular Dishes
        </h2>

        {/* Carousel */}
        <Carousel
          dots={false}
          ref={carouselRef}
          slidesToShow={3}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
          ]}
        >
          {dishes.map((dish, i) => (
            <div key={i} className="px-2">
              <Card
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
                  <h3 className="text-4xl font-bold text-black">{dish.name}</h3>
                  <p className="mt-1 text-lg text-[#404040]">{dish.description}</p>

                  <div className="mt-4 flex items-center justify-between text-[#C0BFBF]">
                    <div className="flex items-center gap-2">
                      <img src={ICONS.potIcon} alt="potIcon" />
                      <span className="flex items-center text-lg">{dish.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-yellow-500">
                      <StarFilled className="text-2xl text-yellow-500" />
                      <span className="flex items-center text-lg">{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Carousel>

        {/* Custom Arrows */}
        <button
          onClick={() => carouselRef.current?.prev()}
          className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <LeftOutlined />
        </button>
        <button
          onClick={() => carouselRef.current?.next()}
          className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default MostPopularDishes;
