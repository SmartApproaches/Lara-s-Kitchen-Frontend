import React from "react";
import { Controller } from "react-hook-form";
import { InputNumber, Select } from "antd";

const { Option } = Select;

const CustomizationsStep = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-[#232323] md:text-xl">Customizations / Add-ons</h3>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-800">
            Calorie size <span className="text-red-500">*</span>
          </label>
          <Controller
            name="calorieSize"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Enter amount"
                className="w-full"
                min={0}
                size="large"
                addonAfter="kcal"
                status={errors?.calorieSize ? "error" : ""}
              />
            )}
          />
          {errors?.calorieSize && (
            <span className="text-sm text-red-500">{errors.calorieSize.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-800">
            Preparation Time <span className="text-red-500">*</span>
          </label>
          <Controller
            name="preparationTime"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Enter amount"
                className="w-full"
                min={1}
                size="large"
                addonAfter="minutes"
                status={errors?.preparationTime ? "error" : ""}
              />
            )}
          />
          {errors?.preparationTime && (
            <span className="text-sm text-red-500">{errors.preparationTime.message}</span>
          )}
        </div>

        <h5 className="mt-6 text-lg font-medium text-[#232323] md:text-xl">
          Pricing and Availability
        </h5>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <label className="text-base font-normal text-gray-800">
              Base Price <span className="text-red-500">*</span>
            </label>
            <Controller
              name="basePrice"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <span className="absolute top-2 left-3 z-10 text-gray-500">£</span>
                  <input
                    {...field}
                    type="number"
                    placeholder="Enter Price"
                    min="0"
                    step="0.01"
                    className={`w-full rounded-md border py-2 pr-3 pl-8 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors?.basePrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              )}
            />
            {errors?.basePrice && (
              <span className="text-sm text-red-500">{errors.basePrice.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-base font-normal text-gray-800">
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
                    className={`w-full rounded-md border px-3 py-2 pr-8 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors?.discount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <span className="absolute top-2 right-3 text-gray-500">%</span>
                </div>
              )}
            />
            {errors?.discount && (
              <span className="text-sm text-red-500">{errors.discount.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-800">
            Stock Availability <span className="text-red-500">*</span>
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
                status={errors?.stockAvailability ? "error" : ""}
              >
                <Option value="in_stock">In Stock</Option>
                <Option value="out_of_stock">Out of Stock</Option>
              </Select>
            )}
          />
          {errors?.stockAvailability && (
            <span className="text-sm text-red-500">{errors.stockAvailability.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationsStep;
