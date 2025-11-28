import React, { useState } from "react";
import {
  useGetSpecialOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../../redux/slices/kitchen/kitchenDashboardApiSlice";
import { Alert, Pagination, Skeleton } from "antd";
import SpecialOrderCard from "./specilOrderCard";
import toast from "react-hot-toast";

const SpecialOrders = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetSpecialOrdersQuery(
    { page },
    {
      pollingInterval: 3000,
      skipPollingIfUnfocused: true,
    },
  );

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleMarkAsPreparing = async (order) => {
    try {
      await updateOrderStatus({ orderId: order.id, status: "preparing" }).unwrap();
      toast.success("Order marked as Preparing");
    } catch {
      toast.error("Failed to update ❌");
    }
  };

  const handleMarkAsReady = async (order) => {
    try {
      await updateOrderStatus({ orderId: order.id, status: "ready" }).unwrap();
      toast.success("Order marked as Ready");
    } catch {
      toast.error("Failed to update ❌");
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Special Orders</h1>

      {/* ERROR */}
      {isError && <Alert type="error" message="Failed to load special orders" className="mb-4" />}

      {/* LOADING */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton active key={i} />
            ))}
        </div>
      )}

      {!isLoading && data?.data?.data?.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.data.map((order) => (
              <SpecialOrderCard
                key={order.id}
                order={order}
                onMarkAsPreparing={handleMarkAsPreparing}
                onMarkAsReady={handleMarkAsReady}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={data.data.current_page}
              total={data.data.total}
              pageSize={data.data.per_page}
              onChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SpecialOrders;
