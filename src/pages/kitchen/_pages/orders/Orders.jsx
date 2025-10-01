import React, { useState } from "react";
import { AutoConversationsIcon, Cancel01Icon, CheckmarkCircle01Icon } from "hugeicons-react";
import { Alert, Skeleton } from "antd";

import StatCard from "../dashboard/_components/StatCard";
import OrdersHeader from "./_components/OrdersHeader";
import PendingOrderCard from "../dashboard/_components/PendingOrderCard";
import { ICONS } from "../../../../constants";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { data: orderStats, isLoading: isLoadingStats, isError: isErrorStats } = {};

  const handleDateChange = (datevalue) => {
    console.log("Selected Date Range:", datevalue);
  };

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

  const pendingOrders = [
    {
      id: "N2345678",
      type: "Pickup",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
      status: "Pending",
    },
    {
      id: "N2345678",
      type: "Delivery",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
      status: "Pending",
    },
  ];

  const preparingOrders = [
    {
      id: "N2345678",
      type: "Delivery",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
      status: "Preparing",
    },
    {
      id: "N2345678",
      type: "Dine in",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
      status: "Preparing",
    },
  ];

  const readyOrders = [
    {
      id: "N2345678",
      type: "Dine in",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
      status: "Ready",
    },
    {
      id: "N2345678",
      type: "Pickup",
      customer: "Adewale Adeola",
      items: "1 Plate of Amala, Jollof Rice, Spaghetti, Semo",
      timestamp: "3 mins ago",
      status: "Ready",
    },
  ];

  const handleMarkAsPreparing = (order) => {
    console.log("Mark as preparing:", order.id);
  };

  const handleMarkAsReady = (order) => {
    console.log("Mark as ready:", order.id);
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

  const tabs = [
    { id: "pending", label: "Pending", orders: pendingOrders },
    { id: "preparing", label: "Preparing", orders: preparingOrders },
    { id: "ready", label: "Ready", orders: readyOrders },
  ];

  return (
    <div className="min-w-0">
      <OrdersHeader onDateChange={handleDateChange} />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {renderStatsCards()}
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-500">Orders to Prepare</h2>

        <div className="mb-6 flex gap-2 overflow-x-auto rounded-full bg-[#D6FADB] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-0 flex-1 shrink-0 rounded-full px-4 py-3 text-sm font-semibold transition-all sm:px-6 sm:text-base ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tabs.map((tab) => (
            <div key={tab.id} className="min-w-0">
              <div className="space-y-4">
                {tab.orders.map((order, index) => (
                  <PendingOrderCard
                    key={`${tab.id}-${index}`}
                    order={order}
                    onMarkAsPreparing={handleMarkAsPreparing}
                    onMarkAsReady={handleMarkAsReady}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
