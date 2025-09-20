import React, { useState } from "react";
import { Button, Card, DatePicker, Dropdown } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar01Icon } from "hugeicons-react";

const RevenueChart = ({ onDateChange, data }) => {
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

  const chartData = data || [
    { month: "Jan", filled: 12000, empty: 10000 },
    { month: "Feb", filled: 18000, empty: 12000 },
    { month: "Mar", filled: 20000, empty: 15000 },
    { month: "Apr", filled: 15000, empty: 13000 },
    { month: "May", filled: 25000, empty: 20000 },
    { month: "Jun", filled: 22000, empty: 18000 },
    { month: "Jul", filled: 30000, empty: 25000 },
    { month: "Aug", filled: 28000, empty: 22000 },
    { month: "Sep", filled: 35000, empty: 30000 },
    { month: "Oct", filled: 40000, empty: 35000 },
    { month: "Nov", filled: 45000, empty: 40000 },
    { month: "Dec", filled: 50000, empty: 45000 },
  ];

  return (
    <Card
      title={
        <p className="text-base sm:text-lg font-semibold">Total Revenue</p>
      }
      extra={
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
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
      }
      style={{ borderRadius: "24px", padding: "14px 0" }}
      className="shadow-sm border border-gray-100"
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="empty" stackId="a" fill="#d6fadb" />
          <Bar dataKey="filled" stackId="a" fill="#1f5226" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-col sm:flex-row justify-center sm:gap-6 gap-2 mt-4 text-xs sm:text-sm">
        <div className="flex items-center text-gray-500 font-medium gap-2">
          <span className="w-12 sm:w-20 h-5 sm:h-7 bg-[#d6fadb] block rounded-sm"></span>
          Empty recently filled Bar
        </div>
        <div className="flex items-center text-gray-500 font-medium gap-2">
          <span className="w-12 sm:w-20 h-5 sm:h-7 bg-[#1f5226] block rounded-sm"></span>
          Filled Bar
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;
