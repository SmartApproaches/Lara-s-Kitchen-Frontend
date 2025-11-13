import React, { useState } from "react";
import { Card, Dropdown, Menu, Skeleton } from "antd";
import { Calendar01Icon } from "hugeicons-react";
import { ICONS } from "../../../../../../constants";
import { useGetCashierMenuSummaryQuery } from "../../../../../../redux/slices/cashier/menuApiSlice";

const MenuStats = ({ onDateChange }) => {
  const { data, isLoading } = useGetCashierMenuSummaryQuery();

  const [selectedLabels, setSelectedLabels] = useState(Array(4).fill("Today"));

  const menuItems = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "lastWeek", label: "Last Week" },
    { key: "lastMonth", label: "Last Month" },
    { key: "year", label: "This Year" },
  ];

  const handleMenuClick = (cardIndex, { key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (!item) return;

    const newLabels = [...selectedLabels];
    newLabels[cardIndex] = item.label;
    setSelectedLabels(newLabels);

    onDateChange && onDateChange(item.key, cardIndex);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, idx) => (
            <Card key={idx} className="rounded-2xl shadow-sm">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          ))}
      </div>
    );
  }

  const summary = data?.data || {};

  const stats = [
    {
      title: "Food in stock",
      count: summary.food_in_stock || 0,
      color: "text-[#00BC1A]",
      icon: ICONS.dish,
    },
    {
      title: "Food out of stock",
      count: summary.food_out_of_stock || 0,
      color: "text-[#FF0000]",
      icon: ICONS.cancelledIcon,
    },
    {
      title: "Drinks in stock",
      count: summary.drinks_in_stock || 0,
      color: "text-[#00BC1A]",
      icon: ICONS.drinksInStock,
    },
    {
      title: "Drinks out of stock",
      count: summary.drinks_out_of_stock || 0,
      color: "text-[#FF0000]",
      icon: ICONS.drinksOutofStock,
    },
  ];

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
                onClick={(e) => e.preventDefault()}
                className="flex cursor-pointer items-center space-x-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-600"
              >
                <span>{selectedLabels[idx]}</span>
                <Calendar01Icon className="h-4 w-4" />
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
        </Card>
      ))}
    </div>
  );
};

export default MenuStats;
