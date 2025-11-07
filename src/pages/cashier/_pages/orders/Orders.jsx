import React, { useState, useMemo, useRef, useEffect } from "react";
import RecentOrders from "../dashboard/components/recent-orders";
import OrderCard from "./order-card";
import { ICONS } from "../../../../constants";
import OrderSidePanel from "./order-sidepanel";
import { Button, Skeleton, Empty, Pagination } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useGetCashierOrdersQuery } from "../../../../redux/slices/cashier/ordersApiSlice";
import { useGetDashboardDataQuery } from "../../../../redux/slices/cashier/dashboardApiSlice";

const STATUS_FILTERS = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filterRef = useRef(null);

  const { data: dashboardData, isLoading } = useGetDashboardDataQuery();
  const { data: ordersApiData, isLoading: ordersLoading } = useGetCashierOrdersQuery({
    page,
    status,
  });

  const ordersMeta = ordersApiData?.data;
  const ordersList = ordersApiData?.data?.data || [];

  const formattedOrders = useMemo(() => {
    return ordersList.map((order) => {
      const images = order.items?.map((item) => item?.menu_item?.media?.url) || [];

      return {
        id: order.id,
        status: order.status,
        orderId: order.order_number,
        orderType: order.order_type,
        time: order.order_time,
        description: `${order.items?.length || 0} items ordered`,
        price: Number(order.grand_total),
        paid: order.payment_status === "paid",
        images,
        extraItems: Math.max(0, images.length - 4),
        items: order.items,
      };
    });
  }, [ordersList]);

  const showSkeleton = ordersLoading;

  /** ✅ Filter Selection */
  const handleFilterSelect = (filterVal) => {
    setStatus(filterVal);
    setPage(1);
    setShowFilter(false);
  };

  /** ✅ Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = () => {
    const orders = ordersList;
    if (!orders.length) return;

    const csvData = orders.map((o) => ({
      OrderNumber: o.order_number,
      Price: o.grand_total,
      Status: o.status,
      Type: o.order_type,
      Time: o.order_time,
      Items: o.items?.length || 0,
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders_page_${page}.csv`;
    link.click();
  };

  return (
    <div>
      <h3 className="text-primary text-3xl font-bold">Order List</h3>

      <RecentOrders recentOrders={dashboardData?.data?.recent_orders || []} loading={isLoading} />

      {/* ✅ Filter + Export Row */}
      {/* ✅ Filter + Export Row */}
      <div className="mt-6 flex items-center justify-between px-2">
        <div className="relative flex items-center gap-3" ref={filterRef}>
          {/* Filter Button */}
          <Button
            size="small"
            shape="circle"
            icon={<FilterOutlined />}
            onClick={() => setShowFilter(!showFilter)}
            className="border-gray-300"
          />

          {/* ✅ Selected Status Tag */}
          {status && (
            <div
              className="bg-primary flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white"
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
            >
              {STATUS_FILTERS.find((f) => f.value === status)?.label}
              <span className="ml-1 text-[10px]">✕</span>
            </div>
          )}

          {/* ✅ Dropdown Panel */}
          {showFilter && (
            <div
              className="absolute top-9 left-0 z-20 w-40 rounded-md bg-white py-2 shadow-lg"
              style={{ border: "1px solid #e5e7eb" }}
            >
              {STATUS_FILTERS.map((filter) => (
                <div
                  key={filter.value}
                  className={`cursor-pointer px-4 py-2 text-sm transition hover:bg-gray-100 ${
                    status === filter.value ? "text-primary font-semibold" : "text-gray-600"
                  }`}
                  onClick={() => handleFilterSelect(filter.value)}
                >
                  {filter.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Export Button */}
        <div
          className="bg-primary flex cursor-pointer items-center gap-2 rounded-md px-3 py-1"
          onClick={handleExport}
        >
          <img src={ICONS.exportIcon} alt="Export" className="h-5 w-5" />
          <span className="font-medium text-white">Export</span>
        </div>
      </div>

      {/* ✅ Orders Content */}
      <div className="mt-5 flex gap-4">
        <div className={`transition-all duration-300 ${selectedOrder ? "w-3/4" : "w-full"}`}>
          {showSkeleton && (
            <div className="grid gap-4 md:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton.Button key={i} active style={{ height: 250, borderRadius: "16px" }} />
              ))}
            </div>
          )}

          {!showSkeleton && formattedOrders.length === 0 && (
            <Empty description="No Orders Found" className="mt-10" />
          )}

          {!showSkeleton && formattedOrders.length > 0 && (
            <>
              <div
                className={`grid gap-4 ${
                  selectedOrder
                    ? "md:grid-cols-2 2xl:grid-cols-3"
                    : "md:grid-cols-3 2xl:grid-cols-4"
                }`}
              >
                {formattedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    {...order}
                    isSelected={selectedOrder?.id === order.id}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Pagination
                  current={ordersMeta?.current_page}
                  pageSize={ordersMeta?.per_page}
                  total={ordersMeta?.total}
                  onChange={(pageNum) => setPage(pageNum)}
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
            </>
          )}
        </div>

        {selectedOrder && (
          <OrderSidePanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </div>
    </div>
  );
};

export default Orders;
