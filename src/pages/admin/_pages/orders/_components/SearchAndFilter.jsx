import React, { useState } from "react";
import { Dropdown, Button, DatePicker, Tag } from "antd";
import {
  FilterIcon,
  Cancel01Icon,
  Upload04Icon,
  Search02Icon,
  Calendar01Icon,
} from "hugeicons-react";

import { Button as CustomButton } from "../../../../../components";

const { RangePicker } = DatePicker;

const SearchAndFilters = ({
  handleCSVExport,
  onDateChange,
  onSearchChange,
  onFilterChange,
  onOrderTypeChange,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Last Month");
  const [searchTerm, setSearchTerm] = useState("");

  const filterMenuItems = [
    { key: "completed", label: "Completed" },
    { key: "pending", label: "Pending" },
    { key: "cancelled", label: "Cancelled" },
    { key: "general", label: "General" },
  ];

  const orderTypeMenuItems = [
    { key: "all", label: "All" },
    { key: "specialOffer", label: "Special Offer" },
    { key: "generalOrder", label: "General Order" },
  ];

  const dateRangeMenuItems = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "last_week", label: "Last Week" },
    { key: "last_30_days", label: "Last Month" },
    { key: "last_1_year", label: "Last Year" },
  ];

  const handleFilterSelect = ({ key }) => {
    setSelectedFilter(key);
    if (onFilterChange) {
      onFilterChange(key);
    }
  };

  const handleClearFilter = () => {
    setSelectedFilter(null);
    if (onFilterChange) {
      onFilterChange(null);
    }
  };

  const handleOrderTypeSelect = ({ key }) => {
    setSelectedOrderType(key);
    if (onOrderTypeChange) {
      onOrderTypeChange(key);
    }
  };

  const handleClearOrderType = () => {
    setSelectedOrderType(null);
    if (onOrderTypeChange) {
      onOrderTypeChange(null);
    }
  };

  const handleDateRangeSelect = ({ key }) => {
    const item = dateRangeMenuItems.find((m) => m.key === key);
    if (item) {
      setSelectedLabel(item.label);
      if (onDateChange) {
        onDateChange({ type: "preset", value: key });
      }
    }
  };

  const handleCalendarChange = (dates, dateStrings) => {
    if (dates && dateStrings.length === 2) {
      const [from, to] = dateStrings;
      setSelectedLabel(`${from} → ${to}`);
      if (onDateChange) {
        onDateChange({ type: "custom", from, to });
      }
    }
    setOpenCalendar(false);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const getOrderTypeLabel = (key) => {
    const item = orderTypeMenuItems.find((m) => m.key === key);
    return item ? item.label : "";
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
            placeholder="Search by order number or customer name"
            value={searchTerm}
            onChange={handleSearchInput}
            className="block w-full rounded-full bg-green-100 py-3 pr-12 pl-6 font-medium text-green-700 placeholder:text-base placeholder:text-green-700 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none md:text-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <Dropdown
            menu={{ items: dateRangeMenuItems, onClick: handleDateRangeSelect }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button
              style={{
                backgroundColor: "#b9f8cf",
                border: "none",
                color: "#1F5226",
                fontWeight: 500,
                fontSize: "18px",
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
              {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
            </Tag>
          )}

          <Dropdown menu={{ items: orderTypeMenuItems, onClick: handleOrderTypeSelect }}>
            <Button className="border-none !bg-gray-100 !text-base">
              Sort by: {selectedOrderType ? getOrderTypeLabel(selectedOrderType) : "All"}
            </Button>
          </Dropdown>

          {selectedOrderType && selectedOrderType !== "all" && (
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
              onClose={handleClearOrderType}
              closeIcon={
                <span className="ml-2 cursor-pointer rounded-full bg-gray-200 p-1">
                  <Cancel01Icon size={14} />
                </span>
              }
            >
              {getOrderTypeLabel(selectedOrderType)}
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
