import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import "./animations/animations.css";
import PageLoader from "./components/ui/loader/PageLoader";
import Login from "./pages/auth/login/Login";

import MenuList from "./pages/cashier/_pages/menu-list/MenuList";
import Transaction from "./pages/cashier/_pages/transaction/Transaction";


const ProtectedRoutes = lazy(() => import("./layout/protected/ProtectedRouteLayout"));

// Super Admin Dashboard
const AdminDashboardLayout = lazy(() => import("./layout/admin/AdminDashboardLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/_pages/dashboard/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/_pages/orders/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/_pages/customers/Customers"));
const AdminPermission = lazy(() => import("./pages/admin/_pages/permission/Permission"));
const AdminSpecialOffer = lazy(() => import("./pages/admin/_pages/special-offer/SpecialOffer"));
const AdminCatalogue = lazy(() => import("./pages/admin/_pages/catalogue/Catalogue"));

// Cashier Dashboard
const CashierDashboardLayout = lazy(() => import("./layout/cashier/CashierDashboardLayout"));
const CashierDashboard = lazy(() => import("./pages/cashier/_pages/dashboard/Dashboard"));
const CashierOrders = lazy(() => import("./pages/cashier/_pages/orders/Orders"));
const CashierMenuList = lazy(() => import("./pages/cashier/_pages/menu-list/MenuList"));
const CashierEditOrder = lazy(() => import("./pages/cashier/_pages/orders/edit-order"));
const CashierTransaction = lazy(() => import("./pages/cashier/_pages/transaction/Transaction"));

// Kitchen Dashboard
const KitchenDashboardLayout = lazy(() => import("./layout/kitchen/KitchenDashboardLayout"));
const KitchenDashboard = lazy(() => import("./pages/kitchen/_pages/dashboard/Dashboard"));

// Rider Dashboard
const RiderDashboardLayout = lazy(() => import("./layout/rider/RiderDashboardLayout"));
const RiderDashboard = lazy(() => import("./pages/rider/_pages/dashboard/Dashboard"));

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Sign-Up Routes */}

        {/* Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<AdminDashboardLayout />}>
            <Route index path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/customers" element={<AdminCustomers />} />
            <Route path="admin/permission" element={<AdminPermission />} />
            <Route path="admin/special-offer" element={<AdminSpecialOffer />} />
            <Route path="admin/catalogue" element={<AdminCatalogue />} />
          </Route>
        </Route>

        {/* Cashier Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<CashierDashboardLayout />}>
            <Route index path="cashier/dashboard" element={<CashierDashboard />} />
            <Route path="cashier/orders" element={<CashierOrders />} />
            <Route path="cashier/menu-list" element={<CashierMenuList />} />
            <Route path="cashier/edit-order/:id" element={<CashierEditOrder />} />
            <Route path="cashier/transaction" element={<CashierTransaction />} />
          </Route>
        </Route>

        {/* Kitchen Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<KitchenDashboardLayout />}>
            <Route index path="kitchen/dashboard" element={<KitchenDashboard />} />
          </Route>
        </Route>

        {/* Rider Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<RiderDashboardLayout />}>
            <Route index path="rider/dashboard" element={<RiderDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
