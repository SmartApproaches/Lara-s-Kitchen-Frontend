import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadScript, useLoadScript } from "@react-google-maps/api";

import "./App.css";
import "./Notifications.css";
import "./animations/animations.css";
import PageLoader from "./components/ui/loader/PageLoader";
import Login from "./pages/auth/login/Login";

import LandingPage from "./pages/landingPage/landing";
import LandingMenu from "./pages/landingPage/menu";
import ContactUs from "./pages/landingPage/contact";

import AdminBusinessSuiteGeoFencing from "./pages/admin/_pages/business-suite/_components/GeoFence";

const ProtectedRoutes = lazy(() => import("./layout/protected/ProtectedRouteLayout"));

// Super Admin Dashboard
const AdminDashboardLayout = lazy(() => import("./layout/admin/AdminDashboardLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/_pages/dashboard/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/_pages/orders/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/_pages/customers/Customers"));
const AdminPermission = lazy(() => import("./pages/admin/_pages/permission/Permission"));
const AdminSpecialOffer = lazy(() => import("./pages/admin/_pages/special-offer/SpecialOffer"));
const AdminCatalogue = lazy(() => import("./pages/admin/_pages/catalogue/Catalogue"));
const AdminBusinessSuite = lazy(() => import("./pages/admin/_pages/business-suite/BusinessSuite"));
const AdminBusinessSuiteOrderAvailability = lazy(
  () => import("./pages/admin/_pages/business-suite/_components/OrderAvailability"),
);
const AdminBusinessSuiteDeliveryFee = lazy(
  () => import("./pages/admin/_pages/business-suite/_components/DeliveryFee"),
);

const AdminBusinessSuiteDineInGeoFencing = lazy(
  () => import("./pages/admin/_pages/business-suite/_components/DineInGeoFence"),
);

const AdminBusinessSuiteDeliveryGeoFencing = lazy(
  () => import("./pages/admin/_pages/business-suite/_components/DeliveryGeoFence"),
);

const AdminAddNewFood = lazy(
  () => import("./pages/admin/_pages/catalogue/_components/add-new-food/AddNewFood"),
);

// Cashier Dashboard
const CashierDashboardLayout = lazy(() => import("./layout/cashier/CashierDashboardLayout"));
const CashierDashboard = lazy(() => import("./pages/cashier/_pages/dashboard/Dashboard"));
const CashierOrders = lazy(() => import("./pages/cashier/_pages/orders/Orders"));
const CreateNewOrders = lazy(() => import("./pages/cashier/_pages/orders/new-order"));
const CashierMenuList = lazy(() => import("./pages/cashier/_pages/menu-list/MenuList"));
const CashierEditOrder = lazy(() => import("./pages/cashier/_pages/orders/edit-order"));
const CashierTransaction = lazy(() => import("./pages/cashier/_pages/transaction/Transaction"));

// Kitchen Dashboard
const KitchenDashboardLayout = lazy(() => import("./layout/kitchen/KitchenDashboardLayout"));
const KitchenDashboard = lazy(() => import("./pages/kitchen/_pages/dashboard/Dashboard"));
const KitchenOrders = lazy(() => import("./pages/kitchen/_pages/orders/Orders"));
const KitchenSpecialOrder = lazy(() => import("./pages/kitchen/_pages/specialOrders"));
const DineInMenu = lazy(() => import("./pages/guest/menu"));

const GOOGLE_MAPS_API_KEY = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";

const App = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<LandingMenu />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dinein-menu" element={<DineInMenu />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<AdminDashboardLayout />}>
            <Route index path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/customers" element={<AdminCustomers />} />
            <Route path="admin/permission" element={<AdminPermission />} />
            <Route path="admin/special-offer" element={<AdminSpecialOffer />} />
            <Route path="admin/catalogue" element={<AdminCatalogue />} />
            <Route
              path="admin/catalogue/add-new-food/:catalogueId?"
              element={<AdminAddNewFood />}
            />
            <Route path="admin/business-suite" element={<AdminBusinessSuite />} />
            <Route
              path="admin/business-suite/order-availability"
              element={<AdminBusinessSuiteOrderAvailability />}
            />
            <Route
              path="admin/business-suite/delivery-fee"
              element={<AdminBusinessSuiteDeliveryFee />}
            />
            <Route
              path="admin/business-suite/geo-fence"
              element={isLoaded ? <AdminBusinessSuiteGeoFencing /> : "Loading Maps..."}
            />

            <Route
              path="admin/business-suite/geo-fence/dine-in"
              element={<AdminBusinessSuiteDineInGeoFencing />}
            />
            <Route
              path="admin/business-suite/geo-fence/delivery"
              element={<AdminBusinessSuiteDeliveryGeoFencing />}
            />
          </Route>
        </Route>

        {/* Cashier Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<CashierDashboardLayout />}>
            <Route index path="cashier/dashboard" element={<CashierDashboard />} />
            <Route path="cashier/orders" element={<CashierOrders />} />
            <Route path="cashier/create-orders" element={<CreateNewOrders />} />
            <Route path="cashier/menu-list" element={<CashierMenuList />} />
            <Route path="cashier/edit-order/:id" element={<CashierEditOrder />} />
            <Route path="cashier/transaction" element={<CashierTransaction />} />
          </Route>
        </Route>

        {/* Kitchen Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<KitchenDashboardLayout />}>
            <Route index path="kitchen/dashboard" element={<KitchenDashboard />} />
            <Route path="kitchen/orders" element={<KitchenOrders />} />
            <Route path="kitchen/special-orders" element={<KitchenSpecialOrder />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
