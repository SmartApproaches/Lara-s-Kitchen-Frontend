import { useState } from "react";
import { Avatar, Button, Tag } from "antd";

import PendingOrderDrawer from "./PendingOrderDrawer";

const PendingOrderCard = ({ order, onMarkAsPreparing, onMarkAsReady, onCancel }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCardClick = () => {
    setSelectedOrder(order);
  };

  const closeDrawer = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="w-full cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar
            size={48}
            style={{ backgroundColor: "#fb923c", borderRadius: "99px" }}
            className="shrink-0 sm:h-16 sm:w-16"
          >
            <span className="text-base font-semibold text-white sm:text-lg">T1</span>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
              <h3 className="text-primary min-w-0 truncate text-lg font-bold sm:text-2xl">
                {order.id}
              </h3>
              <span className="shrink-0 text-xs whitespace-nowrap text-gray-400 sm:text-sm">
                {order.timestamp}
              </span>
            </div>

            <div className="mb-3 sm:mb-4">
              <Tag
                color={order.type === "Pickup" ? "green" : "blue"}
                className="rounded-full px-3 py-1"
              >
                {order.type}
              </Tag>
            </div>

            <div className="mb-4 space-y-3 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm text-gray-600 sm:w-32 sm:shrink-0">Customer Name:</span>
                <span className="min-w-0 text-sm font-semibold text-gray-800 sm:text-base">
                  {order.customer}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm text-gray-600 sm:w-32 sm:shrink-0">Ordered Items:</span>
                <span className="min-w-0 text-sm font-semibold text-gray-800 sm:text-base">
                  {order.items}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              {order.status !== "Pending" ? (
                <Button
                  size="large"
                  block
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsPreparing?.(order);
                  }}
                  className="!text-primary rounded-lg text-sm !font-semibold sm:flex-1 sm:text-base"
                >
                  Mark as Preparing
                </Button>
              ) : (
                <Button
                  size="large"
                  style={{ backgroundColor: "#FFF3D7", borderColor: "#F5AB0A" }}
                  block
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsPreparing?.(order);
                  }}
                  className="!text-primary rounded-lg text-sm !font-semibold sm:flex-1 sm:text-base"
                >
                  Preparing
                </Button>
              )}
              <Button
                size="large"
                block
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsReady?.(order);
                }}
                className="!text-primary rounded-lg text-sm !font-semibold sm:flex-1 sm:text-base"
              >
                Mark as Ready
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PendingOrderDrawer
        orderData={selectedOrder}
        onClose={closeDrawer}
        onMarkAsPreparing={onMarkAsPreparing}
        onMarkAsReady={onMarkAsReady}
        onCancel={onCancel}
      />
    </>
  );
};

export default PendingOrderCard;
