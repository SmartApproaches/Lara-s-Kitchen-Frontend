import React, { useState } from "react";
import { Button, Card, DatePicker, Dropdown } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar01Icon } from "hugeicons-react";

const { RangePicker } = DatePicker;

const RevenueChart = ({ onDateChange, data }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
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
      setOpenMenu(false);
      if (onDateChange) onDateChange({ type: "preset", value: key });
    }
  };

  const handleCalendarChange = (dates, dateStrings) => {
    if (dates && dateStrings.length === 2) {
      const [from, to] = dateStrings;
      setSelectedLabel(`${from} → ${to}`);
      setOpenCalendar(false);
      if (onDateChange) onDateChange({ type: "custom", from, to });
    }
  };

  const chartData = data?.map((item) => ({
    month: item?.label,
    value: item?.value,
  }));

  return (
    <Card
      title={<p className="text-base font-semibold sm:text-lg">Total Revenue</p>}
      extra={
        <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center sm:gap-3">
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomLeft"
            trigger={["click"]}
            open={openMenu}
            onOpenChange={(flag) => setOpenMenu(flag)}
          >
            <Button className="!border-none !bg-[#F0EDED] font-medium !text-[#1F5226]" size="small">
              {selectedLabel}
            </Button>
          </Dropdown>

          <div className="relative">
            <Button
              className="!border-none !bg-[#F0EDED] !text-[#1F5226]"
              size="small"
              icon={<Calendar01Icon size={18} />}
              onClick={() => setOpenCalendar((prev) => !prev)}
            />

            {openCalendar && (
              <div className="absolute right-0 z-50 mt-2 rounded-lg shadow-lg">
                <RangePicker
                  open
                  onChange={handleCalendarChange}
                  onOpenChange={(open) => setOpenCalendar(open)}
                />
              </div>
            )}
          </div>
        </div>
      }
      style={{ borderRadius: "24px", padding: "14px 0" }}
      className="border border-gray-100 shadow-sm"
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1f5226" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-gray-500 sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="block h-5 w-12 rounded-sm bg-[#1f5226] sm:h-7 sm:w-20"></span>
          Revenue
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;
