import React, { useRef, useState, useEffect, useMemo } from "react";
import { Alert, Skeleton } from "antd";

import OrdersHeader from "./_components/OrdersHeader";
import StatsCards from "./_components/StatCard";
import SearchAndFilters from "./_components/SearchAndFilter";
import OrdersTable from "./_components/OrdersTable";
import {
  useGetOrdersSummaryQuery,
  useLazyGetAllOrdersQuery,
} from "../../../../redux/slices/super-admin/ordersApiSlice";

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState(null);

  const [filters, setFilters] = useState({
    period: "last_30_days",
    from: null,
    to: null,
  });

  const ordersTableRef = useRef();

  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetOrdersSummaryQuery();

  const [getAllOrders, { data: orders, isFetching: isLoadingOrders, isError: isErrorOrders }] =
    useLazyGetAllOrdersQuery();

  const orderSummary = summary?.data || null;
  const ordersData = useMemo(() => orders?.data?.data || [], [orders]);

  const pagination = {
    current_page: orders?.data?.current_page,
    last_page: orders?.data?.last_page,
    per_page: orders?.data?.per_page,
    total: orders?.data?.total,
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleOrderTypeChange = (orderType) => {
    setOrderTypeFilter(orderType);
  };

  const fetchOrders = (page = 1) => {
    getAllOrders({
      ...filters,
      page,
    });
  };

  const handleDateChange = (selection) => {
    const newFilters = {
      period: null,
      from: null,
      to: null,
    };

    if (selection.type === "preset") {
      newFilters.period = selection.value || "last_30_days";
    } else if (selection.type === "custom") {
      newFilters.from = selection.from;
      newFilters.to = selection.to;
    }

    setFilters(newFilters);
    setCurrentPage(1);
    getAllOrders({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrders(newPage);
  };

  const handleCSVExport = () => {
    if (ordersTableRef.current) {
      ordersTableRef.current.exportAll();
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch =
        order?.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.order_number?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !statusFilter || order?.order?.status?.toLowerCase() === statusFilter.toLowerCase();

      let matchesOrderType = true;
      if (orderTypeFilter && orderTypeFilter !== "all") {
        if (orderTypeFilter === "specialOffer") {
          matchesOrderType = order?.category?.some(
            (item) => item?.menu_item?.menu_type === "special",
          );
        } else if (orderTypeFilter === "generalOrder") {
          matchesOrderType = !order?.category?.some(
            (item) => item?.menu_item?.menu_type === "special",
          );
        }
      }

      return matchesSearch && matchesStatus && matchesOrderType;
    });
  }, [ordersData, searchQuery, statusFilter, orderTypeFilter]);

  const renderStatsCards = () => {
    if (isLoadingSummary) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ));
    }

    if (isErrorSummary) {
      return (
        <div className="col-span-full">
          <Alert
            message="Error loading order summary"
            description="Failed to fetch order stats. Please try again later."
            type="error"
            showIcon
          />
        </div>
      );
    }

    return <StatsCards stats={orderSummary} />;
  };

  return (
    <>
      <OrdersHeader />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {renderStatsCards()}
      </div>
      <SearchAndFilters
        handleCSVExport={handleCSVExport}
        onDateChange={handleDateChange}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onOrderTypeChange={handleOrderTypeChange}
      />
      <OrdersTable
        ref={ordersTableRef}
        orders={filteredOrders}
        isLoading={isLoadingOrders}
        isError={isErrorOrders}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default OrdersPage;
