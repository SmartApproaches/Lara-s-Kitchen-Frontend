import { useState } from "react";
import { Avatar, Button, Tag } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PendingOrderDrawer from "../../dashboard/_components/PendingOrderDrawer";
import { FireIcon } from "hugeicons-react";

const SpecialOrderCard = ({ order, onMarkAsPreparing, onMarkAsReady }) => {
  dayjs.extend(relativeTime);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const status = order.status?.toLowerCase();

  const isPending = status === "pending";
  const isPreparing = status === "preparing";
  const isReady = status === "ready";

  const orderType = order.order_type === "DINE_IN" ? "DINE IN" : order.order_type?.toUpperCase();
  return (
    <>
      <div
        onClick={() => setSelectedOrder(order)}
        className="w-full cursor-pointer rounded-xl bg-white p-5 shadow transition-all hover:shadow-md"
      >
        {/* 🟧 SPECIAL ORDER TAG */}
        <div className="mb-2 flex items-center">
          <Tag color="red" className="border-none bg-red-500 px-3 py-1 text-white">
            <span className="flex items-center gap-1">
              <FireIcon size={14} />
              Special Order
            </span>
          </Tag>
        </div>

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              size={50}
              className="text-lg font-bold"
              style={{
                borderRadius: "12px",
                backgroundColor:
                  order.order_type === "delivery"
                    ? "#00BC1A"
                    : order.order_type === "pickup"
                      ? "#F5AB0A"
                      : "#1F5226",
                color:
                  order.order_type === "delivery"
                    ? "#FFFFFF"
                    : order.order_type === "pickup"
                      ? "#1F5226"
                      : "#FFFFFF",
              }}
            >
              {order.order_type === "delivery"
                ? "DL"
                : order.order_type === "pickup"
                  ? "PK"
                  : `T${order.table_number}`}
            </Avatar>

            <div>
              <h3 className="text-lg font-bold">{order.customer?.name}</h3>
              <p className="text-xs text-gray-500">Order {order.order_number}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[10px] text-gray-500">
            <span>{dayjs(order.created_at).fromNow()}</span>
            <Tag className="rounded-full bg-[#157F3B] px-3 py-1 text-white">{orderType}</Tag>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-3 border-gray-200" />

        {/* Items */}
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Items</span>
            <span>Qty</span>
          </div>

          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between py-1 text-sm">
              <span>{item.menu_item?.name}</span>
              <span>{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {!isReady && (
          <div className="mt-4 flex gap-3">
            <Button
              disabled={!isPending}
              className={`flex-1 rounded-lg !text-[10px] font-semibold ${
                isPreparing
                  ? "!bg-[#FFEDC7] !text-[#F5AB0A]"
                  : "border border-[#157F3B] !text-[#157F3B]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isPending) onMarkAsPreparing(order);
              }}
            >
              {isPreparing ? "Preparing" : "Mark as Preparing"}
            </Button>

            <Button
              disabled={!isPending && !isPreparing}
              className="flex-1 rounded-lg !bg-[#1F5226] text-[10px] !text-white"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsReady(order);
              }}
            >
              Mark as Ready
            </Button>
          </div>
        )}
      </div>

      {/* Drawer */}
      <PendingOrderDrawer
        orderData={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onMarkAsPreparing={onMarkAsPreparing}
        onMarkAsReady={onMarkAsReady}
      />
    </>
  );
};

export default SpecialOrderCard;
