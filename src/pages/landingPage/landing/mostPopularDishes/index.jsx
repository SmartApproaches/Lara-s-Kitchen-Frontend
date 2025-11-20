import React, { useRef, useState } from "react";
import { Carousel, Card, Skeleton } from "antd";
import { StarFilled, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { ICONS } from "../../../../constants";
import { useGetDineInMenusQuery } from "../../../../redux/slices/cashier/dineIn";

const MostPopularDishes = () => {
  const [page] = useState(1);
  const { data, isLoading } = useGetDineInMenusQuery(page, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const items = data?.data?.data || [];
  const carouselRef = useRef(null);

  return (
    <div className="w-full bg-[#FAFAFA]">
      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-8 text-center text-2xl font-semibold text-green-900 md:text-3xl">
          Most Popular Dishes
        </h2>

        <Carousel
          dots={false}
          ref={carouselRef}
          slidesToShow={3}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
          ]}
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-2">
                  <Card className="overflow-hidden rounded-2xl">
                    <Skeleton.Image
                      active
                      style={{ width: "100%", height: 180, borderRadius: 12 }}
                    />
                    <div className="p-4">
                      <Skeleton active paragraph={{ rows: 2 }} />
                    </div>
                  </Card>
                </div>
              ))
            : items.map((dish) => (
                <div key={dish.id} className="px-2">
                  <Card
                    className="animate-fade-in-up overflow-hidden rounded-2xl"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="flex justify-center bg-[#C8FFD1] py-6">
                      <img
                        src={dish.media?.url}
                        alt={dish.name}
                        className="animate-zoom-in h-40 w-40 rounded-full object-cover"
                      />
                    </div>

                    <div className="p-4 text-center">
                      <h3 className="text-3xl font-bold text-black">{dish.name}</h3>
                      <p className="mt-1 text-lg text-[#404040]">{dish.description}</p>

                      <div className="mt-4 flex items-center justify-between text-[#C0BFBF]">
                        <div className="flex items-center gap-2">
                          <img src={ICONS.potIcon} alt="" />
                          <span>{dish.preparation_time || "—"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-yellow-500">
                          <StarFilled className="text-xl" />
                          <span>{dish.rating || "4.5"}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
        </Carousel>

        {/* Arrows */}
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
