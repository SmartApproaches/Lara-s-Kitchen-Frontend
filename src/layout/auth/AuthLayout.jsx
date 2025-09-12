import React from "react";
import { Outlet } from "react-router-dom";
// layout for signup pages
const AuthLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
