import React from "react";
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Tag01Icon,
  UserShield01Icon,
  CookBookIcon,
  Note05Icon,
} from "hugeicons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import DashboardLayout from "../../components/shared/DashboardLayout";

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      active: location.pathname === "/admin/dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      icon: Note05Icon,
      label: "Orders",
      active: location.pathname === "/admin/orders",
      onClick: () => navigate("/admin/orders"),
    },
    {
      icon: UserGroupIcon,
      label: "Customers",
      active: location.pathname === "/admin/customers",
      onClick: () => navigate("/admin/customers"),
    },
    {
      icon: UserShield01Icon,
      label: "Permissions",
      active: location.pathname === "/admin/permission",
      onClick: () => navigate("/admin/permission"),
    },
    {
      icon: Tag01Icon,
      label: "Special Offers",
      active: location.pathname === "/admin/special-offer",
      onClick: () => navigate("/admin/special-offer"),
    },
    {
      icon: CookBookIcon,
      label: "Catalogue",
      active: location.pathname === "/admin/catalogue",
      onClick: () => navigate("/admin/catalogue"),
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
