import React, { useState } from "react";
import { Dropdown, Button, DatePicker } from "antd";
import { Calendar01Icon } from "hugeicons-react";
const { RangePicker } = DatePicker;

const DashboardHeader = ({ userName, onDateChange }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("This Year");

  const menuItems = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "lastWeek", label: "Last Week" },
    { key: "lastMonth", label: "Last 30 days" },
    { key: "lastYear", label: "Last 1 Year" },
  ];

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (item) {
      setSelectedLabel(item.label);
      if (onDateChange) onDateChange({ type: "preset", value: key });
    }
  };

  const handleCalendarChange = (dates, dateStrings) => {
    if (dates && dateStrings.length === 2) {
      const [from, to] = dateStrings;
      setSelectedLabel(`${from} → ${to}`);
      if (onDateChange) onDateChange({ type: "custom", from, to });
    }
    setOpenCalendar(false);
  };

  return (
    <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-green-900 lg:text-4xl">Hello, {userName}</h1>
        <p className="mt-1 text-lg text-green-600">This is what is happening in your store</p>
      </div>

      <div className="mt-4 flex items-center gap-3 sm:mt-0">
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

        <div className="relative">
          <Button
            style={{
              backgroundColor: "#b9f8cf",
              color: "#1F5226",
              border: "none",
            }}
            icon={<Calendar01Icon size={20} />}
            onClick={() => setOpenCalendar((prev) => !prev)}
          />

          {openCalendar && (
            <div className="absolute right-0 z-50 mt-2 rounded-lg bg-white p-2 shadow-lg">
              <RangePicker
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

export default DashboardHeader;
