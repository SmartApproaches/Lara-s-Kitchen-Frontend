import React from "react";
import { Skeleton, Alert } from "antd";
import { AutoConversationsIcon, PlusSignIcon } from "hugeicons-react";

import { ICONS } from "../../../../constants";
import DashboardHeader from "./_components/DashboardHeader";
import StatCard from "./_components/StatCard";
import RevenueChart from "./_components/RevenueChart";
import RecentOrders from "./_components/RecentOrders";

const Dashboard = () => {
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = {};
  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
  } = {};
  const {
    data: recentOrdersData,
    isLoading: isLoadingRecentOrders,
    isError: isErrorRecentOrders,
  } = {};

  const handleDateChange = (datevalue) => {
    console.log("Selected Date Range:", datevalue);
  };
 
  const statsConfig = [
    {
      icon: ICONS.dish,
      footerIcon: PlusSignIcon,
      title: "Available Dish",
      value: "150",
      footer: "20 new dishes added",
    },
    {
      icon: ICONS.descent,
      footerIcon: AutoConversationsIcon,
      title: "Total Sales",
      value: "2,500",
      footer: "28% Growth",
    },
    {
      icon: ICONS.order,
      footerIcon: AutoConversationsIcon,
      title: "Total Order",
      value: "12,450",
      footer: "50% Done",
    },
  ];

  const renderStatsCards = () => {
    if (isLoadingStats) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
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
        isSales={stat.title === "Total Sales"}
        footer={stat.footer}
      />
    ));
  };

  const renderRevenueChart = () => {
    if (isLoadingRevenue) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      );
    }

    if (isErrorRevenue) {
      return (
        <Alert
          message="Error loading revenue chart"
          description="Failed to fetch revenue data. Please try again later."
          type="error"
          showIcon
        />
      );
    }

    return <RevenueChart data={revenueData} />;
  };

  const renderRecentOrders = () => {
    if (isLoadingRecentOrders) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      );
    }

    if (isErrorRecentOrders) {
      return (
        <Alert
          message="Error loading recent orders"
          description="Failed to fetch recent orders. Please try again later."
          type="error"
          showIcon
        />
      );
    }

    return <RecentOrders data={recentOrdersData} />;
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader userName="Super Admin" onDateChange={handleDateChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {renderStatsCards()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{renderRevenueChart()}</div>
        <div>{renderRecentOrders()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
