import React, { useMemo } from "react";
import { Select } from "antd";
import { Controller, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

const { Option } = Select;

const BasicInfoStep = ({ control, errors, setValue }) => {
  const category = useSelector((state) => state?.categories?.category?.data);
  const categoryLoading = useSelector((state) => state?.categories?.categoryLoading);
  const subCategoryLoading = useSelector((state) => state?.categories?.subCategoryLoading);
  const subCategory = useSelector((state) => state?.categories?.subCategory);

  const selectedCategoryId = useWatch({
    control,
    name: "category",
  });

  const categoryOptions = useMemo(() => {
    if (!category) return [];

    if (Array.isArray(category)) {
      return category;
    }

    return [];
  }, [category]);

  const filteredSubCategories = useMemo(() => {
    if (!subCategory || !selectedCategoryId) return [];

    let allSubCategories = [];

    if (typeof subCategory === "object" && !Array.isArray(subCategory)) {
      Object.values(subCategory).forEach((categoryGroup) => {
        if (categoryGroup?.data && Array.isArray(categoryGroup.data)) {
          allSubCategories = [...allSubCategories, ...categoryGroup.data];
        }
      });
    }

    return allSubCategories.filter(
      (sub) =>
        sub?.category_id === selectedCategoryId ||
        sub?.category_id === parseInt(selectedCategoryId) ||
        sub?.category_id === String(selectedCategoryId),
    );
  }, [subCategory, selectedCategoryId]);

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-[#232323] md:text-xl">Basic Information</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <label className="text-base font-normal text-gray-800">Item Name</label>
            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter name"
                  className={`focus:ring-accent w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none ${
                    errors.itemName ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.itemName && (
              <span className="text-sm text-red-500">{errors.itemName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-base font-normal text-gray-800">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Choose Category"
                  className="w-full"
                  size="large"
                  loading={categoryLoading}
                  status={errors.category ? "error" : ""}
                  onChange={(value) => {
                    field.onChange(value);
                    if (setValue) {
                      setValue("subcategoryId", "");
                    }
                  }}
                >
                  {categoryOptions.map((cat) => (
                    <Option key={cat?.id} value={cat?.id}>
                      {cat?.name || "Unnamed Category"}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-sm text-red-500">{errors.category.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-800">Sub Category</label>
          <Controller
            name="subcategoryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select a Category"
                className="w-full"
                size="large"
                loading={subCategoryLoading}
                disabled={!selectedCategoryId || filteredSubCategories.length === 0}
                status={errors.subcategoryId ? "error" : ""}
              >
                {filteredSubCategories.map((subCat) => (
                  <Option key={subCat?.id} value={subCat?.id}>
                    {subCat?.name || "Unnamed Subcategory"}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.subcategoryId && (
            <span className="text-sm text-red-500">{errors.subcategoryId.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-800">Type of Meal</label>
          <Controller
            name="typeOfMeal"
            control={control}
            render={({ field }) => (
              <div className="relative inline-flex w-full rounded-lg border border-gray-300 bg-gray-100 p-1">
                <div
                  className={`absolute inset-y-1 right-1/2 left-1 rounded-md bg-white shadow-sm transition-all duration-300 ease-in-out ${
                    field.value === "special" ? "translate-x-full" : "translate-x-0"
                  }`}
                  style={{ width: "calc(50% - 0.25rem)" }}
                />

                <button
                  type="button"
                  onClick={() => field.onChange("normal")}
                  className={`relative z-10 flex-1 rounded-md px-4 py-3 text-base font-medium transition-colors duration-300 ${
                    field.value === "normal" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Normal Meal
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("special")}
                  className={`relative z-10 flex-1 rounded-md px-4 py-3 text-base font-medium transition-colors duration-300 ${
                    field.value === "special"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Special Offer
                </button>
              </div>
            )}
          />
          {errors.typeOfMeal && (
            <span className="text-sm text-red-500">{errors.typeOfMeal.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-base font-normal text-gray-800">Description (Optional)</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Enter Description"
                rows={4}
                className="focus:ring-accent resize-vertical w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
