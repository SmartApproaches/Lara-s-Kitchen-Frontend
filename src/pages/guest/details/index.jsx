import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TagOutlined,
} from "@ant-design/icons";
import MenuImage from "../components/MenuImage";
const MenuDetails = ({ selectedItem, setSelectedItem, addToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  useEffect(() => {
    if (selectedItem?.sizes?.length) {
      const large = selectedItem.sizes.find((s) => s.name === "large") || selectedItem.sizes[0];

      setSelectedSize(large);
    }
  }, [selectedItem]);
  return (
    <Modal
      open={!!selectedItem}
      footer={null}
      onCancel={() => setSelectedItem(null)}
      centered
      width="95%"
      style={{ maxWidth: "520px" }}
      bodyStyle={{
        padding: 0,
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "#FDFDFD",
      }}
    >
      {selectedItem && (
        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-52 overflow-hidden sm:h-64">
            <MenuImage
              src={selectedItem.media?.url}
              alt={selectedItem.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />

            {/* Price Badge */}
            <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
              <p className="text-base font-semibold text-[#1F5226] sm:text-lg">
                £{selectedSize?.price}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 -mt-4 rounded-t-3xl bg-white p-5 shadow-inner sm:p-6">
            {/* Title & Category */}
            <div className="mb-3">
              <h2 className="text-xl font-bold text-[#1F5226] sm:text-2xl">{selectedItem.name}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EB] px-2.5 py-0.5 text-[11px] font-medium text-[#1F5226]">
                  <TagOutlined className="text-[10px]" />
                  {selectedItem.category?.name}
                </span>
                {selectedItem.subcategory?.name && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
                    {selectedItem.subcategory.name}
                  </span>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="mb-3 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100/30 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F5226]/10">
                  <ClockCircleOutlined className="text-base text-[#1F5226]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-600">Prep Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedItem.preparation_time || "15 min"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-red-50 to-red-100/30 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                  <FireOutlined className="text-base text-red-600" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-600">Calories</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedItem.calorie_size || "250"} kcal
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4 rounded-lg bg-gray-50 p-3.5">
              <h3 className="mb-1 text-[13px] font-semibold text-gray-700">Description</h3>
              <p className="text-[13px] leading-relaxed text-gray-600">
                {selectedItem.description ||
                  "A delicious menu item carefully prepared with fresh ingredients and served with love. Perfect for any occasion!"}
              </p>
            </div>
            <div className="mb-3">
              <label className="text-sm font-semibold text-[#1F5226]">Select Size</label>

              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={selectedSize?.name}
                onChange={(e) => {
                  const size = selectedItem.sizes.find((s) => s.name === e.target.value);
                  setSelectedSize(size);
                }}
              >
                {selectedItem.sizes.map((size) => (
                  <option key={size.name} value={size.name}>
                    {size.name} - £{size.price}
                  </option>
                ))}
              </select>
            </div>

            {/* CTA */}
            <div>
              {selectedItem.availability === "out_of_stock" ? (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 py-3 text-center">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm font-semibold text-red-600">Currently Unavailable</span>
                </div>
              ) : (
                <button
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#1F5226] to-[#2E6B38] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                  onClick={() => {
                    addToCart(selectedItem, selectedSize);
                    setSelectedItem(null);
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <ShoppingCartOutlined className="text-sm" />
                    Add to Cart
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MenuDetails;
