import React, { useState } from "react";
import { Dropdown, Button, DatePicker } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import dayjs from "dayjs";

const KitchenDashboardHeader = ({ userName, onDateChange }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("This Year");

  // Backend-supported periods
  const menuItems = [
    { key: "today", label: "Today", period: "today" },
    { key: "yesterday", label: "Yesterday", period: "yesterday" },
    { key: "last_week", label: "Last Week", period: "last_week" },
    { key: "last_30_days", label: "Last 30 days", period: "last_30_days" },
    { key: "last_1_year", label: "Last 1 Year", period: "last_1_year" },
  ];

  // =========================
  // PERIOD FILTER
  // =========================
  const handleMenuClick = ({ key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (!item) return;

    setSelectedLabel(item.label);

    onDateChange?.({
      from: null,
      to: null,
      period: item.period,
    });
  };

  // =========================
  // CUSTOM DATE FILTER
  // =========================
  const handleCalendarChange = (date) => {
    if (!date) return;

    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    setSelectedLabel(formattedDate);

    onDateChange?.({
      from: formattedDate,
      to: formattedDate,
      period: null,
    });

    setOpenCalendar(false);
  };

  return (
    <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-green-900 lg:text-4xl">Hello, {userName}</h1>
        <p className="mt-1 text-lg text-green-600">This is what is happening in your store</p>
      </div>

      <div className="mt-4 flex items-center gap-3 sm:mt-0">
        {/* PERIOD DROPDOWN */}
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <Button
            style={{
              backgroundColor: "#b9f8cf",
              border: "none",
              color: "#1F5226",
              fontWeight: 500,
            }}
          >
            {selectedLabel}
          </Button>
        </Dropdown>

        {/* DATE PICKER */}
        <div className="relative">
          <Button
            style={{
              backgroundColor: "#b9f8cf",
              color: "#1F5226",
              border: "none",
            }}
            icon={<HugeiconsIcon icon={Calendar01Icon} size={20} />}
            onClick={() => setOpenCalendar((prev) => !prev)}
          />

          {openCalendar && (
            <div className="absolute right-0 z-50 mt-2 rounded-lg bg-white shadow-lg">
              <DatePicker
                open
                onChange={handleCalendarChange}
                onOpenChange={(open) => !open && setOpenCalendar(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboardHeader;
