import React, { useState } from "react";
import MenuStats from "./components/menuStats";
import { SearchOutlined, FilterOutlined, CloseOutlined } from "@ant-design/icons";
import MenuFilterBar from "./components/MenuFilterBar";
import { Input, Button } from "antd";
import MenuCard from "../dashboard/components/menuCard";

const MenuList = () => {
  const [activeTab, setActiveTab] = useState("General");
  const tabs = ["General", "Food", "Drinks"];

  return (
    <div>
      <MenuStats />
      <div className="mt-7 w-full rounded-full bg-[#C3F4C9] px-10 py-2 shadow">
        <div className="flex w-full items-center justify-between px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-16 py-2 font-medium transition ${
                activeTab === tab ? "bg-white text-black shadow" : "text-gray-700 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between px-2">
        {/* Search */}
        <Input
          placeholder="Search by name"
          className="!w-[300px] rounded-full !border-[#B8F2C0] !bg-inherit !outline-none"
          prefix={<SearchOutlined className="text-gray-400" />}
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
      <div className="mt-10 bg-[#D6FADB] p-6">
        <MenuCard />
      </div>
    </div>
  );
};

export default MenuList;
