import React, { useMemo, useState } from "react";
import { Button, Card, Typography, Input, Image } from "antd";
import { MinusOutlined, PlusOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02,
  BatteryLow,
  Favourite,
  GoogleDoc,
  Home07,
  Notification01,
  PlusSign,
  Pot01,
  PreferenceHorizontal,
  SignalFull01,
  Star,
} from "@hugeicons/core-free-icons";

import { IMAGES } from "../../../../../../constants";

const { Title, Text } = Typography;

const PreviewPanel = ({ formData, uploadedImage }) => {
  const date = new Date();
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const previewUrl = useMemo(() => {
    if (!uploadedImage) return null;
    if (typeof uploadedImage === "string") return uploadedImage;
    if (uploadedImage instanceof File) return URL.createObjectURL(uploadedImage);
    return null;
  }, [uploadedImage]);

  const hasData = formData?.itemName || uploadedImage;
  const basePrice = formData?.menu_sizes?.map((size) => size.price) || [];

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  if (!hasData) {
    return (
      <div className="h-full bg-white">
        <div className="p-2 sm:p-4">
          <div className="mb-4">
            <p className="text-center text-xs text-gray-500 sm:text-sm">
              Use this preview to check how your item details, price, and image will appear to
              customers in the app
            </p>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg sm:max-w-md">
            <div className="flex items-center justify-between bg-white px-3 py-2 text-xs sm:px-4">
              <span className="font-medium">
                {displayHour}:{minutes} {ampm}
              </span>
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={SignalFull01} size={14} className="text-xs" />
                <HugeiconsIcon icon={BatteryLow} />
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <MenuOutlined className="text-sm text-gray-600 sm:text-base" />
                <div className="h-6 w-6 rounded-full bg-green-100 sm:h-8 sm:w-8"></div>
              </div>

              <div className="mb-3 sm:mb-4">
                <p className="text-sm text-gray-600 sm:text-base">Hi James</p>
                <Title level={5} className="m-0 sm:text-lg">
                  Find your next meal
                </Title>
              </div>

              <div className="relative mb-3 sm:mb-4">
                <Input
                  placeholder="Search food"
                  prefix={<SearchOutlined className="text-xs sm:text-sm" />}
                  suffix={<HugeiconsIcon icon={PreferenceHorizontal} size={16} />}
                  className="!bg-accent rounded-lg border-0 !p-1.5 text-xs sm:!p-2 sm:text-sm"
                />
              </div>

              <div className="mb-3 flex justify-between gap-2 sm:mb-4 sm:gap-4">
                <p className="pb-1 text-xs font-medium text-green-600 sm:text-sm">General</p>
                <p className="text-xs text-[#B2B3B2] sm:text-sm">Food</p>
                <p className="text-xs text-[#B2B3B2] sm:text-sm">Drinks</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Card className="overflow-hidden rounded-lg !border-2 !border-[#0CA921] !bg-[#F7F7F7]">
                  <div className="relative mb-1 aspect-square rounded-lg sm:mb-2">
                    <HugeiconsIcon
                      icon={Favourite}
                      fill="#FF383C"
                      size={14}
                      className="absolute -top-2 -right-2 text-red-400 sm:-top-3 sm:-right-3"
                    />
                    <img src={IMAGES.foodOne} className="h-full w-full object-cover" alt="" />
                  </div>
                  <p className="text-center text-sm font-semibold sm:text-lg" strong>
                    Abula
                  </p>
                  <div className="flex justify-between gap-x-1 sm:gap-x-2">
                    <div className="my-1 flex items-center gap-1">
                      <Pot01Icon size={14} color="#FFC107" className="text-xs" />
                      <span className="text-xs text-gray-500 sm:text-sm">20 mins</span>
                    </div>
                    <div className="my-1 flex items-center gap-1">
                      <HugeiconsIcon icon={Star} size={14} fill="#FFC107" color="#FFC107" className="text-xs" />
                      <span className="text-xs sm:text-sm">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 sm:py-2">
                    <p className="absolute bottom-0 left-3 text-sm font-bold text-[#444444] sm:left-5 sm:text-base">
                      £12.00
                    </p>
                    <button className="bg-primary absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-tl-[6px] rounded-br-[6px] border-0 text-white sm:h-6 sm:w-6">
                      <HugeiconsIcon icon={PlusSign} color="#fff" size={12} className="text-xs" />
                    </button>
                  </div>
                </Card>

                <Card className="overflow-hidden rounded-lg !border-2 !border-[#0CA921] !bg-[#D9D9D9] opacity-60">
                  <div className="relative mb-1 aspect-square rounded-lg sm:mb-2">
                    <FavouriteIcon
                      size={14}
                      className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3"
                    />
                    <img src={IMAGES.foodTwo} className="h-full w-full object-cover" alt="" />
                  </div>
                  <p className="text-center text-sm font-semibold sm:text-lg" strong>
                    Fanta
                  </p>
                  <div className="flex justify-between gap-x-1 sm:gap-x-2">
                    <div className="my-1">
                      <span className="text-xs sm:text-sm">Non - Alcoholic</span>
                    </div>
                    <div className="my-1 flex items-center gap-1">
                      <HugeiconsIcon icon={Star} size={14} fill="#FFC107" color="#FFC107" className="text-xs" />
                      <span className="text-xs sm:text-sm">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 sm:py-2">
                    <p className="absolute bottom-0 left-3 text-sm font-bold text-[#444444] sm:left-5 sm:text-base">
                      £12.00
                    </p>
                    <button className="bg-primary absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-tl-[6px] rounded-br-[6px] border-0 text-white sm:h-6 sm:w-6">
                      <HugeiconsIcon icon={PlusSign} color="#fff" size={12} className="text-xs" />
                    </button>
                  </div>
                </Card>

                <Card className="overflow-hidden rounded-lg !border-2 !border-[#0CA921] !bg-[#D9D9D9] opacity-60">
                  <div className="relative mb-1 aspect-square rounded-lg sm:mb-2">
                    <span className="absolute -top-2 -left-2 font-medium text-red-900 sm:-top-3 sm:-left-3">
                      R18+
                    </span>
                    <FavouriteIcon
                      fill="#FF383C"
                      size={14}
                      className="absolute -top-2 -right-2 text-red-400 sm:-top-3 sm:-right-3"
                    />
                    <img src={IMAGES.foodThree} className="h-full w-full object-contain" alt="" />
                  </div>
                  <p className="text-center text-sm font-semibold sm:text-lg" strong>
                    Baileys
                  </p>
                  <div className="flex justify-between gap-x-1 sm:gap-x-2">
                    <div className="my-1">
                      <span className="text-xs sm:text-sm">Alcoholic</span>
                    </div>
                    <div className="my-1 flex items-center gap-1">
                      <StarIcon size={14} fill="#FFC107" color="#FFC107" className="text-xs" />
                      <span className="text-xs sm:text-sm">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 sm:py-2">
                    <p className="absolute bottom-0 left-3 text-sm font-bold text-[#444444] sm:left-5 sm:text-base">
                      £12.00
                    </p>
                    <button className="bg-primary absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-tl-[6px] rounded-br-[6px] border-0 text-white sm:h-6 sm:w-6">
                      <HugeiconsIcon icon={PlusSign} color="#fff" size={12} className="text-xs" />
                    </button>
                  </div>
                </Card>

                <Card className="overflow-hidden rounded-lg !border-2 !border-[#0CA921] !bg-[#D9D9D9] opacity-60">
                  <div className="relative mb-1 aspect-square rounded-lg sm:mb-2">
                    <FavouriteIcon
                      size={14}
                      className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3"
                    />
                    <img src={IMAGES.foodFour} className="h-full w-full object-cover" alt="" />
                  </div>
                  <p className="text-center text-sm font-semibold sm:text-lg" strong>
                    Jollof Rice
                  </p>
                  <div className="flex justify-between gap-x-1 sm:gap-x-2">
                    <div className="my-1 flex items-center gap-1">
                      <Pot01Icon size={14} color="#FFC107" className="text-xs" />
                      <span className="text-xs text-gray-500 sm:text-sm">20 mins</span>
                    </div>
                    <div className="my-1 flex items-center gap-1">
                      <StarIcon size={14} fill="#FFC107" color="#FFC107" className="text-xs" />
                      <span className="text-xs sm:text-sm">4.5</span>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 flex items-center justify-center bg-red-200 px-1 py-0 text-center text-xs text-red-600 lg:py-1">
                    <p>Not available at this moment</p>
                  </div>
                </Card>
              </div>
            </div>

            <div className="bg-white p-2">
              <div className="flex justify-around">
                <div className="flex flex-col items-center text-center text-green-600">
                  <HugeiconsIcon icon={Home07} fill="#1F5226" color="#ffffff" size={24} />
                  <Text className="text-xs">Home</Text>
                </div>
                <div className="flex flex-col items-end text-center text-white opacity-90">
                  <HugeiconsIcon icon={GoogleDoc} size={24} opacity={0.5} fill="#1F5226" />
                </div>
                <div className="flex flex-col items-end text-center text-white opacity-90">
                  <HugeiconsIcon icon={Favourite} size={24} opacity={0.5} fill="#1F5226" />
                </div>
                <div className="flex flex-col items-end text-center text-white opacity-90">
                  <HugeiconsIcon icon={Notification01} size={24} opacity={0.5} fill="#1F5226" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="p-2 sm:p-4">
        <div className="mb-3 sm:mb-4">
          <p className="text-center text-xs text-gray-500 sm:text-sm">
            Use this preview to check how your item details, price, and image will appear to
            customers in the app
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg shadow-lg sm:max-w-md">
          <div className="bg-primary relative h-64 sm:h-72">
            <div className="absolute inset-0 z-10 w-full px-3 sm:px-4">
              <div className="flex items-center justify-between py-2 text-sm text-white">
                <span className="font-semibold">
                  {displayHour}:{minutes} {ampm}
                </span>
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={SignalFull01} className="text-sm" />
                  <HugeiconsIcon icon={BatteryLow} className="text-sm" />
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <HugeiconsIcon icon={ArrowLeft02} className="text-sm text-white sm:text-base" />
                <h3 className="text-sm font-medium text-white sm:text-base">Food Details</h3>
                <HugeiconsIcon
                  icon={Favourite}
                  className={`cursor-pointer text-sm sm:text-base ${
                    isFavorited ? "text-red-400" : "text-white"
                  }`}
                  onClick={() => setIsFavorited(!isFavorited)}
                />
              </div>

              <div className="relative flex justify-center">
                <div className="flex w-40 items-center justify-center overflow-hidden rounded-full md:h-[15rem] md:w-[15rem] lg:h-96 lg:w-96 xl:h-[15rem] xl:w-[15rem]">
                  <Image
                    src={previewUrl || IMAGES.foodFive}
                    alt="Food preview"
                    className="relative h-full w-fit object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-16">
            <div className="bg-w relative p-3 sm:p-4">
              <h3 className="text-lg font-semibold text-gray-800 capitalize sm:text-xl">
                {formData?.itemName || "Not specified"}
              </h3>
              <span className="mb-2 block text-lg font-bold text-green-600 sm:text-xl">
                £{basePrice[0] || "0.00"}
              </span>

              <div className="my-3 flex items-center justify-between gap-2 text-sm font-semibold text-gray-500 sm:gap-4">
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Star} size={16} fill="#FFC107" color="#FFC107" className="text-xs" />
                  <span>4.5</span>
                </div>
                <span>🔥 {formData?.calorieSize || 100} kcal</span>
                <span>⏱️ {formData?.preparationTime || 20} mins</span>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 sm:text-base">Contents:</h3>
                <p className="mt-3 block w-fit rounded-sm bg-[#F8FFF9] p-2 text-xs font-semibold text-gray-600 capitalize sm:text-sm">
                  {formData?.description || "No description provided."}
                </p>
              </div>

              <div className="mt-20 mb-5 flex items-center justify-between">
                <div className="border-primary flex items-center rounded-lg border">
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="border-0"
                  />
                  <Text className="px-3 text-sm font-medium sm:text-base">{quantity}</Text>
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-primary border-0"
                  />
                </div>

                <Button
                  type="primary"
                  className="rounded-lg border-[#0C4113] !bg-[#0C4113] px-4 text-xs sm:px-6 sm:text-sm"
                >
                  Order Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
