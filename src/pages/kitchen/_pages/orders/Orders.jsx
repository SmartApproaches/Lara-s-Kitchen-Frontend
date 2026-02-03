import React, { useState, useEffect, useRef } from "react";
import { Alert, Pagination, Skeleton } from "antd";
import {
  useGetKitchenDashBoardDataQuery,
  useGetDasOrderToPrepareQuery,
  useUpdateOrderStatusMutation,
} from "../../../../redux/slices/kitchen/kitchenDashboardApiSlice";
import StatCard from "../dashboard/_components/StatCard";
import OrdersHeader from "./_components/OrdersHeader";
import PendingOrderCard from "../dashboard/_components/PendingOrderCard";
import { ICONS } from "../../../../constants";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { AutoConversationsIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import dayjs from "dayjs";
import {
  playUrgentNotificationSound,
  stopUrgentNotificationSound,
} from "../../../../utils/notificationAudio";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: orderStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetKitchenDashBoardDataQuery({
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useGetDasOrderToPrepareQuery(
    {
      page: currentPage,
      status: activeTab,
    },
    {
      pollingInterval: 3000,
      skipPollingIfUnfocused: true,
    },
  );

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = ordersData?.data?.data || [];
  const pagination = ordersData?.data;
  const [userHasMuted, setUserHasMuted] = useState(false);

  // 🔊 Check for overdue orders (> 20 mins) and play sound continuously
  useEffect(() => {
    if (activeTab !== "pending" || orders.length === 0) {
      stopUrgentNotificationSound();
      return;
    }

    const hasOverdue = orders.some(
      (order) =>
        order.status === "pending" && dayjs().diff(dayjs(order.created_at), "minute") > 20,
    );

    if (hasOverdue) {
      if (!userHasMuted) {
        playUrgentNotificationSound();
      } else {
        stopUrgentNotificationSound();
      }
    } else {
      stopUrgentNotificationSound();
      setUserHasMuted(false); // Reset mute when no orders are overdue
    }
  }, [orders, activeTab, userHasMuted]);

  const statsConfig = [
    {
      icon: ICONS.dish,
      title: "Total Orders",
      value: orderStats?.data?.total_orders || 0,
      footer: `${orderStats?.data?.pending_orders || 0} pending`,
    },
    {
      icon: CheckmarkCircle01Icon,
      footerIcon: AutoConversationsIcon,
      title: "Completed Orders",
      value: orderStats?.data?.completed_orders || 0,
    },
    {
      icon: ICONS.ordersBeingPrepared,
      footerIcon: AutoConversationsIcon,
      title: "Orders being prepared",
      value: orderStats?.data?.orders_preparing || 0,
    },
  ];

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
      toast.success(`Order updated to ${status}`);
    } catch {
      toast.error("Failed to update status ❌");
    }
  };

  const renderOrders = () => {
    if (isLoadingOrders) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white p-4 shadow">
          <Skeleton active />
        </div>
      ));
    }

    if (orders.length === 0)
      return <p className="py-6 text-center text-gray-400">No orders found</p>;

    return orders.map((order) => {
      const isOverdue =
        order.status === "pending" && dayjs().diff(dayjs(order.created_at), "minute") > 20;

      return (
        <PendingOrderCard
          key={order.id}
          order={{ ...order, order_type: order.order_type?.toUpperCase() }}
          disablePreparing={order.status !== "pending"}
          disableReady={order.status !== "preparing"}
          onMarkAsPreparing={() => handleUpdateStatus(order.id, "preparing")}
          onMarkAsReady={() => handleUpdateStatus(order.id, "ready")}
          isUpdating={isUpdating}

          isOverdue={isOverdue}
          onMute={() => setUserHasMuted(true)}
        />
      );
    });
  };

  return (
    <div className="w-full">
      <OrdersHeader />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsConfig.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ✅ Status Filter Tabs */}
      <div className="mb-6 flex gap-2 rounded-full bg-[#D6FADB] p-2">
        {[
          { id: "pending", label: "Pending" },
          { id: "preparing", label: "Preparing" },
          { id: "ready", label: "Ready" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1); // ✅ Reset page when switching tab
            }}
            className={`flex-1 rounded-full px-5 py-2 font-semibold transition ${
              activeTab === tab.id ? "bg-white" : "text-gray-600"
            } `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{renderOrders()}</div>

      {/* ✅ Pagination */}
      {pagination?.total > pagination?.per_page && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={pagination.current_page}
            total={pagination.total}
            pageSize={pagination.per_page}
            onChange={(page) => setCurrentPage(page)}
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

export default Orders;
