import React from "react";
import { DashboardSquare02Icon } from "hugeicons-react";
import { Outlet } from "react-router-dom";

import DashboardLayout from "../../components/shared/DashboardLayout";

const RiderDashboardLayout = () => {
  const riderSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/rider/dashboard",
    },
  ];

  return (
    <DashboardLayout
      userImage=""
      userRole="Rider"
      userEmail="john@example.com"
      sidebarItems={riderSidebarItems}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default RiderDashboardLayout;
