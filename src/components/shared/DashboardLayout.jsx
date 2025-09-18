import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Search01Icon,
  Menu01Icon,
  Notification01Icon,
  DashboardSquare02Icon,
  Cancel01Icon,
  UserIcon,
} from "hugeicons-react";

import logo from "../../assets/images/logo.svg";

const DashboardLayout = ({
  userImage,
  userRole,
  userEmail,
  sidebarItems = [],
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const defaultSidebarItems = [
    { icon: DashboardSquare02Icon, label: "Dashboard", active: true },
  ];

  const menuItems =
    sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50
        w-68 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }
      `}
      >
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Abula Spot & Bar" className="h-28" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <Cancel01Icon
                size={20}
                strokeWidth={2}
                className="text-gray-500 absolute top-3 right-2"
              />
            </button>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`
                  w-full flex items-center my-4 px-3 py-3 mb-1 rounded-lg text-left transition-colors
                  ${
                    item.active
                      ? "bg-primary text-white shadow-sm"
                      : "text-secondary hover:bg-gray-50 cursor-pointer hover:text-gray-900"
                  }
                `}
                onClick={item.onClick}
              >
                <Icon size={22} className="mr-3" />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-x-4 h-20">
              <div className="flex items-center flex-1">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 mr-2"
                >
                  <Menu01Icon size={20} />
                </button>

                <div className="relative max-w-lg w-full">
                  <div className="absolute inset-y-0 right-5 pl-3 flex items-center pointer-events-none">
                    <Search01Icon size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="block w-full pl-6 pr-3 font-medium text-primary py-3 border border-gray-300 rounded-4xl bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="relative p-2 text-primary bg-accent rounded-full hover:text-green-500">
                  <Notification01Icon size={22} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userRole}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserIcon size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-base font-semibold text-secondary">
                      {userRole}
                    </div>
                    <div className="text-sm font-medium text-secondary">
                      {userEmail}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-[#e5ffe9] overflow-y-auto">
          <div className="p-6 mt-0 md:mt-5 animate-slide-in-bottom sm:p-8 lg:p-10">
            {children || (
              <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
                <div className="text-center text-gray-500 py-12">
                  <DashboardSquare02Icon
                    size={48}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Page Content
                  </h3>
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
  userImage: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  sidebarItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      active: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ).isRequired,
  children: PropTypes.node,
};

export default DashboardLayout;
