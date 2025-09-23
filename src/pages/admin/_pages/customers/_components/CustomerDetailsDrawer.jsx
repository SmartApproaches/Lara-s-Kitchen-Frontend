import { Avatar, Tag, Drawer } from "antd";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { Link } from "react-router-dom";

const CustomerProfileDrawer = ({ customer, onClose }) => {
  const orderHistory = [
    {
      id: 1,
      name: "Abula",
      price: "£12.00",
      date: "05 Aug 2025",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Semo",
      price: "£12.00",
      date: "05 Aug 2025",
      status: "Complete",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Abula",
      price: "£12.00",
      date: "05 Aug 2025",
      status: "Complete",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Abula",
      price: "£12.00",
      date: "05 Aug 2025",
      status: "Complete",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={!!customer}
      width={400}
      styles={{
        body: { padding: 0 },
      }}
    >
      {customer && (
        <div className="h-full overflow-y-auto">
          <div className="p-6 text-center">
            <Avatar
              size={100}
              style={{ borderRadius: "13px" }}
              src={
                customer?.avatar ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face"
              }
              className="mx-auto mb-4"
            />
            <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">
              {customer?.name || "John Doe"}
            </h2>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Mail01Icon size={14} className="text-green-600" />
                </div>
                <span className="text-base text-green-600">{customer?.email || "N/A"}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Call02Icon size={14} className="text-green-600" />
                </div>
                <span className="text-base text-green-600">{customer?.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="mb-3 text-base font-medium text-gray-500">Delivery Address</h3>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                <Location01Icon size={16} className="text-gray-600" />
              </div>
              <div className="text-base leading-relaxed text-gray-700">
                {customer?.address || "No address provided"}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800">Order List</h3>
              <Link to="/admin/orders" className="cursor-pointer">
                <button className="flex items-center gap-1 text-[15px] font-medium text-gray-500 transition-colors hover:text-gray-700">
                  see all
                  <ArrowRight01Icon size={14} />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {orderHistory.map((order) => (
                <div key={order?.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <Avatar size={36} src={order?.image} className="flex-shrink-0" />

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="truncate text-sm font-medium text-gray-800">{order?.name}</h4>
                      <span className="ml-2 text-xs text-gray-500">{order?.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600">{order?.price}</span>
                      <Tag
                        color={order?.status === "Pending" ? "orange" : "green"}
                        className="m-0 rounded-full px-2 py-0 text-xs font-medium"
                      >
                        {order?.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CustomerProfileDrawer;
