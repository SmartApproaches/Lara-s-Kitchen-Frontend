import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import SkeletonCard from "../components/SkeletonCard";
import MenuImage from "../components/MenuImage";

const MenuCard = ({ isLoading, page, allMenus, setSelectedItem, imageCache, addToCart }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4">
      {isLoading && page === 1 ? (
        <>
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </>
      ) : allMenus.length === 0 ? (
        <div className="col-span-2 py-20 text-center text-gray-500 sm:col-span-3 lg:col-span-4">
          No menu items available
        </div>
      ) : (
        <>
          {allMenus.map((item) => {
            const defaultSize = item.sizes?.find((s) => s.name === "large") || item.sizes?.[0];

            return (
              <div
                key={item.id}
                className={`group flex transform flex-col overflow-hidden rounded-2xl bg-[#F7F7F7] shadow-sm transition-all duration-300 hover:shadow-xl ${
                  item.availability === "out_of_stock"
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:-translate-y-1"
                }`}
                onClick={() => item.availability !== "out_of_stock" && setSelectedItem(item)}
              >
                <div className="relative overflow-hidden">
                  <MenuImage
                    src={item.media?.url}
                    alt={item.name}
                    imageCache={imageCache}
                    className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-36"
                  />
                  {item.availability === "out_of_stock" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
                  <div>
                    <h3 className="line-clamp-1 text-sm font-bold text-[#1F5226] sm:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                      {item.category?.name}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-[#1F5226] sm:text-lg">
                        £{defaultSize?.price}
                      </p>
                      <p className="text-[10px] text-gray-500">Size: {defaultSize?.name}</p>
                    </div>

                    {item.availability !== "out_of_stock" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, defaultSize);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F5226] text-white shadow-md transition-all hover:bg-[#2E6B38] hover:shadow-lg active:scale-95 sm:h-8 sm:w-8"
                      >
                        <PlusOutlined className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MenuCard;
