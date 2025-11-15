import React, { useState } from "react";
import TransStatsCard from "./components/transStats";
import { ICONS } from "../../../../constants";
import { Dropdown, Button, DatePicker, Skeleton, Alert } from "antd";
import { Calendar01Icon, AutoConversationsIcon } from "hugeicons-react";
import TransactionTable from "./components/TransactionTable";
import { useGetTransactionSummaryQuery } from "../../../../redux/slices/cashier/transactionApiSlice";

const Transaction = () => {
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetTransactionSummaryQuery({
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  // Helper for amount formatting
  const formatAmount = (amount = 0) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      icon: ICONS.salesStats,
      footerIcon: AutoConversationsIcon,
      title: "Total Transactions",
      value: formatAmount(statsData?.data?.total_transactions?.amount || 0),
      footer: `${statsData?.data?.total_transactions?.count || 0} Total`,
    },
    {
      icon: ICONS.completedIcon,
      footerIcon: AutoConversationsIcon,
      title: "Successful Transactions",
      value: formatAmount(statsData?.data?.successful_transactions?.amount || 0),
      footer: `${statsData?.data?.successful_transactions?.count || 0} Success`,
    },
    {
      icon: ICONS.cancelledIcon,
      footerIcon: AutoConversationsIcon,
      title: "Failed Transactions",
      value: formatAmount(statsData?.data?.failed_transactions?.amount || 0),
      footer: `${statsData?.data?.failed_transactions?.count || 0} Failed`,
    },
  ];

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("This Year");

  const menuItems = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "lastWeek", label: "Last Week" },
    { key: "lastMonth", label: "Last 30 days" },
    { key: "lastYear", label: "Last 1 Year" },
  ];

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (item) setSelectedLabel(item.label);
  };

  const handleCalendarChange = (date, dateString) => {
    if (date) setSelectedLabel(dateString);
    setOpenCalendar(false);
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
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-[#1F5226]">Transaction</h1>
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button
              style={{
                backgroundColor: "#b9f8cf",
                border: "none",
                color: "#1F5226",
                fontWeight: 500,
              }}
            >
              {selectedLabel}
            </Button>
          </Dropdown>

          <div className="relative">
            <Button
              style={{
                backgroundColor: "#b9f8cf",
                color: "#1F5226",
                border: "none",
              }}
              icon={<Calendar01Icon size={20} />}
              onClick={() => setOpenCalendar((prev) => !prev)}
            />
            {openCalendar && (
              <div className="absolute right-0 z-50 mt-2 rounded-lg shadow-lg">
                <DatePicker
                  open
                  onChange={handleCalendarChange}
                  onOpenChange={(open) => !open && setOpenCalendar(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

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
