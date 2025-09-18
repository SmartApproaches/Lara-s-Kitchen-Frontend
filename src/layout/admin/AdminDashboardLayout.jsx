import React from "react";
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Tag01Icon,
  UserShield01Icon,
  CookBookIcon,
  Note05Icon,
} from "hugeicons-react";
import { Outlet } from "react-router-dom";

import DashboardLayout from "../../components/shared/DashboardLayout";

const AdminDashboardLayout = () => {
  const adminSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: Note05Icon,
      label: "Orders",
      path: "/admin/orders",
    },
    {
      icon: UserGroupIcon,
      label: "Customers",
      path: "/admin/customers",
    },
    {
      icon: UserShield01Icon,
      label: "Permissions",
      path: "/admin/permission",
    },
    {
      icon: Tag01Icon,
      label: "Special Offers",
      path: "/admin/special-offer",
    },
    {
      icon: CookBookIcon,
      label: "Catalogue",
      path: "/admin/catalogue",
    },
  ];

  return (
    <DashboardLayout
      userImage=""
      userRole="Super Admin"
      userEmail="john@example.com"
      sidebarItems={adminSidebarItems}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboardLayout;
