import React, { useState } from "react";
import { Card, DatePicker, Dropdown, Menu } from "antd";
import { Calendar01Icon } from "hugeicons-react";
import { ICONS } from "../../../../../../constants";

const stats = [
  {
    title: "Food in stock",
    count: 10,
    color: "text-[#00BC1A]",
    icon: ICONS.dish,
  },
  {
    title: "Food out of stock",
    count: 5,
    color: "text-[#FF0000]",
    icon: ICONS.cancelledIcon,
  },
  {
    title: "Drinks in stock",
    count: 150,
    color: "text-[#00BC1A]",
    icon: ICONS.drinksInStock,
  },
  {
    title: "Drinks out of stock",
    count: 20,
    color: "text-[#FF0000]",
    icon: ICONS.drinksOutofStock,
  },
];

const MenuStats = ({ onDateChange }) => {
  const [openCardIndex, setOpenCardIndex] = useState(null); // no <number | null>
  const [selectedLabels, setSelectedLabels] = useState(stats.map(() => "Today"));

  const menuItems = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "lastWeek", label: "Last Week" },
    { key: "lastMonth", label: "Last Month" },
    { key: "year", label: "This Year" },
  ];

  const handleMenuClick = (cardIndex, { key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (item) {
      const newLabels = [...selectedLabels];
      newLabels[cardIndex] = item.label;
      setSelectedLabels(newLabels);

      if (onDateChange) onDateChange(item.key, cardIndex);
    }
  };

  const handleCalendarChange = (cardIndex, date, dateString) => {
    if (date) {
      const newLabels = [...selectedLabels];
      newLabels[cardIndex] = dateString;
      setSelectedLabels(newLabels);

      if (onDateChange) onDateChange(dateString, cardIndex);
    }
    setOpenCardIndex(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, idx) => (
        <Card
          key={idx}
          className="relative rounded-2xl border border-gray-100 shadow-sm"
          bodyStyle={{ padding: "1rem" }}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className={`font-medium ${item.color}`}>{item.title}</h3>

            <Dropdown
              overlay={
                <Menu onClick={(info) => handleMenuClick(idx, info)}>
                  {menuItems.map((m) => (
                    <Menu.Item key={m.key}>{m.label}</Menu.Item>
                  ))}
                </Menu>
              }
              trigger={["click"]}
            >
              <div
                className="flex cursor-pointer items-center space-x-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-600"
                onClick={(e) => e.preventDefault()}
              >
                <span>{selectedLabels[idx]}</span>
                <Calendar01Icon
                  className="h-4 w-4"
                  onClick={() => setOpenCardIndex(openCardIndex === idx ? null : idx)}
                />
              </div>
            </Dropdown>
          </div>

          {/* Body */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-xl bg-gray-100 p-3">
              <img src={item.icon} alt="" className="h-10 w-10" />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
          </div>

          {/* Date Picker (per card) */}
          {openCardIndex === idx && (
            <div className="absolute top-12 right-2 z-50 rounded-lg bg-white shadow-lg">
              <DatePicker
                size="small"
                open
                onChange={(date, dateString) => handleCalendarChange(idx, date, dateString)}
                onOpenChange={(open) => !open && setOpenCardIndex(null)}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MenuStats;
