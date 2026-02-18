import { useState } from "react";
import { Avatar, Button, Tag } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PendingOrderDrawer from "./PendingOrderDrawer";

const PendingOrderCard = ({
  order,
  onMarkAsPreparing,
  onMarkAsReady,
  onCancel,
  isOverdue,
  onMute,
}) => {
  dayjs.extend(relativeTime);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const status = order?.status?.toLowerCase();
  const isPending = status === "pending";
  const isPreparing = status === "preparing";
  const isReady = status === "ready";
  const isInTransit = status === "in_transit";
  const isPickedUp = status === "picked_up";
  const isDelivered = status === "delivered";

  const showRiderInfo = (isReady || isInTransit || isPickedUp || isDelivered) && order?.rider;
  const orderType = order?.order_type === "DINE_IN" ? "DINE IN" : order?.order_type;
  const handleCardClick = () => {
    setSelectedOrder(order);
    if (onMute) onMute();
  };

  const closeDrawer = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`w-full cursor-pointer rounded-xl bg-white p-5 shadow transition-all hover:shadow-md ${
          isOverdue ? "urgent-blink mb-4" : ""
        }`}
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
              {orderType}
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

        {isPending || isPreparing ? (
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
        ) : (
          showRiderInfo && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#D4F7DC] p-3 text-[#1F5226]">
              <div className="flex items-center gap-2">
                <Avatar
                  size={40}
                  className="!bg-[#00BC1A] !text-sm font-bold !text-black"
                  style={{ borderRadius: "8px" }}
                >
                  {order.rider.name
                    ? order.rider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "R"}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#2A3A25] opacity-70">Rider’s Name</span>
                  <span className="text-xs font-bold">{order.rider.name}</span>
                </div>
              </div>
              <div className="rounded-lg bg-[#E9FDEB] px-3 py-2 text-[9px] font-semibold text-[#00BC1A]">
                Order {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </div>
            </div>
          )
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
