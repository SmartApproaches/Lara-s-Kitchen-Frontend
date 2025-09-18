import React from "react";
import {
  DashboardSquare02Icon,
  Note05Icon,
  Menu02Icon,
  Money01Icon,
} from "hugeicons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import DashboardLayout from "../../components/shared/DashboardLayout";

const CashierDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      active: location.pathname === "/cashier/dashboard",
      onClick: () => navigate("/cashier/dashboard"),
    },
    {
      icon: Note05Icon,
      label: "Orders",
      active: location.pathname === "/cashier/orders",
      onClick: () => navigate("/cashier/orders"),
    },
    {
      icon: Menu02Icon,
      label: "Menu List",
      active: location.pathname === "/cashier/menu-list",
      onClick: () => navigate("/cashier/menu-list"),
    },
    {
      icon: Money01Icon,
      label: "Transaction",
      active: location.pathname === "/cashier/transaction",
      onClick: () => navigate("/cashier/transaction"),
    },
  ];

  return (
    <DashboardLayout
      userImage=""
      userRole="Cashier"
      userEmail="Joy Timileyin"
      sidebarItems={adminSidebarItems}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default CashierDashboardLayout;
