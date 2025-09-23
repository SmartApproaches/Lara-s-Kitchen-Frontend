import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";

const { Option } = Select;

const BasicInfoStep = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg md:text-xl text-[#232323] font-medium">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gap-y-2 flex flex-col">
            <label className="font-normal text-base text-gray-800">
              Item Name
            </label>
            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter name"
                  className={`w-full text-base px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.itemName ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.itemName && (
              <span className="text-red-500 text-sm">
                {errors.itemName.message}
              </span>
            )}
          </div>

          <div className="gap-y-2 flex flex-col">
            <label className="font-normal text-base text-gray-800">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Choose Category"
                  className="w-full"
                  size="large"
                  status={errors.category ? "error" : ""}
                >
                  <Option value="food">Food</Option>
                  <Option value="alcoholic">Alcoholic</Option>
                  <Option value="non-alcoholic">Non-Alcoholic</Option>
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        <div className="gap-y-2 flex flex-col">
          <label className="font-normal text-base text-gray-800">
            Description (Optional)
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Enter Description"
                rows={4}
                className="w-full text-base px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-vertical"
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <h5 className="text-lg md:text-xl text-[#232323] font-medium mt-6">
          Pricing and Availability
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gap-y-2 flex flex-col">
            <label className="font-normal text-base text-gray-800">
              Base Price
            </label>
            <Controller
              name="basePrice"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">£</span>
                  <input
                    {...field}
                    type="number"
                    placeholder="Enter Price"
                    min="0"
                    step="0.01"
                    className={`w-full text-base pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.basePrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              )}
            />
            {errors.basePrice && (
              <span className="text-red-500 text-sm">
                {errors.basePrice.message}
              </span>
            )}
          </div>

          <div className="gap-y-2 flex flex-col">
            <label className="font-normal text-base text-gray-800">
              Discount / Promo (Optional)
            </label>
            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="number"
                    placeholder="Enter Amount"
                    min="0"
                    max="100"
                    className="w-full text-base px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    %
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        <div className="gap-y-2 flex flex-col">
          <label className="font-normal text-base text-gray-800">
            Stock Availability
          </label>
          <Controller
            name="stockAvailability"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Choose Availability"
                className="w-full"
                size="large"
                status={errors.stockAvailability ? "error" : ""}
              >
                <Option value="in-stock">In Stock</Option>
                <Option value="out-of-stock">Out of Stock</Option>
              </Select>
            )}
          />
          {errors.stockAvailability && (
            <span className="text-red-500 text-sm">
              {errors.stockAvailability.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
