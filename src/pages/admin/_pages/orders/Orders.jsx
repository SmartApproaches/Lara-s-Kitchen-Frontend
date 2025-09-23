"use client";
import React, { useEffect, useState, useRef } from "react";

import OrdersHeader from "./_components/OrdersHeader";
import StatsCards from "./_components/StatCard";
import SearchAndFilters from "./_components/SearchAndFilter";
import OrdersTable from "./_components/OrdersTable";

const useStatsApi = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      try {
        setData({
          total: {
            label: "Total Orders",
            value: 12450,
            delivery: 7230,
            dineIn: 5220,
            pickup: 3000,
          },
          pending: {
            label: "Pending Orders",
            value: 320,
            delivery: 170,
            dineIn: 100,
            pickup: 50,
          },
          cancelled: {
            label: "Cancelled",
            value: 210,
            delivery: 170,
            dineIn: 30,
            pickup: 10,
          },
          delivered: {
            label: "Delivered",
            value: 11920,
            delivery: 7020,
            dineIn: 4900,
            pickup: 2000,
          },
        });
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, isError };
};

const useOrdersApi = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      try {
        setData([
          {
            orderNo: "N23456790",
            customer: "Rose James",
            category: "Dine In",
            order: "1 plate of Amala",
            price: "£12.00",
            date: "06 Aug 2025 12:30pm",
            payment: "Success",
            status: "Pending",
          },
          {
            orderNo: "N23456791",
            customer: "Junior Wale",
            category: "Online",
            order: "1 plate of Amala, Semo, Baileys, Fanta",
            price: "£300.00",
            date: "06 Aug 2025 12:30pm",
            payment: "Success",
            status: "Completed",
          },
          {
            orderNo: "N23456792",
            customer: "Rose James",
            category: "Pick Up",
            order: "1 plate of Amala",
            price: "£12.00",
            date: "06 Aug 2025 12:30pm",
            payment: "Failed",
            status: "Canceled",
          },
        ]);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, isError };
};

const OrdersPage = () => {
  const { data: statsData, isLoading: isLoadingStats, isError: isErrorStats } = useStatsApi();
  const { data: ordersData, isLoading: isLoadingOrders, isError: isErrorOrders } = useOrdersApi();
  const ordersTableRef = useRef();

  const handleCSVExport = () => {
    if (ordersTableRef.current) {
      ordersTableRef.current.exportAll();
    }
  };

  return (
    <>
      <OrdersHeader />
      <StatsCards stats={statsData} isLoading={isLoadingStats} isError={isErrorStats} />
      {ordersData?.length > 0 && <SearchAndFilters handleCSVExport={handleCSVExport} />}
      <OrdersTable
        ref={ordersTableRef}
        orders={ordersData}
        isLoading={isLoadingOrders}
        isError={isErrorOrders}
      />
    </>
  );
};

export default OrdersPage;
