import React, { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, FilterOutlined, CloseOutlined } from "@ant-design/icons";

const MenuFilterBar = () => {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = ["General", "Food", "Drinks"];

  return (
    <div className="flex flex-col gap-4 rounded-full bg-[#E6FAEB] p-2 md:flex-row md:items-center md:justify-between">
      {/* Tabs */}
      <div className="flex space-x-6 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-6 py-2 font-medium transition ${
              activeTab === tab ? "bg-white text-black shadow" : "text-gray-700 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 px-2">
        {/* Search */}
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-full border-gray-200 focus:border-green-400 focus:ring-0"
        />

        {/* Chips & Filter button */}
        <div className="flex items-center gap-2">
          <Button
            size="small"
            className="flex items-center gap-1 rounded-full border border-gray-300 px-3 text-gray-600"
          >
            All <CloseOutlined className="text-xs" />
          </Button>
          <Button
            size="small"
            shape="circle"
            icon={<FilterOutlined />}
            className="border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuFilterBar;
