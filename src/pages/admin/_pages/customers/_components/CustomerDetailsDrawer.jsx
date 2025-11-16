import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Tag, Drawer, Skeleton, Pagination } from "antd";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  ArrowRight01Icon,
  UserIcon,
  Dish01Icon,
} from "hugeicons-react";

import { useGetCustomerOrdersQuery } from "../../../../../redux/slices/super-admin/customersApiSlice";

const CustomerProfileDrawer = ({ customer, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetCustomerOrdersQuery(
    {
      id: customer?.id,
      page: currentPage,
    },
    {
      skip: !customer?.id,
    },
  );

  const customerData = data?.data?.data?.[0];
  const customerOrders = customerData?.orders || [];
  const paginationData = {
    current_page: data?.data?.current_page || 1,
    per_page: data?.data?.per_page || 10,
    total: data?.data?.total || 0,
    last_page: data?.data?.last_page || 1,
  };

  console.log(customer, customerOrders);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "orange",
      picked_up: "blue",
      completed: "green",
      complete: "green",
      cancelled: "red",
      ready: "green",
      preparing: "purple",
      in_transit: "yellow",
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
              src={customer?.profile_picture}
              icon={<UserIcon size={40} />}
              className="mx-auto mb-4"
            />
            <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">
              {customer?.name || "N/A"}
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
                {typeof customer?.address === "string"
                  ? customer?.address
                  : customer?.address?.formatted_address || "No address provided"}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800">Order List</h3>
              <Link to="/admin/orders" className="cursor-pointer">
                <button className="flex cursor-pointer items-center gap-1 text-[15px] font-medium text-gray-500 transition-colors hover:text-gray-700">
                  See all
                  <ArrowRight01Icon size={14} />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <Skeleton active />
              ) : isError ? (
                <div className="p-4 text-center text-red-500">Failed to load order history</div>
              ) : customerOrders.length > 0 ? (
                <>
                  {customerOrders.map((order) => (
                    <div
                      key={order?.id}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <Avatar
                        size={36}
                        src={order?.image}
                        icon={<Dish01Icon size={18} />}
                        className="flex-shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h4 className="truncate text-sm font-medium text-gray-800">
                            {order?.name || "N/A"}
                          </h4>
                          <span className="ml-2 text-xs text-gray-500">
                            {formatDate(order?.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-600">
                            £{order?.total_amount || "0.00"}
                          </span>
                          <Tag
                            color={getStatusColor(order?.status)}
                            className="m-0 rounded-full px-2 py-0 text-xs font-semibold capitalize"
                          >
                            {order?.status.replace("_", " ") || "N/A"}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  ))}

                  {paginationData.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                      <Pagination
                        current={paginationData.current_page}
                        total={paginationData.total}
                        pageSize={paginationData.per_page}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        size="small"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">No orders found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CustomerProfileDrawer;
