import React, { useState } from "react";
import { Dropdown, Button, DatePicker, Tag } from "antd";
import {
  FilterIcon,
  Cancel01Icon,
  Upload04Icon,
  Search02Icon,
} from "hugeicons-react";
import dayjs from "dayjs";

import { Button as CustomButton } from "../../../../../components";

const SearchAndFilters = ({ handleCSVExport }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState("thisMonth");
  const [customDate, setCustomDate] = useState(null);

  const filterMenuItems = [
    { key: "Completed", label: "Completed" },
    { key: "Pending", label: "Pending" },
    { key: "Canceled", label: "Canceled" },
  ];

  const dateRangeMenuItems = [
    { key: "thisMonth", label: "This Month" },
    { key: "thisWeek", label: "This Week" },
    { key: "today", label: "Today" },
    { key: "lastWeek", label: "Last Week" },
    { key: "lastMonth", label: "Last Month" },
  ];

  const handleFilterSelect = ({ key }) => setSelectedFilter(key);
  const handleClearFilter = () => setSelectedFilter(null);
  const handleDateRangeSelect = ({ key }) => {
    setSelectedDateRange(key);
    setCustomDate(null);
  };
  const handleDateChange = (date) => {
    setSelectedDateRange("custom");
    setCustomDate(date);
  };

  const getDateRangeLabel = () => {
    if (selectedDateRange === "custom" && customDate) {
      return dayjs(customDate).format("MMM DD, YYYY");
    }
    return dateRangeMenuItems.find((item) => item.key === selectedDateRange)?.label || "This Month";
  };

  return (
    <div className="mt-4 flex flex-col gap-3 text-[18px]">
      <div className="relative my-0 flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center md:my-3">
        <div className="relative w-full max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pl-3">
            <Search02Icon size={22} className="text-green-700" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="block w-full rounded-full bg-green-100 py-3 pr-12 pl-6 font-medium text-green-700 placeholder:text-base placeholder:text-green-700 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none md:text-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <Dropdown menu={{ items: dateRangeMenuItems, onClick: handleDateRangeSelect }}>
            <Button className="!bg-accent border-none text-[18px]">{getDateRangeLabel()}</Button>
          </Dropdown>

          <DatePicker
            onChange={handleDateChange}
            value={customDate}
            className="!bg-accent !w-auto !py-2 text-[18px]"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown menu={{ items: filterMenuItems, onClick: handleFilterSelect }}>
            <Button icon={<FilterIcon size={20} />} className="border-none !bg-gray-100 !text-base">
              Filter
            </Button>
          </Dropdown>

          {selectedFilter && (
            <Tag
              style={{
                padding: "9px 20px",
                fontSize: "16px",
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
              color="white"
              className="font-semibold"
              closable
              onClose={handleClearFilter}
              closeIcon={
                <span className="ml-2 cursor-pointer rounded-full bg-gray-200 p-1">
                  <Cancel01Icon size={14} />
                </span>
              }
            >
              {selectedFilter}
            </Tag>
          )}
        </div>

        <CustomButton
          leftIcon={<Upload04Icon strokeWidth={2} size={20} />}
          type="primary"
          size="md"
          className="ml-auto text-base"
          onClick={handleCSVExport}
        >
          Export
        </CustomButton>
      </div>
    </div>
  );
};

export default SearchAndFilters;
