import React, { useState } from "react";
import { Button, Card, DatePicker, Dropdown } from "antd";
import { Calendar01Icon } from "hugeicons-react";
const MenuStatsCrad = ({ icon, title, value, footer, onDateChange, footerIcon }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("This Year");

  const menuItems = [
    { key: "year", label: "This Year" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "lastWeek", label: "Last Week" },
    { key: "lastMonth", label: "Last Month" },
  ];
  const handleMenuClick = ({ key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (item) {
      setSelectedLabel(item.label);
      if (onDateChange) onDateChange(item.key);
    }
  };

  const handleCalendarChange = (date, dateString) => {
    if (date) {
      setSelectedLabel(dateString);
      if (onDateChange) onDateChange(dateString);
    }
    setOpenCalendar(false);
  };

  const cardStyles = {
    "Total Sales": {
      card: "bg-[#1F5226] text-white",
      iconBg: "bg-white/20",
      footerBg: "bg-white/20 text-white",
      footerText: "text-white",
    },
    "Active Orders": {
      card: "bg-[#D6FADB] text-black",
      iconBg: "bg-white/50",
      footerBg: "bg-white/50 text-black",
      footerText: "text-black",
    },
    "Completed Orders": {
      card: "bg-[#B4FFC0] text-black",
      iconBg: "bg-white/50",
      footerBg: "bg-white/50 text-black",
      footerText: "text-black",
    },
    "Cancelled Orders": {
      card: "bg-[#FFE6E6] text-[#FF0000]",
      iconBg: "bg-[#FFD2D8]",
      footerBg: "bg-[#FFD2D8]",
      footerText: "text-[#FF0000]",
    },
  };

  const style = cardStyles[title] || cardStyles["Active Orders"];
  const showCalendar = "";

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
        title === "Total Sales"
          ? "bg-[#1F5226] text-white"
          : title === "Active Orders"
            ? "bg-[#D6FADB] text-black"
            : title === "Completed Orders"
              ? "bg-[#B4FFC0] text-black"
              : title === "Cancelled Orders"
                ? "bg-[#FFE6E6] text-red-600"
                : "bg-[#D6FADB] text-black"
      } `}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <p
            className={`text-xs font-semibold ${
              title === "Total Sales" ? "text-[#00BC1A]" : "text-gray-500"
            }`}
          >
            {title}
          </p>

          {showCalendar && (
            <div className="flex flex-wrap items-center gap-1">
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <Button
                  className="!border-none !bg-[#D6FADB] text-xs font-medium !text-[#1F5226]"
                  size="small"
                >
                  {selectedLabel}
                </Button>
              </Dropdown>

              <div className="relative">
                <Button
                  className="flex !h-7 !w-7 items-center justify-center !border-none !bg-[#D6FADB] !p-1 !text-[#1F5226]"
                  size="small"
                  icon={<Calendar01Icon size={14} />} // smaller icon
                  onClick={() => setOpenCalendar((prev) => !prev)}
                />

                {openCalendar && (
                  <div className="absolute right-0 z-50 mt-2 origin-top-right scale-90 rounded-lg shadow-lg">
                    <DatePicker
                      size="small"
                      open
                      onChange={handleCalendarChange}
                      onOpenChange={(open) => !open && setOpenCalendar(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end gap-4">
          <div
            className={`shrink-0 rounded-2xl p-3 ${
              title === "Total Sales"
                ? "bg-[#487B4F82]"
                : title === "Active Orders"
                  ? "bg-[#B8F2C0]"
                  : title === "Completed Orders"
                    ? "bg-[#90FD9F]"
                    : title === "Cancelled Orders"
                      ? "bg-[#FFD2D8]"
                      : "bg-[#D6FADB]" // default fallback
            } `}
          >
            <img src={icon} className="h-8 w-8 object-contain" alt={title} />
          </div>

          <div>
            <h3
              className={`text-2xl font-bold ${
                title === "Total Sales" ? "text-white" : "text-primary"
              }`}
            >
              {value}
            </h3>

            {footer && (
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-[16px] px-3 py-1 ${
                  title === "Total Sales"
                    ? "bg-[#487B4F82]"
                    : title === "Active Orders"
                      ? "bg-[#B8F2C0]"
                      : title === "Completed Orders"
                        ? "bg-[#90FD9F]"
                        : title === "Cancelled Orders"
                          ? "bg-[#FFD2D8]"
                          : "bg-[#D6FADB]" // default
                }`}
              >
                {footerIcon &&
                  React.createElement(footerIcon, {
                    size: 12,
                    className: "text-green-600",
                  })}
                <p className={`text-xs sm:text-sm ${style.footerText}`}>{footer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuStatsCrad;
