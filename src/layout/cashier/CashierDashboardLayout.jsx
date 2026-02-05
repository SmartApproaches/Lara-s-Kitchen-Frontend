import React from "react";
import {
  DashboardSquare02Icon,
  Note05Icon,
  Menu02Icon,
  Money01Icon,
} from "@hugeicons/core-free-icons";
import { Outlet } from "react-router-dom";

import DashboardLayout from "../../components/shared/DashboardLayout";

const CashierDashboardLayout = () => {
  const cashierSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/cashier/dashboard",
    },
    {
      icon: Note05Icon,
      label: "Orders",
      path: "/cashier/orders",
    },
    {
      icon: Menu02Icon,
      label: "Menu List",
      path: "/cashier/menu-list",
    },
    {
      icon: Money01Icon,
      label: "Transaction",
      path: "/cashier/transaction",
    },
  ];

  return (
    <DashboardLayout
      userImage=""
      userRole="Cashier"
      userEmail="Joy Timileyin"
      sidebarItems={cashierSidebarItems}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default CashierDashboardLayout;
