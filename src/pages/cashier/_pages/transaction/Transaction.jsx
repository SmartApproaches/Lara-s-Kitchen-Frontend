import React from "react";
import TransStatsCard from "./components/transStats";
import { ICONS } from "../../../../constants";
import { AutoConversationsIcon } from "hugeicons-react";
import TransactionTable from "./components/TransactionTable";
const stats = [
  {
    icon: ICONS.salesStats,
    footerIcon: AutoConversationsIcon,
    title: "Total Transactions",
    value: "2,500",
    footer: "28% Growth",
  },
  {
    icon: ICONS.completedIcon,
    footerIcon: AutoConversationsIcon,
    title: "Successful Transactions",
    value: "2,500",
    footer: "50% Done",
  },
  {
    icon: ICONS.cancelledIcon,
    footerIcon: AutoConversationsIcon,
    title: "Failed Transactions",
    value: "12,450",
    footer: "30% Done",
  },
];
const Transaction = () => {
  const { data: statsData, isLoading: isLoadingStats, isError: isErrorStats } = {};
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

    return stats.map((stat, index) => (
      <TransStatsCard
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
    <div>
      <h1 className="text-2xl font-bold text-[#1F5226]">Transaction</h1>
      <div className="mt-5">
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {renderStatsCards()}
        </div>
        <TransactionTable />
      </div>
    </div>
  );
};

export default Transaction;
