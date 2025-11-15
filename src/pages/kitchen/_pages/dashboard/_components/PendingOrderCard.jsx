import { useState } from "react";
import { Avatar, Button, Tag } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PendingOrderDrawer from "./PendingOrderDrawer";

const PendingOrderCard = ({ order, onMarkAsPreparing, onMarkAsReady, onCancel }) => {
  dayjs.extend(relativeTime);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const status = order?.status?.toLowerCase();
  const isPending = status === "pending";
  const isPreparing = status === "preparing";
  const isReady = status === "ready";

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
        className="w-full cursor-pointer rounded-xl bg-white p-5 shadow transition-all hover:shadow-md"
      >
        {/* Top Row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              size={50}
              className="text-lg font-bold"
              style={{
                borderRadius: "12px",
                backgroundColor:
                  order.order_type === "DELIVERY"
                    ? "#00BC1A"
                    : order.order_type === "PICKUP"
                      ? "#F5AB0A"
                      : "#1F5226",
                color:
                  order.order_type === "DELIVERY"
                    ? "#FFFFFF"
                    : order.order_type === "PICKUP"
                      ? "#1F5226"
                      : "#FFFFFF",
              }}
            >
              {order.order_type === "DELIVERY"
                ? "DL"
                : order.order_type === "PICKUP"
                  ? "PK"
                  : `T${order.table_number}`}
            </Avatar>

            <div>
              <h3 className="text-lg font-bold text-[#2A3A25]">{order?.customer?.name}</h3>
              <p className="text-xs text-gray-500">Order {order?.order_number}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-[10px] text-[#979797]">
            <span className="">{dayjs(order?.created_at).fromNow()}</span>

            <Tag
              color="green"
              className="rounded-full border-none bg-[#157F3B] px-3 py-1 text-white"
            >
              {order?.order_type}
            </Tag>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-3 border-gray-200" />

        {/* Order Items Table */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Order Items</span>
            <span>Qty</span>
          </div>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-1 text-sm text-gray-800">
              <span>{item?.menu_item?.name}</span>
              <span>{item?.quantity}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}

        {!isReady && (
          <div className="mt-4 flex gap-3">
            {/* PREPARING button */}
            <Button
              size="medium"
              disabled={!isPending}
              className={`flex-1 rounded-lg !text-[10px] font-semibold ${
                isPreparing
                  ? "cursor-not-allowed !border-none !bg-[#FFEDC7] !text-[#F5AB0A]"
                  : "border border-[#157F3B] !text-[#157F3B] hover:bg-[#e6f7ed]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isPending) onMarkAsPreparing(order);
              }}
            >
              {isPreparing ? "Preparing" : "Mark as Preparing"}
            </Button>

            {/* READY button */}
            <Button
              size="medium"
              disabled={!isPending && !isPreparing}
              className={`flex-1 rounded-lg !text-[10px] font-semibold !text-white ${
                !isPending && !isPreparing
                  ? "cursor-not-allowed !bg-[#1F5226] opacity-50"
                  : "!bg-[#1F5226] hover:!bg-[#0d5729]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isPending || isPreparing) onMarkAsReady(order);
              }}
            >
              Mark as Ready
            </Button>
          </div>
        )}
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
