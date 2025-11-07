import React, { useState } from "react";
import { AutoConversationsIcon, CheckmarkCircle01Icon } from "hugeicons-react";
import { Alert, Pagination, Skeleton } from "antd";
import toast from "react-hot-toast";
import StatCard from "./_components/StatCard";
import OrderCard from "./_components/OrderCard";
import PendingOrderCard from "./_components/PendingOrderCard";
import DashboardHeader from "./_components/DashboardHeader";
import { ICONS } from "../../../../constants";
import {
  useGetKitchenDashBoardDataQuery,
  useGetDasOrderToPrepareQuery,
  useUpdateOrderStatusMutation,
} from "../../../../redux/slices/kitchen/kitchenDashboardApiSlice";
const Dashboard = () => {
  const {
    data: orderStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetKitchenDashBoardDataQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: pendingOrdersData,
    isLoading: isLoadingPendingOrders,
    isError: isErrorPendingOrders,
  } = useGetDasOrderToPrepareQuery({ page: currentPage });
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  const pendingOrders = pendingOrdersData?.data?.data || [];
  const pagination = pendingOrdersData?.data;

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
      // footer: "20% Growth",
    },
    {
      icon: ICONS.ordersBeingPrepared,
      footerIcon: AutoConversationsIcon,
      title: "Orders being prepared",
      value: orderStats?.data?.orders_preparing || 0,
      // footer: "30% Done",
    },
  ];

  const handleDateChange = (datevalue) => {
    console.log("Selected Date Range:", datevalue);
  };

  const handleMarkAsPreparing = async (order) => {
    try {
      await updateOrderStatus({
        orderId: order.id,
        status: "preparing",
      }).unwrap();

      toast.success("Order moved to Preparing");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order ❌");
    }
  };

  const handleMarkAsReady = async (order) => {
    try {
      await updateOrderStatus({
        orderId: order.id,
        status: "ready",
      }).unwrap();

      toast.success("Order marked as Ready ✅");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order ❌");
    }
  };

  const renderStatsCards = () => {
    if (isLoadingStats) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ));
    }

    if (isErrorStats) {
      return (
        <div className="col-span-full">
          <Alert
            message="Error loading statistics"
            description="Failed to fetch dashboard statistics. Please try again later."
            type="error"
            showIcon
          />
        </div>
      );
    }
    return statsConfig.map((stat, index) => (
      <StatCard
        key={index}
        icon={stat.icon}
        footerIcon={stat.footerIcon}
        title={stat.title}
        value={stat.value}
        footer={stat.footer}
      />
    ));
  };

  const renderPendingOrders = () => {
    if (isLoadingPendingOrders) {
      return Array.from({ length: 6 }).map((_, index) => (
        <Skeleton.Button key={index} active block style={{ height: 140 }} />
      ));
    }
    if (isErrorPendingOrders) {
      return <Alert type="error" message="Failed to load Pending Orders" showIcon />;
    }

    if (!pendingOrders?.length) {
      return <p className="text-gray-500">No pending orders</p>;
    }

    return pendingOrders.map((order) => (
      <PendingOrderCard
        key={order.id}
        order={{
          ...order,
          order_type: order.order_type?.toUpperCase(),
        }}
        disablePreparing={order.status !== "pending"}
        disableReady={order.status !== "preparing"}
        onMarkAsPreparing={handleMarkAsPreparing}
        onMarkAsReady={handleMarkAsReady}
      />
    ));
  };
  return (
    <div className="min-w-0">
      <DashboardHeader userName="Kitchen" onDateChange={handleDateChange} />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {renderStatsCards()}
      </div>

      <div className="min-w-0">
        <h2 className="mb-4 text-xl font-semibold text-gray-500">Orders to prepare</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">{renderPendingOrders()}</div>
      </div>
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

export default Dashboard;
