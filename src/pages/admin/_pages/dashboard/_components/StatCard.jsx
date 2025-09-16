import React, { useState } from "react";
import { Button, Card, DatePicker, Dropdown } from "antd";
import { Calendar01Icon } from "hugeicons-react";

const StatCard = ({
  icon,
  title,
  value,
  footer,
  isSales,
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

  return (
    <Card className="rounded-xl hover:drop-shadow-md transition-all duration-200 hover:scale-[1.02] shadow-sm border border-gray-100">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-base font-semibold text-gray-500">{title}</p>

          {isSales && (
            <div className="flex flex-wrap items-center gap-2">
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <Button
                  className="!bg-[#F0EDED] !border-none !text-[#1F5226] font-medium"
                  size="small"
                >
                  {selectedLabel}
                </Button>
              </Dropdown>

              <div className="relative">
                <Button
                  className="!bg-[#F0EDED] !border-none !text-[#1F5226]"
                  size="small"
                  icon={<Calendar01Icon size={18} />}
                  onClick={() => setOpenCalendar((prev) => !prev)}
                />

                {openCalendar && (
                  <div className="absolute right-0 mt-2 z-50 shadow-lg rounded-lg">
                    <DatePicker
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
            <img
              src={icon}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              alt={title}
            />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              {value}
            </h3>

            {footer && (
              <div className="bg-accent rounded-[16px] px-3 py-1 mt-2 inline-flex items-center gap-1">
                {footerIcon &&
                  React.createElement(footerIcon, {
                    size: 12,
                    className: "text-green-600",
                  })}
                <p className="text-xs sm:text-sm text-green-600">{footer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
