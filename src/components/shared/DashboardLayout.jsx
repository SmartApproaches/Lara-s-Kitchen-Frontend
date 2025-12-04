import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Search01Icon,
  Menu01Icon,
  Notification01Icon,
  DashboardSquare02Icon,
  Cancel01Icon,
  Logout02Icon,
  UserStatusIcon,
} from "hugeicons-react";
import { addNotification } from "../../redux/slices/notification/notificationsSlice";
import { listenToForegroundMessages, requestNotificationPermission } from "../../utils/firebase";
import logo from "../../assets/images/logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import NotificationsDropdown from "../../pages/kitchen/_pages/orders/_components/pushNotification/notificationDropdown";
import ToastNotificationContainer from "../../pages/kitchen/_pages/orders/_components/pushNotification/notificationDropdown/Toast/ToastNotificationContainer";
import { useRegisterDeviceMutation } from "../../redux/slices/kitchen/kitchenDashboardApiSlice";
import { getBrowserDeviceId } from "../../utils/device";

const DashboardLayout = ({ sidebarItems = [], children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const user = useSelector((state) => state.login?.userLogin);
  const notifications = useSelector((state) => state.notifications?.items || []);

  const isKitchen = user?.role?.role === "kitchen";

  const defaultSidebarItems = [{ icon: DashboardSquare02Icon, label: "Dashboard", active: true }];
  const menuItems = sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const [registerKitchenDevice] = useRegisterDeviceMutation();

  // ✅ KITCHEN ONLY: Register device + listen for notifications
  useEffect(() => {
    if (!user?.id || !isKitchen) return;

    const setupNotifications = async () => {
      try {
        if ("serviceWorker" in navigator) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        }

        const fcmToken = await requestNotificationPermission(
          "BHcPnvAa06uFSGuxn46bamNFTCQ3UyJAs3EnoQtQ17qyLaCJtcupSYbgf4fv0BWQYnQQCEe8P88gVx5OjV48Tl4",
        );

        if (!fcmToken) return;

        const deviceId = getBrowserDeviceId();

        await registerKitchenDevice({
          fcm_token: fcmToken,
          device_id: deviceId,
          platform: "web",
        }).unwrap();
      } catch (error) {
        console.error("Kitchen notification setup error:", error);
      }
    };

    setupNotifications();

    const unsubscribe = listenToForegroundMessages((payload) => {
      dispatch(
        addNotification({
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data,
          createdAt: new Date().toISOString(),
          _isNew: true,
        }),
      );
    });

    return () => unsubscribe && unsubscribe();
  }, [user, isKitchen, dispatch, registerKitchenDevice]);

  // ✅ KITCHEN ONLY: Shake animation
  useEffect(() => {
    if (!isKitchen) return;

    const hasNewNotification = notifications.some((n) => n._isNew);

    if (hasNewNotification) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 800);
      return () => clearTimeout(timer);
    }
  }, [notifications, isKitchen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar overlay */}
      {isKitchen && <ToastNotificationContainer />}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-68 transform flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out md:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } `}
      >
        <div className="flex-shrink-0 p-6">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Abula Spot & Bar" className="h-28" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-md p-1 hover:bg-gray-100 md:hidden"
            >
              <Cancel01Icon
                size={20}
                strokeWidth={2}
                className="absolute top-3 right-2 text-gray-500"
              />
            </button>
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-6 flex-1 overflow-y-auto px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path || location.pathname.startsWith(item.path + "/");

            return (
              <button
                key={index}
                className={`my-4 mb-1 flex w-full items-center rounded-lg px-3 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-secondary cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={22} className="mr-3" />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="text-secondary my-4 mt-20 mb-1 flex w-full cursor-pointer items-center rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Logout02Icon size={22} className="mr-3" />
            <span className="font-semibold">Logout</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {/* Top Navbar */}
        <header className="z-30 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between gap-x-4">
              {/* Sidebar toggle + Search */}
              <div className="flex flex-1 items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 md:hidden"
                >
                  <Menu01Icon size={20} />
                </button>

                <div className="relative w-full max-w-lg">
                  <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pl-3">
                    <Search01Icon size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="text-primary block w-full rounded-4xl border border-gray-300 bg-gray-50 py-3 pr-3 pl-6 text-sm font-medium placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notifications + User */}
              <div className="flex items-center space-x-3">
                {isKitchen && (
                  <div className="relative">
                    <button
                      className={`text-primary bg-accent relative rounded-full p-2 transition-all hover:text-green-500 ${
                        isShaking ? "notification-icon-shake" : ""
                      }`}
                      onClick={() => setShowNotifications((s) => !s)}
                    >
                      <Notification01Icon size={22} />
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                      )}
                    </button>

                    {showNotifications && (
                      <NotificationsDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <UserStatusIcon size={32} className="text-primary" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-secondary text-base font-semibold capitalize">
                      {user?.role
                        ? user.role?.role
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())
                        : "N/A"}
                    </div>
                    <div className="text-secondary text-sm font-medium">{user?.email || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#e5ffe9]">
          <div className="animate-slide-in-bottom mt-0 p-6 sm:p-8 md:mt-5 lg:p-10">
            {children || (
              <div className="min-h-96 rounded-lg bg-white p-6 shadow-sm">
                <div className="py-12 text-center text-gray-500">
                  <DashboardSquare02Icon size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Page Content</h3>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  sidebarItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      active: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  ).isRequired,
  children: PropTypes.node,
};

export default DashboardLayout;
