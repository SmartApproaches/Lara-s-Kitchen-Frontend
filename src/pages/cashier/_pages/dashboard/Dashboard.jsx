import React from "react";
import DashboardHeader from "../../../admin/_pages/dashboard/_components/DashboardHeader";
import StatsCrad from "./components/statCard";
import { ICONS } from "../../../../constants";
import { AutoConversationsIcon, PlusSignIcon } from "hugeicons-react";
import RecentOrders from "./components/recent-orders";
import MenuList from "./components/menu-list";
import QuickAccess from "./components/quick-action";
import { useSelector } from "react-redux";
import { useGetDashboardDataQuery } from "../../../../redux/slices/cashier/dashboardApiSlice";
import { Skeleton } from "antd";
const Dashboard = () => {
  const user = useSelector((state) => state.login?.userLogin);
  const name = user?.name.split(" ")[0] || "User";
  const { data: dashboardData, isLoading, isError } = useGetDashboardDataQuery();

  const statsData = dashboardData?.data;
  const stats = [
    {
      icon: ICONS.salesStats,
      footerIcon: AutoConversationsIcon,
      title: "Total Sales",
      value: `${statsData?.total_sales || "0"}`,
      footer: "28% Growth",
    },
    {
      icon: ICONS.dish,
      footerIcon: AutoConversationsIcon,
      title: "Active Orders",
      value: `${statsData?.active_orders || "0"}`,
      footer: "50% Done",
    },
    {
      icon: ICONS.completedIcon,
      footerIcon: AutoConversationsIcon,
      title: "Completed Orders",
      value: `${statsData?.completed_orders || "0"}`,
      footer: "50% Done",
    },
    {
      icon: ICONS.cancelledIcon,
      footerIcon: AutoConversationsIcon,
      title: "Cancelled Orders",
      value: `${statsData?.canceled_orders || "0"}`,
      footer: "30% Done",
    },
  ];
  const handleDateChange = (datevalue) => {
    console.log("Selected Date Range:", datevalue);
  };

  const renderStatsCards = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ));
    }

    if (isError) {
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
      <DashboardHeader userName={name} onDateChange={handleDateChange} />
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {renderStatsCards()}
      </div>
      <RecentOrders />
      <QuickAccess />
      <MenuList />
    </div>
  );
};

export default Dashboard;
