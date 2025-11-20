import React, { useRef, useState } from "react";
import { StarFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Skeleton, Carousel } from "antd";
import { ICONS } from "../../../../constants";
import { useGetDineInMenusQuery } from "../../../../redux/slices/cashier/dineIn";

const AvailableDishes = () => {
  const [page] = useState(1);

  const { data, isLoading } = useGetDineInMenusQuery(page, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const items = data?.data?.data || [];
  const carouselRef = useRef(null);

  return (
    <div className="bg-[#FAFAFA] py-10">
      <div className="relative mx-auto max-w-6xl px-4">
        <h3 className="text-primary text-center text-3xl font-bold">Available Dishes</h3>

        <Carousel
          dots={false}
          ref={carouselRef}
          slidesToShow={3}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
          ]}
          className="mt-8"
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
            : items.map((item) => (
                <div key={item.id} className="px-2">
                  <Card
                    className="animate-fade-in-up overflow-hidden rounded-2xl"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="flex justify-center bg-[#C8FFD1] py-6">
                      <img
                        src={item.media?.url}
                        alt={item.name}
                        className="animate-zoom-in h-40 w-40 rounded-full object-cover"
                      />
                    </div>

                    <div className="p-4 text-center">
                      <h3 className="text-2xl font-bold text-black">{item.name}</h3>

                      <p className="mt-1 text-base text-[#404040]">
                        {item.description || "No description available"}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-[#C0BFBF]">
                        <div className="flex items-center gap-2">
                          <img src={ICONS.potIcon} alt="" />
                          <span className="text-sm">{item.preparation_time || "—"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-yellow-500">
                          <StarFilled className="text-lg" />
                          <span className="text-sm">{item.rating || "4.5"}</span>
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

export default AvailableDishes;
