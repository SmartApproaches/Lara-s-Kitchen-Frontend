import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Switch,
  Dropdown,
  Button,
  Empty,
  Pagination,
  message,
  Skeleton,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useGetCashierDashboardMenuQuery } from "../../../../../../redux/slices/cashier/dashboardApiSlice";
import { useUpdateMenuAvailabilityMutation } from "../../../../../../redux/slices/cashier/menuApiSlice";

const filterOptions = [
  { key: "1", label: "All" },
  { key: "2", label: "Available" },
  { key: "3", label: "Unavailable" },
];

const MenuList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKey, setFilterKey] = useState("1");
  const [filteredItems, setFilteredItems] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  // ✅ Pass `page` param to query properly
  const { data, isLoading, isError, refetch, isFetching } = useGetCashierDashboardMenuQuery(
    {
      page: currentPage,
    },
    {
      pollingInterval: 3000,
      skipPollingIfUnfocused: true,
    },
  );
  console.log("menu data", data);
  const [updateMenuAvailability] = useUpdateMenuAvailabilityMutation();

  // ✅ Format and filter data
  useEffect(() => {
    if (data?.data?.data) {
      const formatted = data.data.data.map((item) => {
        const largeSize = item.sizes?.find((s) => s.name?.toLowerCase() === "large");

        return {
          id: item.id,
          name: item.name,
          desc: item.description,
          price: parseFloat(largeSize?.price) || 0, // ✅ large is now base price
          sizeName: largeSize?.name || "large", // ✅ show size name
          image: item.media?.url,
          available: item.availability === "in_stock",
        };
      });

      if (filterKey === "2") {
        setFilteredItems(formatted.filter((i) => i.available));
      } else if (filterKey === "3") {
        setFilteredItems(formatted.filter((i) => !i.available));
      } else {
        setFilteredItems(formatted);
      }
    }
  }, [data, filterKey]);

  // ✅ Handle toggle availability (isolated state update)
  const handleToggle = async (id, checked) => {
    setUpdatingId(id);
    try {
      await updateMenuAvailability({
        menu_id: id,
        is_available: checked,
      }).unwrap();

      setFilteredItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, available: checked } : item)),
      );

      message.success("Menu availability updated");
    } catch (err) {
      message.error("Failed to update availability");
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Handle filter change
  const handleFilter = ({ key }) => {
    setFilterKey(key);
  };

  // ✅ Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginationInfo = data?.data;

  // ✅ Loading Skeleton (also used during page switch)
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white px-10 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1F5226]">Menu List</h3>
        </div>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card style={{ borderRadius: "12px" }}>
                <Skeleton.Avatar active size={80} shape="circle" />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        <p>Failed to fetch menu. Please try again.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!filteredItems?.length) {
    return (
      <div className="py-20">
        <Empty description="No menu items found" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-10 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1F5226]">Menu List</h3>

        <Dropdown
          menu={{ items: filterOptions, onClick: handleFilter }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button className="flex items-center">
            {filterOptions.find((f) => f.key === filterKey)?.label || "Filter"}{" "}
            <DownOutlined className="ml-1" />
          </Button>
        </Dropdown>
      </div>

      {/* Menu Grid */}
      <Row gutter={[16, 16]}>
        {filteredItems.map((item) => (
          <Col key={item.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{ padding: "12px" }}
              className="flex flex-col !bg-[#F7F7F7]"
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h4 className="text-primary text-xl font-bold">{item.name}</h4>
                    <p className="text-primary text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-green-700">£{item.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 capitalize">Size: {item.sizeName}</span>
                </div>

                <Switch
                  loading={updatingId === item.id}
                  checked={item.available}
                  onChange={(checked) => handleToggle(item.id, checked)}
                  style={{
                    backgroundColor: item.available ? "#195B38" : "#ff4d4f",
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {paginationInfo && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={paginationInfo.total}
            pageSize={paginationInfo.per_page}
            onChange={handlePageChange}
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
  );
};

export default MenuList;
