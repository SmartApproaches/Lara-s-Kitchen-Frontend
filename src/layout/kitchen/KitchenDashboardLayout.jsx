import React from "react";
import { DashboardSquare02Icon, FireIcon, Menu02Icon, Note05Icon } from "hugeicons-react";
import { Outlet } from "react-router-dom";

import DashboardLayout from "../../components/shared/DashboardLayout";

const KitchenDashboardLayout = () => {
  const kitchenSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/kitchen/dashboard",
    },
    {
      icon: Note05Icon,
      label: "Orders",
      path: "/kitchen/orders",
    },
    {
      icon: Menu02Icon,
      label: "Menu List",
      path: "/kitchen/menu-list",
    },
    {
      icon: FireIcon,
      label: "Special Orders",
      path: "/kitchen/special-orders",
    },
  ];

  return (
    <DashboardLayout
      userImage=""
      userRole="Kitchen"
      userEmail="john@example.com"
      sidebarItems={kitchenSidebarItems}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default KitchenDashboardLayout;
