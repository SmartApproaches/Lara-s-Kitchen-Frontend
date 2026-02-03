import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Tag01Icon,
  UserShield01Icon,
  CookBookIcon,
  Note05Icon,
  TravelBagIcon,
} from "@hugeicons/core-free-icons";

import DashboardLayout from "../../components/shared/DashboardLayout";
import { getCategories, getSubCategories } from "../../redux/slices/super-admin/categoriesSlice";

const AdminDashboardLayout = () => {
  const dispatch = useDispatch();
  const category = useSelector((state) => state?.categories?.category);
  const categories = useMemo(() => category?.data || [], [category]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((cat) => dispatch(getSubCategories(cat?.id)));
    }
  }, [dispatch, categories]);

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
