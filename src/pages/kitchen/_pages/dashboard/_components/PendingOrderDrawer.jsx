import React, { useEffect, useMemo, useState } from "react";
import { Drawer, Avatar, Tag, Button, Collapse, Divider } from "antd";
import { ArrowDown01Icon, ArrowUp01Icon } from "hugeicons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { Panel } = Collapse;

const formatMMSS = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const parsePrice = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

const PendingOrderDrawer = ({ orderData, onClose, onMarkAsPreparing, onMarkAsReady, onCancel }) => {
  const [activeKey, setActiveKey] = useState(["1"]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const status = orderData?.status?.toLowerCase();
  const isPending = status === "pending";
  const isPreparing = status === "preparing";
  const isReady = status === "ready";
  // Use the real order object (or null)
  const data = useMemo(() => {
    if (!orderData) return null;

    // Map customer info
    const customer = {
      name: orderData.customer?.name ?? "Unknown Customer",
      phone: orderData.customer?.phone ?? orderData.guest_phone ?? "N/A",
      tableNumber: orderData.table_number
        ? `Table ${orderData.table_number}`
        : (orderData.table_number ?? "N/A"),
    };

    // Map items array to a consistent shape
    const items =
      Array.isArray(orderData.items) && orderData.items.length
        ? orderData.items.map((it) => {
            const mi = it.menu_item || {};
            const media = mi.media || {};
            return {
              id: it.id || mi.id || Math.random().toString(36).slice(2),
              name: mi.name ?? it.name ?? "Item",
              description: mi.description ?? it.description ?? mi.menu_description ?? "",
              price: parsePrice(it.price ?? it.price ?? mi.base_price ?? 0),
              quantity: Number(it.quantity ?? 1),
              image: media.url ?? mi.image ?? null,
              preparation_time: mi.preparation_time ?? null,
              subtotal: parsePrice(
                it.subtotal ?? (it.price && it.quantity ? it.price * it.quantity : null),
              ),
            };
          })
        : [];

    // Total: prefer orderData.total_amount or grand_total; else compute
    const totalAmount =
      parsePrice(orderData.total_amount ?? orderData.grand_total) ||
      items.reduce((s, it) => s + it.price * it.quantity, 0);

    return {
      id: orderData.order_number ?? orderData.id,
      order_number: orderData.order_number ?? orderData.id,
      type: orderData.order_type ?? "Unknown",
      customer,
      items,
      specialNotes: orderData.note ? [orderData.note] : (orderData.specialNotes ?? []),
      created_at: orderData.created_at ?? orderData.updated_at ?? null,
      timestampRelative: orderData.created_at ? dayjs(orderData.created_at).fromNow() : null,
      totalAmount,
    };
  }, [orderData]);

  // Timer: elapsed since created_at (in seconds)
  useEffect(() => {
    if (!data || !data.created_at) {
      setElapsedSeconds(0);
      return;
    }

    const createdAt = new Date(data.created_at).getTime();
    if (Number.isNaN(createdAt)) {
      setElapsedSeconds(0);
      return;
    }

    // initialize
    const update = () => {
      const now = Date.now();
      const elapsed = Math.max(0, Math.floor((now - createdAt) / 1000));
      setElapsedSeconds(elapsed);
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [data]);

  const totalAmount = data?.totalAmount ?? 0;

  const handleCancel = () => {
    onCancel?.(orderData);
    onClose();
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={!!orderData}
      width={400}
      bodyStyle={{ padding: 0 }}
      title={null}
    >
      {data ? (
        <div className="h-full overflow-x-hidden overflow-y-auto">
          {/* Top right relative time */}
          <span className="m-3 block text-right text-sm text-gray-500">
            {data.timestampRelative ?? (data.created_at ? dayjs(data.created_at).fromNow() : "")}
          </span>

          {/* Header */}
          <div className="border-b border-gray-100 p-6 text-center">
            <Avatar
              size={80}
              style={{
                borderRadius: "12px",
                backgroundColor:
                  orderData.order_type === "DELIVERY"
                    ? "#00BC1A"
                    : orderData.order_type === "PICKUP"
                      ? "#F5AB0A"
                      : "#1F5226",
                color:
                  orderData.order_type === "DELIVERY"
                    ? "#FFFFFF"
                    : orderData.order_type === "PICKUP"
                      ? "#1F5226"
                      : "#FFFFFF",
              }}
            >
              {/* If you prefer table number or T4 style */}
              <span className="text-lg font-semibold text-white">
                {orderData.order_type === "DELIVERY"
                  ? "DL"
                  : orderData.order_type === "PICKUP"
                    ? "PK"
                    : `T${orderData.table_number}`}
              </span>
            </Avatar>

            <h2 className="text-primary mb-2 text-2xl font-semibold">{data.id}</h2>

            <div className="mt-3">
              <Tag
                color={
                  data.type?.toLowerCase() === "pickup"
                    ? "green"
                    : data.type?.toLowerCase() === "delivery"
                      ? "#C3F4C9"
                      : "blue"
                }
                style={{
                  borderRadius: "20px",
                  padding: "4px 20px",
                  color: data.type === "DELIVERY" ? "#157F3B" : undefined,
                }}
              >
                {data.type}
              </Tag>
            </div>
          </div>

          {/* Customer & Timer */}
          <div className="p-6">
            <Collapse
              activeKey={activeKey}
              onChange={setActiveKey}
              ghost
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? (
                  <ArrowUp01Icon size={18} className="text-primary" />
                ) : (
                  <ArrowDown01Icon size={18} className="text-primary" />
                )
              }
            >
              <Panel header="Customer Information" key="1">
                <div className="space-y-3">
                  <div className="flex w-full justify-between">
                    <span className="text-gray-900">Name:</span>
                    <span className="text-secondary font-semibold">{data.customer?.name}</span>
                  </div>

                  <div className="flex w-full justify-between">
                    <span className="text-gray-900">Phone:</span>
                    <span className="text-secondary font-semibold">{data.customer?.phone}</span>
                  </div>

                  <div className="flex w-full justify-between">
                    <span className="text-gray-900">Table:</span>
                    <span className="text-secondary font-semibold">
                      {data.customer?.tableNumber}
                    </span>
                  </div>
                </div>
              </Panel>
            </Collapse>

            {/* Large elapsed timer (MM:SS) */}
            <div className="mt-6 flex w-full items-center justify-center">
              <div
                className="rounded-lg p-4"
                style={{
                  background: "#f3f4f6",
                  width: "220px",
                  textAlign: "center",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontFamily: "monospace", fontSize: 36, letterSpacing: 2 }}>
                  {formatMMSS(elapsedSeconds)}
                </div>
              </div>
            </div>
          </div>

          <Divider style={{ margin: "0 24px" }} />

          {/* Items */}
          <div className="p-4">
            <div className="space-y-3">
              {data.items?.map((item) => (
                <div
                  key={item.id}
                  className="border-primary flex items-center gap-3 rounded-xl border p-3"
                >
                  <Avatar
                    size={60}
                    src={item.image}
                    style={{ borderRadius: "12px", backgroundColor: "#fff" }}
                    className="flex-shrink-0"
                  >
                    {!item.image && item.name?.[0]}
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="truncate font-medium text-gray-800">{item.name}</h4>
                      {item.quantity > 1 && (
                        <span className="ml-2 text-xs text-gray-500">x{item.quantity}</span>
                      )}
                    </div>

                    {item.description && (
                      <p className="mb-2 line-clamp-2 text-sm text-gray-600">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        £{item.price.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* preparation time per item (if available) */}
                    {item.preparation_time && (
                      <div className="mt-2 text-xs text-gray-400">
                        Prep: {item.preparation_time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider style={{ margin: "0 24px" }} />

          {data.specialNotes && data.specialNotes.length > 0 && (
            <>
              <div className="p-6">
                <h3 className="mb-3 text-base font-medium text-gray-800">Special Notes</h3>
                <ul className="space-y-2 rounded bg-gray-100 p-4">
                  {data.specialNotes.map((note, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Divider style={{ margin: "0 24px" }} />
            </>
          )}

          <Divider style={{ margin: "0 24px" }} />

          {/* Footer actions */}
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-green-600">£{totalAmount.toFixed(2)}</span>
            </div>
            {!isReady && (
              <div className="space-y-3">
                <Button
                  size="large"
                  block
                  disabled={!isPending}
                  className={`flex-1 rounded-lg font-semibold ${
                    isPreparing
                      ? "cursor-not-allowed !border-none !bg-[#FFEDC7] !text-[#F5AB0A]"
                      : "border border-[#157F3B] !text-[#157F3B] hover:bg-[#e6f7ed]"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPending) onMarkAsPreparing(orderData);
                  }}
                >
                  {isPreparing ? "Preparing" : "Mark as Preparing"}
                </Button>

                <Button
                  size="large"
                  block
                  disabled={!isPending && !isPreparing}
                  className={`flex-1 rounded-lg font-semibold !text-white ${
                    !isPending && !isPreparing
                      ? "cursor-not-allowed !bg-[#1F5226] opacity-50"
                      : "!bg-[#1F5226] hover:!bg-[#0d5729]"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPending || isPreparing) onMarkAsReady(orderData);
                  }}
                >
                  Mark as Ready
                </Button>

                <Button
                  size="large"
                  block
                  onClick={handleCancel}
                  danger
                  ghost
                  style={{
                    borderRadius: "5px",
                    height: "48px",
                    fontWeight: "600",
                  }}
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">No order selected</div>
      )}
    </Drawer>
  );
};

export default PendingOrderDrawer;
