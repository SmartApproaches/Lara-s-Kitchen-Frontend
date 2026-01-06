import React from "react";
import { Link } from "react-router-dom";
import { Alert, Skeleton } from "antd";

import BusinessSuiteHeader from "./_components/BusinessSuiteHeader";
import {
  useGetBusinessHoursQuery,
  useGetDeliveryFeeQuery,
  useGetGeofenceQuery,
} from "../../../../redux/slices/super-admin/businessSuiteApiSlice";
import { ICONS } from "../../../../constants";

const BusinessSuite = () => {
  const {
    data: businessHours,
    isLoading: isLoadingBusinessHours,
    isError: isErrorBusinessHours,
  } = useGetBusinessHoursQuery();
  const {
    data: deliveryFee,
    isLoading: isLoadingDeliveryFee,
    isError: isErrorDeliveryFee,
  } = useGetDeliveryFeeQuery();
  const {
    data: geofence,
    isLoading: isLoadingGeofence,
    isError: isErrorGeofence,
  } = useGetGeofenceQuery();

  const dineInGeofence = geofence?.data.find((fence) => fence.type === "dine_in");
  const deliveryGeofence = geofence?.data.find((fence) => fence.type === "delivery");

  const dineInRadius = dineInGeofence ? `${dineInGeofence.radius}km` : "N/A";
  const deliveryRadius = deliveryGeofence ? `${deliveryGeofence.radius}km` : "N/A";

  const formatTime = (time) => {
    if (!time) return "";
    const [hours] = time.split(":");
    const hour = parseInt(hours, 10);
    if (hour === 0) return "12am";
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return "12pm";
    return `${hour - 12}pm`;
  };

  const getDayAbbr = (dayOfWeek) => {
    const days = {
      SUN: "sun",
      MON: "mon",
      TUE: "tue",
      WED: "wed",
      THU: "thu",
      FRI: "fri",
      SAT: "sat",
    };
    return days[dayOfWeek] || dayOfWeek.toLowerCase();
  };

  const groupBusinessHours = (hours) => {
    if (!hours?.data || !Array.isArray(hours.data)) return [];

    const openDays = hours.data.filter((day) => day.is_open);

    if (openDays.length === 0) return [];

    const grouped = {};

    openDays.forEach((day) => {
      const key = `${day.opening_time}-${day.closing_time}`;
      if (!grouped[key]) {
        grouped[key] = {
          opening_time: day.opening_time,
          closing_time: day.closing_time,
          days: [],
        };
      }
      grouped[key].days.push(day.day_of_week);
    });

    return Object.values(grouped).map((group) => {
      const openTime = formatTime(group.opening_time);
      const closeTime = formatTime(group.closing_time);

      const dayOrder = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      const sortedDays = group.days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

      let daysLabel;

      const isConsecutive = sortedDays.every((day, index) => {
        if (index === 0) return true;
        const prevIndex = dayOrder.indexOf(sortedDays[index - 1]);
        const currIndex = dayOrder.indexOf(day);
        return currIndex === prevIndex + 1;
      });

      if (isConsecutive && sortedDays.length > 1) {
        const firstDay = getDayAbbr(sortedDays[0]);
        const lastDay = getDayAbbr(sortedDays[sortedDays.length - 1]);
        daysLabel = `${firstDay}-${lastDay}`;
      } else {
        daysLabel = sortedDays.map(getDayAbbr).join(", ");
      }

      return {
        timeRange: `${openTime}-${closeTime}`,
        days: daysLabel,
      };
    });
  };

  const renderBusinessHours = () => {
    const groupedHours = groupBusinessHours(businessHours);

    if (groupedHours.length === 0) {
      return <p className="text-sm text-gray-500">Closed</p>;
    }

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {groupedHours.map((group, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg bg-[#EFFFF1] px-3 py-2">
            <span className="text-sm font-semibold text-[#0CA921]">{group.timeRange}</span>
            <span className="rounded-md bg-[#D6FADB] px-2 py-1 text-xs font-medium text-[#00BC1A]">
              {group.days}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const suiteCards = [
    {
      description: "Order Availability",
      value: businessHours?.data || null,
      icon: ICONS.suiteClockIcon,
      link: "/admin/business-suite/order-availability",
    },
    {
      description: "Delivery Fee",
      value: deliveryFee?.data?.base_delivery_fee || "N/A",
      icon: ICONS.suiteDeliveryIcon,
      link: "/admin/business-suite/delivery-fee",
    },
    {
      description: "Geo Fence",
      value: null,
      icon: ICONS.suiteGeoFenceIcon,
      link: "/admin/business-suite/geo-fence",
    },
  ];

  const renderSuiteCards = () => {
    if (isLoadingBusinessHours || isLoadingDeliveryFee || isLoadingGeofence) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ));
    }

    if (isErrorBusinessHours || isErrorDeliveryFee || isErrorGeofence) {
      return (
        <div className="col-span-full space-y-3">
          {isErrorBusinessHours && (
            <Alert
              message="Error loading Business Hours"
              description="Failed to fetch Business Hours data. Please try again later."
              type="error"
              showIcon
            />
          )}
          {isErrorDeliveryFee && (
            <Alert
              message="Error loading Delivery Fee"
              description="Failed to fetch Delivery Fee data. Please try again later."
              type="error"
              showIcon
            />
          )}
          {isErrorGeofence && (
            <Alert
              message="Error loading Geo Fence"
              description="Failed to fetch Geo Fence data. Please try again later."
              type="error"
              showIcon
            />
          )}
        </div>
      );
    }

    return suiteCards.map((card, index) => (
      <Link
        to={card?.link}
        key={index}
        className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-md transition-transform hover:scale-105 hover:shadow-lg sm:p-4 md:m-4"
      >
        <img src={card.icon} alt={card.description} className="mb-2 h-10 w-10 sm:h-12 sm:w-12" />
        <p className="px-2 text-center text-sm font-medium sm:text-base md:text-lg lg:text-xl">
          {card.description}
        </p>

        {index === 1 ? (
          <div className="mt-2 flex w-full max-w-xs items-center justify-center gap-x-2 rounded-xl bg-[#EFFFF1] p-2 text-sm font-semibold">
            <div className="flex-shrink-0 rounded-xl bg-[#D6FADB] px-3 py-2 whitespace-nowrap text-[#00BC1A]">
              Fixed fee
            </div>
            <h2 className="font-bold text-[#0CA921]">£{card.value}</h2>
          </div>
        ) : index === 2 ? (
          <div className="mt-2 flex w-full flex-col gap-2 sm:max-w-md lg:max-w-lg">
            <div className="flex min-w-0 flex-1 items-center gap-x-2 rounded-xl bg-[#EFFFF1] p-2 text-xs font-semibold sm:text-sm">
              <div className="flex-shrink-0 rounded-xl bg-[#D6FADB] px-2 py-1.5 text-xs whitespace-nowrap text-[#00BC1A] sm:px-3 sm:py-2 sm:text-sm">
                Dine in
              </div>
              <h2 className="truncate text-xs text-[#0CA921] sm:text-sm">Radius: {dineInRadius}</h2>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-x-2 rounded-xl bg-[#EFFFF1] p-2 text-xs font-semibold sm:text-sm">
              <div className="flex-shrink-0 rounded-xl bg-[#D6FADB] px-2 py-1.5 text-xs whitespace-nowrap text-[#00BC1A] sm:px-3 sm:py-2 sm:text-sm">
                Delivery
              </div>
              <h2 className="truncate text-xs text-[#0CA921] sm:text-sm">
                Radius: {deliveryRadius}
              </h2>
            </div>
          </div>
        ) : (
          renderBusinessHours()
        )}
      </Link>
    ));
  };

  return (
    <>
      <BusinessSuiteHeader />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:w-full md:gap-6">
        {renderSuiteCards()}
      </div>
    </>
  );
};

export default BusinessSuite;
