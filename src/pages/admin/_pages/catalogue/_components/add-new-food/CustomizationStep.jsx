import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox, Divider, InputNumber, Typography } from "antd";

const { Title } = Typography;

const CustomizationsStep = ({ control, watch }) => {
  const watchedValues = watch();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <Title level={4}>Customizations / Add-ons</Title>

        <div className="mb-6 flex flex-col gap-y-2">
          <p className="text-base font-normal text-[#414141]">Calorie size</p>
          <Controller
            name="calorieSize"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Enter amount"
                className="w-full"
                min={0}
                addonAfter="kcal"
              />
            )}
          />
        </div>

        <div className="mb-6 flex flex-col gap-y-2">
          <p className="text-base font-normal text-[#414141]">Preparation Time</p>
          <Controller
            name="preparationTime"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Enter amount"
                className="w-full"
                min={0}
                addonAfter="minutes"
              />
            )}
          />
        </div>

        <div className="mb-6 flex flex-col gap-y-2">
          <p className="text-base font-semibold">Portion Sizes</p>

          <div className="space-y-1">
            <div className="flex items-center justify-between rounded-lg p-3">
              <Controller
                name="portionSizes.small.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Small
                  </Checkbox>
                )}
              />
              <div className="flex items-center gap-2">
                <div className="bg-accent rounded-[6px] px-3 py-2 font-medium text-green-900">
                  Price:
                </div>
                <Controller
                  name="portionSizes.small.price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="£ 10.00"
                      className="w-24"
                      min={0}
                      step={0.01}
                      disabled={!watchedValues.portionSizes?.small?.enabled}
                      formatter={(value) => `£ ${value}`}
                      parser={(value) => value.replace("£ ", "")}
                    />
                  )}
                />
              </div>
            </div>
            <Divider type="horizontal" style={{ margin: "5px 0" }} className="h-1" />

            <div className="flex items-center justify-between rounded-lg p-3">
              <Controller
                name="portionSizes.medium.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Medium
                  </Checkbox>
                )}
              />
              <div className="flex items-center gap-2">
                <div className="bg-accent rounded-[6px] px-3 py-2 font-medium text-green-900">
                  Price:
                </div>
                <Controller
                  name="portionSizes.medium.price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="£ 10.00"
                      className="w-24"
                      min={0}
                      step={0.01}
                      disabled={!watchedValues.portionSizes?.medium?.enabled}
                      formatter={(value) => `£ ${value}`}
                      parser={(value) => value.replace("£ ", "")}
                    />
                  )}
                />
              </div>
            </div>
            <Divider type="horizontal" style={{ margin: "5px 0" }} className="h-1" />
            <div className="flex items-center justify-between rounded-lg p-3">
              <Controller
                name="portionSizes.large.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Large
                  </Checkbox>
                )}
              />
              <div className="flex items-center gap-2">
                <div className="bg-accent rounded-[6px] px-3 py-2 font-medium text-green-900">
                  Price:
                </div>
                <Controller
                  name="portionSizes.large.price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="Enter amount"
                      className="w-24"
                      min={0}
                      step={0.01}
                      disabled={!watchedValues.portionSizes?.large?.enabled}
                      formatter={(value) => `£ ${value}`}
                      parser={(value) => value.replace("£ ", "")}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-base font-semibold">Add ons</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg p-3">
              <Controller
                name="addOns.drinks.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Drinks
                  </Checkbox>
                )}
              />
              <div className="flex items-center gap-2">
                <div className="bg-accent rounded-[6px] px-3 py-2 font-medium text-green-900">
                  Price:
                </div>
                <Controller
                  name="addOns.drinks.price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="£ 10.00"
                      className="w-24"
                      min={0}
                      step={0.01}
                      disabled={!watchedValues.addOns?.drinks?.enabled}
                      formatter={(value) => `£ ${value}`}
                      parser={(value) => value.replace("£ ", "")}
                    />
                  )}
                />
              </div>
            </div>
            <Divider type="horizontal" style={{ margin: "5px 0" }} className="h-1" />
            <div className="flex items-center justify-between rounded-lg p-3">
              <Controller
                name="addOns.extraProteins.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Extra Proteins
                  </Checkbox>
                )}
              />
              <div className="flex items-center gap-2">
                <div className="bg-accent rounded-[6px] px-3 py-2 font-medium text-green-900">
                  Price:
                </div>
                <Controller
                  name="addOns.extraProteins.price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="£ 10.00"
                      className="w-24"
                      min={0}
                      step={0.01}
                      disabled={!watchedValues.addOns?.extraProteins?.enabled}
                      formatter={(value) => `£ ${value}`}
                      parser={(value) => value.replace("£ ", "")}
                    />
                  )}
                />
              </div>
            </div>
            <Divider type="horizontal" style={{ margin: "5px 0" }} className="h-1" />
            <div className="flex items-center justify-between rounded-lg p-3">
              <Controller
                name="addOns.sideDish.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Side Dish
                  </Checkbox>
                )}
              />
              <div className="flex items-center gap-2">
                <div className="bg-accent rounded-[6px] px-3 py-2 font-medium text-green-900">
                  Price:
                </div>
                <Controller
                  name="addOns.sideDish.price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="Enter amount"
                      className="w-24"
                      min={0}
                      step={0.01}
                      disabled={!watchedValues.addOns?.sideDish?.enabled}
                      formatter={(value) => `£ ${value}`}
                      parser={(value) => value.replace("£ ", "")}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationsStep;
