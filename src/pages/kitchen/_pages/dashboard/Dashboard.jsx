import React from "react";
import { AutoConversationsIcon, Cancel01Icon, CancelCircleIcon, CheckmarkCircle01Icon } from "hugeicons-react";
import { Alert, Skeleton } from "antd";

import StatCard from "./_components/StatCard";
import OrderCard from "./_components/OrderCard";
import PendingOrderCard from "./_components/PendingOrderCard";
import DashboardHeader from "./_components/DashboardHeader";
import { ICONS } from "../../../../constants";

const Dashboard = () => {
  const { data: orderStats, isLoading: isLoadingStats, isError: isErrorStats } = {};
  const { data: recentOrders, isLoading: isLoadingRecentOrders, isError: isErrorRecentOrders } = {};
  const {
    data: pendingOrders,
    isLoading: isLoadingPendingOrders,
    isError: isErrorPendingOrders,
  } = {};

  const mockPendingOrders = [
    {
      id: "N2345678",
      type: "Pickup",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
    },
    {
      id: "N2345679",
      type: "Dine in",
      customer: "Lola Toriola",
      items: "2 Plates of Jollof Rice, Chicken",
      timestamp: "5 mins ago",
    },
    {
      id: "N2345679",
      type: "Dine in",
      customer: "Lola Toriola",
      items: "2 Plates of Jollof Rice, Chicken",
      timestamp: "5 mins ago",
    },
    {
      id: "N2345679",
      type: "Dine in",
      customer: "Lola Toriola",
      items: "2 Plates of Jollof Rice, Chicken",
      timestamp: "5 mins ago",
    },
  ];

  const statsConfig = [
    {
      icon: ICONS.dish,
      title: "Orders to prepare",
      value: "150",
      footer: "12 pending",
    },
    {
      icon: CheckmarkCircle01Icon,
      footerIcon: AutoConversationsIcon,
      title: "Completed Orders",
      value: "20",
      footer: "20% Growth",
    },
    {
      icon: Cancel01Icon,
      footerIcon: AutoConversationsIcon,
      title: "Cancelled Order",
      value: "10",
      footer: "30% Done",
    },
  ];

  const handleDateChange = (datevalue) => {
    console.log("Selected Date Range:", datevalue);
  };

  const handleMarkAsPreparing = (order) => {
    console.log("Mark as preparing:", order.id);
    // updateOrderStatus(order.id, 'preparing');
  };

  const handleMarkAsReady = (order) => {
    console.log("Mark as ready:", order.id);
    // updateOrderStatus(order.id, 'ready');
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

  const renderRecentOrders = () => {
    if (isLoadingRecentOrders) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ));
    }

    if (isErrorRecentOrders) {
      return (
        <div className="col-span-full">
          <Alert
            message="Error loading recent orders"
            description="Failed to fetch recent orders. Please try again later."
            type="error"
            showIcon
          />
        </div>
      );
    }

    const mockRecentOrders = [
      {
        id: "N2345678",
        orderType: "Dine In",
        itemCount: 5,
        timeAgo: "3 mins ago",
        status: "Preparing",
        avatarText: "T1",
      },
      {
        id: "N2345679",
        orderType: "Takeout",
        itemCount: 3,
        timeAgo: "7 mins ago",
        status: "Ready",
        avatarText: "T2",
      },
      {
        id: "N2345680",
        orderType: "Delivery",
        itemCount: 8,
        timeAgo: "12 mins ago",
        status: "Completed",
        avatarText: "T3",
      },
    ];

    const ordersToRender = recentOrders || mockRecentOrders;

    return ordersToRender.map((order) => (
      <OrderCard
        key={order.id}
        orderId={order.id}
        orderType={order.orderType}
        itemCount={order.itemCount}
        timeAgo={order.timeAgo}
        status={order.status}
        avatarText={order.avatarText}
      />
    ));
  };

  const renderPendingOrders = () => {
    if (isLoadingPendingOrders) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ));
    }

    if (isErrorPendingOrders) {
      return (
        <div className="col-span-full">
          <Alert
            message="Error loading pending orders"
            description="Failed to fetch pending orders. Please try again later."
            type="error"
            showIcon
          />
        </div>
      );
    }

    const ordersToRender = pendingOrders || mockPendingOrders;

    return ordersToRender.map((order) => (
      <PendingOrderCard
        key={order.id}
        order={order}
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

      <div className="mb-8 rounded-2xl bg-[#DAFFDF] p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-500">Recent Orders</h2>
        <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
          {renderRecentOrders()}
        </div>
      </div>

      <div className="min-w-0">
        <h2 className="mb-4 text-xl font-semibold text-gray-500">Orders to prepare</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">{renderPendingOrders()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
