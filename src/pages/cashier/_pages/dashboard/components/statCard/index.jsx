import React, { useState } from "react";
import { Button, Card, DatePicker, Dropdown } from "antd";
import { Calendar01Icon } from "hugeicons-react";
const StatsCrad = ({
  icon,
  title,
  value,
  footer,
  onDateChange,
  footerIcon,
}) => {
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
  const showCalendar = title === "Total Sales" || title === "Completed Orders";

  return (
    <Card
      className="rounded-4xl transition-all duration-200 hover:scale-[1.02]"
      bodyStyle={{
        padding: "12px",
        borderRadius: "9px",
        backgroundColor:
          title === "Total Sales"
            ? "#1F5226"
            : title === "Active Orders"
            ? "#D6FADB"
            : title === "Completed Orders"
            ? "#B4FFC0"
            : title === "Cancelled Orders"
            ? "#FFE6E6"
            : "#D6FADB", // default fallback
        color:
          title === "Cancelled Orders"
            ? "#FF0000"
            : title === "Total Sales"
            ? "#fff"
            : "#000",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs font-semibold text-gray-500">{title}</p>

          {showCalendar && (
            <div className="flex flex-wrap items-center gap-1">
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <Button
                  className="!bg-[#D6FADB] text-xs !border-none !text-[#1F5226] font-medium"
                  size="small"
                >
                  {selectedLabel}
                </Button>
              </Dropdown>

              <div className="relative">
                <Button
                  className="!bg-[#D6FADB] !border-none !text-[#1F5226] !p-1 !h-7 !w-7 flex items-center justify-center"
                  size="small"
                  icon={<Calendar01Icon size={14} />} // smaller icon
                  onClick={() => setOpenCalendar((prev) => !prev)}
                />

                {openCalendar && (
                  <div className="absolute right-0 mt-2 z-50 shadow-lg rounded-lg scale-90 origin-top-right">
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
          <div className="p-3 bg-accent rounded-2xl shrink-0">
            <img src={icon} className="w-8 h-8 object-contain" alt={title} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-primary">{value}</h3>

            {footer && (
              <div
                className={`bg-accent rounded-[16px] px-3 py-1 mt-2 inline-flex items-center gap-1`}
              >
                {footerIcon &&
                  React.createElement(footerIcon, {
                    size: 12,
                    className: "text-green-600",
                  })}
                <p className={`text-xs sm:text-sm ${style.footerText}`}>
                  {footer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCrad;
