import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";
import { useLocation } from "react-router-dom";

const ProtectedRouteLayout = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} state={{ from: location }} replace />;
};

export default ProtectedRouteLayout;
