import React from "react";
import { Outlet } from "react-router-dom";
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Tag01Icon,
  UserShield01Icon,
  CookBookIcon,
  Note05Icon,
  TravelBagIcon,
} from "hugeicons-react";

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
    {
      icon: TravelBagIcon,
      label: "Business Suite",
      path: "/admin/business-suite",
    },
  ];

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboardLayout;
