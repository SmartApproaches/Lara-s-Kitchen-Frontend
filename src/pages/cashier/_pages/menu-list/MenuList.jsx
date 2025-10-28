import React, { useState } from "react";
import MenuStats from "./components/menuStats";
import { SearchOutlined, FilterOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useGetCashierdMenuQuery,
  useUpdateMenuAvailabilityMutation,
  useGetCashierMenuCategoriesQuery,
} from "../../../../redux/slices/cashier/menuApiSlice";
import { Input, Button, Pagination, message } from "antd";
import MenuCard from "../dashboard/components/menuCard";

const MenuList = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [localMenuData, setLocalMenuData] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ Filter state from MenuStats
  const [dateFilter, setDateFilter] = useState("");

  const handleFilterChange = (filterKey) => {
    setDateFilter(filterKey);
    setPage(1);
    setLocalMenuData(null); // ✅ Reset cache
  };

  const { data: categoryData } = useGetCashierMenuCategoriesQuery();

  const {
    data: menuData,
    isLoading: menuLoading,
    isFetching: menuFetching,
    refetch,
  } = useGetCashierdMenuQuery({
    page,
    per_page: limit,
    ...(searchTerm && { search: searchTerm }),
    ...(activeCategoryId && { category_id: activeCategoryId }),
  });

  const [updateMenuAvailability] = useUpdateMenuAvailabilityMutation();

  const menuItems = localMenuData || menuData?.data?.data || [];

  const handleToggle = async (id, checked) => {
    setUpdatingId(id);

    const oldData = menuItems;
    const updatedData = oldData.map((item) =>
      item.id === id ? { ...item, availability: checked ? "in_stock" : "out_of_stock" } : item,
    );

    setLocalMenuData(updatedData);

    try {
      await updateMenuAvailability({
        menu_id: id,
        is_available: checked,
      }).unwrap();

      message.success("Menu availability updated ✅");
      refetch().then((res) => setLocalMenuData(res.data.data.data));
    } catch (err) {
      message.error("Failed! Reverting back ❌");
      setLocalMenuData(oldData);
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs =
    categoryData?.data?.length > 0
      ? [{ id: "", name: "All" }, ...categoryData.data.map((c) => ({ id: c.id, name: c.name }))]
      : [{ id: "", name: "All" }];

  return (
    <div>
      {/* ✅ Date Filter Handler Added */}
      <MenuStats
        menuData={menuItems}
        menuLoading={menuLoading || menuFetching}
        onDateChange={(filterKey) => handleFilterChange(filterKey)}
      />

      {/* Tabs */}
      <div className="mt-7 w-full rounded-full bg-[#C3F4C9] px-10 py-2 shadow">
        <div className="flex items-center justify-between overflow-x-auto px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id || "all"}
              onClick={() => {
                setActiveTab(tab.name);
                setActiveCategoryId(tab.id);
                setPage(1);
                setLocalMenuData(null);
              }}
              className={`rounded-full px-6 py-2 font-medium whitespace-nowrap transition ${
                activeTab === tab.name
                  ? "bg-white text-black shadow"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2">
        <Input
          placeholder="Search by name"
          className="!w-[300px] rounded-full !border-[#B8F2C0] !bg-inherit !outline-none"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
            setLocalMenuData(null);
          }}
        />

        <div className="flex items-center gap-2">
          {searchTerm && (
            <Button
              size="small"
              className="rounded-full border border-gray-300 px-3 text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              Clear <CloseOutlined />
            </Button>
          )}
          <Button
            size="small"
            shape="circle"
            icon={<FilterOutlined />}
            className="border border-gray-300"
          />
        </div>
      </div>

      {/* Menu Cards */}
      <div className="mt-10 rounded-xl bg-[#D6FADB] p-6">
        {menuLoading || menuFetching ? (
          <MenuCard items={Array(6).fill({})} menuLoading isSkeleton />
        ) : (
          <MenuCard items={menuItems} onToggle={handleToggle} updatingId={updatingId} />
        )}

        {/* Pagination */}
        {menuData?.data?.total > limit && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={page}
              total={menuData.data.total}
              pageSize={limit}
              onChange={(p) => {
                setPage(p);
                setLocalMenuData(null);
              }}
              showSizeChanger={false}
              className="custom-pagination"
            />
            <style>
              {`
        .custom-pagination .ant-pagination-item-active {
          background-color: #1F5226 !important;
          border-color: #1F5226 !important;
        }
        .custom-pagination .ant-pagination-item-active a {
          color: #fff !important;
        }
      `}
            </style>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuList;
