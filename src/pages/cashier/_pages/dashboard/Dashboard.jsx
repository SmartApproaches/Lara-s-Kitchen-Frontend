import React from "react";
import DashboardHeader from "../../../admin/_pages/dashboard/_components/DashboardHeader";
import StatsCrad from "./components/statCard";
import { ICONS } from "../../../../constants";
import { AutoConversationsIcon, PlusSignIcon } from "hugeicons-react";
const Dashboard = () => {
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = {};
  const stats = [
    {
      icon: ICONS.salesStats,
      footerIcon: AutoConversationsIcon,
      title: "Total Sales",
      value: "2,500",
      footer: "28% Growth",
    },
    {
      icon: ICONS.dish,
      footerIcon: AutoConversationsIcon,
      title: "Active Orders",
      value: "150",
      footer: "50% Done",
    },
    {
      icon: ICONS.completedIcon,
      footerIcon: AutoConversationsIcon,
      title: "Completed Orders",
      value: "2,500",
      footer: "50% Done",
    },
    {
      icon: ICONS.cancelledIcon,
      footerIcon: AutoConversationsIcon,
      title: "Cancelled Orders",
      value: "12,450",
      footer: "30% Done",
    },
  ];
  const handleDateChange = (datevalue) => {
    console.log("Selected Date Range:", datevalue);
  };

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

    return stats.map((stat, index) => (
      <StatsCrad
        key={index}
        icon={stat.icon}
        footerIcon={stat.footerIcon}
        title={stat.title}
        value={stat.value}
        footer={stat.footer}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader userName="Hello, Joy" onDateChange={handleDateChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {renderStatsCards()}
      </div>
    </div>
  );
};

export default Dashboard;
