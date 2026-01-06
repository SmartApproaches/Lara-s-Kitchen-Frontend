import React, { useEffect } from "react";
import { Skeleton, Alert } from "antd";
import { AutoConversationsIcon, PlusSignIcon } from "hugeicons-react";

import { ICONS } from "../../../../constants";
import DashboardHeader from "./_components/DashboardHeader";
import StatCard from "./_components/StatCard";
import RevenueChart from "./_components/RevenueChart";
import RecentOrders from "./_components/RecentOrders";
import {
  useGetDashboardRecentOrdersQuery,
  useLazyGetDashboardSummaryQuery,
  useLazyGetDashboardTotalRevenueQuery,
} from "../../../../redux/slices/super-admin/dashboardApiSlice";

const Dashboard = () => {
  const [
    getDashboardSummary,
    { data: stats, isFetching: isLoadingStats, isError: isErrorStats },
  ] = useLazyGetDashboardSummaryQuery();

  const [
    getDashboardTotalRevenue,
    { data: revenue, isFetching: isLoadingRevenue, isError: isErrorRevenue },
  ] = useLazyGetDashboardTotalRevenueQuery();

  const {
    data: recentOrders,
    isLoading: isLoadingRecentOrders,
    isError: isErrorRecentOrders,
  } = useGetDashboardRecentOrdersQuery();

  const recentOrdersData = recentOrders?.data || [];
  const revenueData = revenue?.data || [];
  const statsData = stats?.data || {};

  const handleDateChange = (selection) => {
    const dateMap = {
      today: "today",
      yesterday: "yesterday",
      lastWeek: "last_week",
      lastMonth: "last_30_days",
      lastYear: "last_1_year",
    };

    if (selection.type === "preset") {
      const apiPeriod = dateMap[selection.value] || "today";
      getDashboardSummary({ period: apiPeriod });
    } else if (selection.type === "custom") {
      getDashboardSummary({ from: selection.from, to: selection.to });
    }
  };

  const handleChartDateChange = (selection) => {
    const dateMap = {
      today: "today",
      lastWeek: "last_week",
      lastMonth: "last_month",
      year: "this_year",
      week: "this_week",
    };
    
    if (selection.type === "preset") {
      const apiDateFilter = dateMap[selection.value] || "today";
      getDashboardTotalRevenue({ period: apiDateFilter });
    } else if (selection.type === "custom") {
      getDashboardTotalRevenue({ from: selection.from, to: selection.to });
    }
  };

  useEffect(() => {
    getDashboardSummary({ period: "last_1_year" });
  }, [getDashboardSummary]);

  useEffect(() => {
    getDashboardTotalRevenue({ period: "this_year" });
  }, [getDashboardTotalRevenue]);

  const statsConfig = [
    {
      icon: ICONS.dish,
      footerIcon: PlusSignIcon,
      title: "Available Dish",
      value: statsData?.total_available_dishes ?? "0",
    },
    {
      icon: ICONS.descent,
      footerIcon: AutoConversationsIcon,
      title: "Total Sales",
      value: statsData?.total_sales ?? "0",
    },
    {
      icon: ICONS.order,
      footerIcon: AutoConversationsIcon,
      title: "Total Order",
      value: statsData?.total_orders ?? "0",
    },
  ];

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
      <StatCard key={index} icon={stat?.icon} title={stat?.title} value={stat?.value} />
    ));
  };

  const renderRevenueChart = () => {
    if (isLoadingRevenue) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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

    return <RevenueChart onDateChange={handleChartDateChange} data={revenueData} />;
  };

  const renderRecentOrders = () => {
    if (isLoadingRecentOrders) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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

    return <RecentOrders orders={recentOrdersData} />;
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader userName="Super Admin" onDateChange={handleDateChange} />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {renderStatsCards()}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">{renderRevenueChart()}</div>
        <div>{renderRecentOrders()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
