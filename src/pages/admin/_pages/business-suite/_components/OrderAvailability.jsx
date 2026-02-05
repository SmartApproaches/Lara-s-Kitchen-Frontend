import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Switch, TimePicker, Spin } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import dayjs from "dayjs";

import {
  useGetBusinessHoursQuery,
  useUpdateBusinessHoursMutation,
} from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";

const DAYS = [
  { label: "Sunday", value: "SUN", short: "Sun" },
  { label: "Monday", value: "MON", short: "Mon" },
  { label: "Tuesday", value: "TUE", short: "Tue" },
  { label: "Wednesday", value: "WED", short: "Wed" },
  { label: "Thursday", value: "THU", short: "Thu" },
  { label: "Friday", value: "FRI", short: "Fri" },
  { label: "Saturday", value: "SAT", short: "Sat" },
];

const OrderAvailability = () => {
  const navigate = useNavigate();
  const {
    data: fetchedData,
    isLoading: isLoadingBusinessHours,
    isError: isErrorBusinessHours,
  } = useGetBusinessHoursQuery();

  const [updateBusinessHours, { isLoading }] = useUpdateBusinessHoursMutation();
  const [businessHours, setBusinessHours] = useState([]);
  const [originalHours, setOriginalHours] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const initialHours = DAYS.map((day) => {
      const apiDay = fetchedData?.data?.find((d) => d.day_of_week === day.value);

      if (apiDay) {
        return {
          id: apiDay.id,
          day_of_week: apiDay.day_of_week,
          is_open: apiDay.is_open,
          opening_time: apiDay.opening_time.substring(0, 5),
          closing_time: apiDay.closing_time.substring(0, 5),
        };
      }

      return {
        day_of_week: day.value,
        is_open: false,
        opening_time: "09:00",
        closing_time: "17:00",
      };
    });

    setBusinessHours(initialHours);
    setOriginalHours(initialHours);
  }, [fetchedData]);

  const handleToggle = (dayOfWeek) => {
    setBusinessHours((prev) =>
      prev.map((item) => {
        if (item.day_of_week === dayOfWeek) {
          const newIsOpen = !item.is_open;
          if (newIsOpen && (!item.opening_time || !item.closing_time)) {
            return {
              ...item,
              is_open: newIsOpen,
              opening_time: "09:00",
              closing_time: "17:00",
            };
          }
          return { ...item, is_open: newIsOpen };
        }
        return item;
      }),
    );
  };

  const handleTimeChange = (dayOfWeek, field, time) => {
    if (!time) return;

    const timeString = time.format("HH:mm");
    setBusinessHours((prev) =>
      prev.map((item) =>
        item.day_of_week === dayOfWeek ? { ...item, [field]: timeString } : item,
      ),
    );
  };

  const handleSave = async () => {
    try {
      for (const day of businessHours) {
        if (day.is_open) {
          const opening = dayjs(day.opening_time, "HH:mm");
          const closing = dayjs(day.closing_time, "HH:mm");
          if (closing.isBefore(opening) || closing.isSame(opening)) {
            toast.error(
              `${DAYS.find((d) => d.value === day.day_of_week)?.label}: Closing time must be after opening time`,
            );
            return;
          }
        }
      }

      const hoursToUpdate = businessHours.map((day) => ({
        day_of_week: day.day_of_week,
        is_open: day.is_open,
        opening_time: day.opening_time || "09:00",
        closing_time: day.closing_time || "17:00",
      }));

      await updateBusinessHours({ hours: hoursToUpdate }).unwrap();
      toast.success("Business hours updated successfully");

      setOriginalHours(businessHours);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update business hours");
    }
  };

  const handleCancel = () => {
    setBusinessHours([...originalHours]);
    navigate(-1);
  };

  const getDayData = (dayValue) => {
    return businessHours.find((item) => item.day_of_week === dayValue);
  };

  if (isLoadingBusinessHours && businessHours.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (isErrorBusinessHours) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-sm text-red-600 sm:text-base">Failed to load business hours</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-1">
              <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="mt-1 shrink-0 cursor-pointer text-gray-600 hover:text-gray-900 sm:mt-0"
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} size={20} className="sm:h-6 sm:w-6" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                  Order Availability
                </h1>
              </div>
              <p className="mt-1 pl-8 text-xs text-gray-500 sm:mt-2 sm:pl-10 sm:text-sm md:pl-0 md:text-base">
                Manage your restaurant's available ordering hours.
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:flex-none sm:px-6 sm:text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-primary flex-1 rounded-md px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 sm:flex-none sm:px-6 sm:text-sm"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="divide-y divide-gray-200">
            {DAYS.map((day) => {
              const dayData = getDayData(day.value);

              return (
                <div
                  key={day.value}
                  className="flex flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-0"
                >
                  <div className="flex items-center justify-between md:w-32">
                    <span className="text-sm font-medium text-gray-900 sm:text-base">
                      {isMobile ? day.short : day.label}
                    </span>

                    <div className="flex items-center gap-2 md:hidden">
                      <Switch
                        checked={dayData?.is_open || false}
                        onChange={() => handleToggle(day.value)}
                        style={{
                          backgroundColor: dayData?.is_open ? "#16a34a" : undefined,
                        }}
                      />
                      <span
                        className={`text-xs font-medium ${
                          dayData?.is_open ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {dayData?.is_open ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex md:flex-1 md:items-center md:gap-6 lg:gap-8">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={dayData?.is_open || false}
                        onChange={() => handleToggle(day.value)}
                        style={{
                          backgroundColor: dayData?.is_open ? "#16a34a" : undefined,
                        }}
                      />
                      <span
                        className={`text-sm font-medium ${
                          dayData?.is_open ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {dayData?.is_open ? "Open" : "Closed"}
                      </span>
                    </div>

                    {dayData?.is_open && (
                      <>
                        <div className="flex items-center gap-2">
                          <TimePicker
                            value={dayjs(dayData.opening_time, "HH:mm")}
                            onChange={(time) => handleTimeChange(day.value, "opening_time", time)}
                            format="hh:mm A"
                            use12Hours
                            className="w-32 lg:w-36"
                            size="large"
                            placeholder="Opening time"
                          />
                        </div>

                        <span className="text-sm text-gray-500">To</span>

                        <div className="flex items-center gap-2">
                          <TimePicker
                            value={dayjs(dayData.closing_time, "HH:mm")}
                            onChange={(time) => handleTimeChange(day.value, "closing_time", time)}
                            format="hh:mm A"
                            use12Hours
                            className="w-32 lg:w-36"
                            size="large"
                            placeholder="Closing time"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {dayData?.is_open && (
                    <div className="flex flex-col gap-2 pl-0 md:hidden">
                      <div className="flex w-full items-center gap-2">
                        <span className="w-16 shrink-0 text-xs text-gray-500">Opens:</span>
                        <TimePicker
                          value={dayjs(dayData.opening_time, "HH:mm")}
                          onChange={(time) => handleTimeChange(day.value, "opening_time", time)}
                          format="hh:mm A"
                          use12Hours
                          className="flex-1"
                          size="middle"
                          placeholder="Opening time"
                        />
                      </div>

                      <div className="flex w-full items-center gap-2">
                        <span className="w-16 shrink-0 text-xs text-gray-500">Closes:</span>
                        <TimePicker
                          value={dayjs(dayData.closing_time, "HH:mm")}
                          onChange={(time) => handleTimeChange(day.value, "closing_time", time)}
                          format="hh:mm A"
                          use12Hours
                          className="flex-1"
                          size="middle"
                          placeholder="Closing time"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAvailability;
