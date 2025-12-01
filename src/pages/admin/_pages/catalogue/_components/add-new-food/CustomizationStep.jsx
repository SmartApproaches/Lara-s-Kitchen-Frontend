import React from "react";
import { Controller } from "react-hook-form";
import { Cancel01Icon, PlusSignIcon } from "hugeicons-react";

const CustomizationsStep = ({ control, errors, watch, setValue }) => {
  const menuSizes = watch("menu_sizes") || [{ name: "large", price: "" }];

  const addMenuSize = () => {
    const currentSizes = watch("menu_sizes") || [];
    setValue("menu_sizes", [...currentSizes, { name: "large", price: "" }]);
  };

  const removeMenuSize = (index) => {
    const currentSizes = watch("menu_sizes") || [];
    if (currentSizes.length > 1) {
      setValue(
        "menu_sizes",
        currentSizes.filter((_, i) => i !== index),
      );
    }
  };

  const updateMenuSize = (index, field, value) => {
    const currentSizes = watch("menu_sizes") || [];
    const updated = [...currentSizes];

    if (field === "price") {
      updated[index] = { ...updated[index], [field]: value === "" ? "" : Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    setValue("menu_sizes", updated);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-[#232323] md:text-xl">Pricing and Availability</h3>

        <div className="space-y-4">
          {menuSizes.map((item, index) => (
            <div key={index} className="flex flex-col gap-y-2">
              <label className="text-base font-normal text-gray-700">
                {index === 0 ? "Base Price" : `Variable Price ${index}`}
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute top-3 left-3 z-10 text-gray-500">£</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateMenuSize(index, "price", e.target.value)}
                    className="focus:ring-accent w-full rounded-md border border-gray-300 py-2.5 pr-3 pl-8 text-base focus:ring-2 focus:outline-none"
                  />
                </div>
                <div className="relative flex-1">
                  <select
                    value={item.name}
                    onChange={(e) => updateMenuSize(index, "name", e.target.value)}
                    className="focus:ring-accent w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-base focus:ring-2 focus:outline-none"
                  >
                    <option value="large">Large</option>
                    <option value="medium">Medium</option>
                    <option value="small">Small</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {menuSizes.length > 1 && index >= 1 && (
                  <button
                    type="button"
                    onClick={() => removeMenuSize(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Cancel01Icon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMenuSize}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 font-semibold px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            <PlusSignIcon className="h-5 w-5" />
            Add other sizes
          </button>
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-700">Stock Availability</label>
          <Controller
            name="stockAvailability"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`focus:ring-accent w-full appearance-none rounded-md border px-3 py-2.5 pr-10 text-base focus:ring-2 focus:outline-none ${
                  errors?.stockAvailability ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Choose Availability</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            )}
          />
          {errors?.stockAvailability && (
            <span className="text-sm text-red-500">{errors.stockAvailability.message}</span>
          )}
        </div>

        <h3 className="pt-4 text-lg font-medium text-[#232323] md:text-xl">
          Customizations / Add-ons
        </h3>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-700">Calorie size</label>
          <Controller
            name="calorieSize"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="100 kcal"
                className={`focus:ring-accent w-full rounded-md border px-3 py-2.5 text-base focus:ring-2 focus:outline-none ${
                  errors?.calorieSize ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
          />
          {errors?.calorieSize && (
            <span className="text-sm text-red-500">{errors.calorieSize.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-700">Preparation Time</label>
          <Controller
            name="preparationTime"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="15 minutes"
                className={`focus:ring-accent w-full rounded-md border px-3 py-2.5 text-base focus:ring-2 focus:outline-none ${
                  errors?.preparationTime ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
          />
          {errors?.preparationTime && (
            <span className="text-sm text-red-500">{errors.preparationTime.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationsStep;
