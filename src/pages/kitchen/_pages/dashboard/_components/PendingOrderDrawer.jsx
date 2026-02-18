import React, { useEffect, useMemo, useState } from "react";
import { Drawer, Avatar, Tag, Button, Collapse, Divider, Modal } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon, PrinterIcon } from "@hugeicons/core-free-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReceiptPreview from "../../../../cashier/_pages/orders/receipt";
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

const normalizeStatus = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const toStatusLabel = (value) =>
  normalizeStatus(value)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toMultilineStatusLabel = (value) => {
  const words = toStatusLabel(value).split(" ").filter(Boolean);
  if (words.length <= 1) return words[0] ?? "";
  if (words.length === 2) return words.join("\n");

  const pivot = Math.ceil(words.length / 2);
  return `${words.slice(0, pivot).join(" ")}\n${words.slice(pivot).join(" ")}`;
};

const PendingOrderDrawer = ({ orderData, onClose, onMarkAsPreparing, onMarkAsReady, onCancel }) => {
  const [activeKey, setActiveKey] = useState(["1"]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const status = normalizeStatus(orderData?.status);
  const isPending = status === "pending";
  const isPreparing = status === "preparing";
  const isReady = status === "ready";
  const isInTransit = status === "in_transit";
  const isPickedUp = status === "picked_up";
  const isDelivered = status === "delivered";
  const backendStatusSteps = useMemo(() => {
    const rawSteps =
      orderData?.status_steps ??
      orderData?.statuses ??
      orderData?.status_flow ??
      orderData?.available_statuses ??
      orderData?.order_statuses ??
      orderData?.tracking_statuses;

    if (!Array.isArray(rawSteps)) return [];

    return rawSteps
      .map((step) => {
        if (typeof step === "string") return normalizeStatus(step);
        return normalizeStatus(step?.status ?? step?.name ?? step?.key);
      })
      .filter(Boolean);
  }, [orderData]);

  const orderStatusSteps = useMemo(() => {
    const fallbackSteps = ["pending", "preparing", "ready", "in_transit", "delivered"];
    const steps = backendStatusSteps.length ? [...backendStatusSteps] : fallbackSteps;

    if (status && !steps.includes(status)) {
      steps.push(status);
    }

    return [...new Set(steps)];
  }, [backendStatusSteps, status]);

  const activeStatusIndex = useMemo(() => {
    if (!orderStatusSteps.length) return 0;
    if (!status) return 0;

    const exactIndex = orderStatusSteps.findIndex((step) => step === status);
    if (exactIndex >= 0) return exactIndex;

    if (status === "picked_up") {
      const inTransitIndex = orderStatusSteps.findIndex((step) => step === "in_transit");
      if (inTransitIndex >= 0) return inTransitIndex;
    }

    if (status === "in_transit") {
      const pickedUpIndex = orderStatusSteps.findIndex((step) => step === "picked_up");
      if (pickedUpIndex >= 0) return pickedUpIndex;
    }

    return Math.max(orderStatusSteps.length - 1, 0);
  }, [orderStatusSteps, status]);

  const showRiderInfo = (isReady || isInTransit || isPickedUp || isDelivered) && orderData?.rider;
  const data = useMemo(() => {
    if (!orderData) return null;

    // Map customer info
    const customer = {
      name: orderData.customer?.name ?? orderData.guest?.name,
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

  // Timer: countdown from preparation_start_time + preparation_time (only when preparing)
  useEffect(() => {
    // Only show timer when order is in "preparing" status
    if (!isPreparing || !orderData?.preparation_start_time) {
      setElapsedSeconds(0);
      return;
    }

    const startTime = new Date(orderData.preparation_start_time).getTime();
    if (Number.isNaN(startTime)) {
      setElapsedSeconds(0);
      return;
    }

    // Calculate total preparation time in seconds from all items
    const totalPrepTimeSeconds =
      orderData.items?.reduce((total, item) => {
        const prepTime = item.menu_item?.preparation_time;
        if (!prepTime) return total;

        // Parse preparation time (e.g., "15m" -> 15 minutes)
        const match = prepTime.match(/(\d+)m/);
        if (match) {
          return total + parseInt(match[1], 10) * 60;
        }
        return total;
      }, 0) || 0;

    // Initialize and update countdown
    const update = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, totalPrepTimeSeconds - elapsed);
      setElapsedSeconds(remaining);
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [isPreparing, orderData?.preparation_start_time, orderData?.items]);

  const totalAmount = data?.totalAmount ?? 0;

  const handleCancel = () => {
    onCancel?.(orderData);
    onClose();
  };
  // const orderType = data.type;
  return (
    <>
      <Drawer
        placement="right"
        onClose={onClose}
        open={!!orderData}
        width={400}
        bodyStyle={{ padding: 0 }}
        title={null}
        onClick={(e) => e.stopPropagation()}
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
                    orderData.order_type === "DELIVERY" || orderData.order_type === "delivery"
                      ? "#00BC1A"
                      : orderData.order_type === "PICKUP" || orderData.order_type === "pickup"
                        ? "#F5AB0A"
                        : "#1F5226",
                  color:
                    orderData.order_type === "DELIVERY" || orderData.order_type === "delivery"
                      ? "#FFFFFF"
                      : orderData.order_type === "PICKUP" || orderData.order_type === "pickup"
                        ? "#1F5226"
                        : "#FFFFFF",
                }}
              >
                {/* If you prefer table number or T4 style */}
                <span className="text-lg font-semibold text-white">
                  {orderData.order_type === "DELIVERY" || orderData.order_type === "delivery"
                    ? "DL"
                    : orderData.order_type === "PICKUP" || orderData.order_type === "pickup"
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
                  {data.type === "DINE_IN" ? "DINE IN" : data.type}
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
                    <HugeiconsIcon icon={ArrowUp01Icon} size={18} className="text-primary" />
                  ) : (
                    <HugeiconsIcon icon={ArrowDown01Icon} size={18} className="text-primary" />
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

              {/* Large countdown timer (MM:SS) - only show when preparing */}
              {isPreparing && orderData?.preparation_start_time && (
                <div className="mt-6 flex w-full items-center justify-center">
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: elapsedSeconds === 0 ? "#fee2e2" : "#f3f4f6",
                      width: "220px",
                      textAlign: "center",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 36,
                        letterSpacing: 2,
                        color: elapsedSeconds === 0 ? "#dc2626" : "#000",
                      }}
                    >
                      {formatMMSS(elapsedSeconds)}
                    </div>
                    {/* <div className="mt-1 text-xs text-gray-500">
                    {elapsedSeconds === 0 ? "Time's up!" : "Remaining"}
                  </div> */}
                  </div>
                </div>
              )}
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
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                          {item.description}
                        </p>
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
              </>
            )}

            <div className="p-6">
              {isPending || isPreparing ? (
                <div className="space-y-3">
                  {/* Preparing Button */}
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

                  {/* Ready Button */}
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

                  {/* Cancel Button: ✅ Only active if Pending */}
                  <Button
                    size="large"
                    block
                    onClick={handleCancel}
                    danger
                    ghost
                    className="rounded-lg font-semibold"
                    style={{ height: "48px" }}
                  >
                    Cancel Order
                  </Button>
                </div>
              ) : (
                showRiderInfo && (
                  <>
                    <div className="flex items-center justify-between rounded-xl bg-[#D4F7DC] p-4 text-[#1F5226]">
                      <div className="flex items-center gap-3">
                        <Avatar
                          size={48}
                          className="bg-[#00BC1A] text-lg font-bold text-white"
                          style={{ borderRadius: "10px" }}
                        >
                          {orderData.rider.name
                            ? orderData.rider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "R"}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs text-[#2A3A25] opacity-70">Rider’s Name</span>
                          <span className="text-base font-bold">{orderData.rider.name}</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#1F5226]">
                        Order {toStatusLabel(status)}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#dfe6dd] p-4">
                      <h3 className="mb-3 text-[24px] leading-none font-medium text-[#1f2620]">
                        Order Status
                      </h3>
                      <div className="flex h-[64px] overflow-hidden rounded-[34px] border border-[#d8ddd7] bg-[#f3f5f2] shadow-[inset_0_8px_12px_-10px_rgba(0,0,0,0.45)]">
                        {orderStatusSteps.map((step, index) => {
                          const isActive = index === activeStatusIndex;
                          const isFirst = index === 0;
                          const isLast = index === orderStatusSteps.length - 1;
                          const label = toMultilineStatusLabel(step);

                          // Clip path logic:
                          // First: flat left, arrow right
                          // Last: arrow-notch left, flat right (rounded handled by container)
                          // Middle: arrow-notch left, arrow right
                          // Active gets full green fill; inactive get transparent with light divider arrow shape

                          const getClipPath = () => {
                            if (isFirst && isLast) return "none";
                            if (isFirst)
                              return "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)";
                            if (isLast) return "polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)";
                            return "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)";
                          };

                          return (
                            <div
                              key={`${step}-${index}`}
                              className="relative flex h-full flex-1 items-center justify-center text-[11px] leading-tight font-medium"
                              style={{
                                color: isActive ? "#ffffff" : "#1f5a32",
                                backgroundColor: isActive ? "#00BC1A" : "transparent",
                                clipPath: getClipPath(),
                                marginLeft: isFirst ? "0" : "-20px",
                                paddingLeft: isFirst ? "0" : "20px",
                                paddingRight: isLast ? "0" : "20px",
                                zIndex: isActive
                                  ? orderStatusSteps.length + 1
                                  : orderStatusSteps.length - index,
                              }}
                            >
                              {/* Divider arrow outline for inactive steps after active */}
                              {!isActive && !isFirst && (
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    clipPath: getClipPath(),
                                    border: "none",
                                  }}
                                />
                              )}
                              <span className="text-center whitespace-pre-line">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )
              )}

              <Button
                icon={<HugeiconsIcon icon={PrinterIcon} className="h-4 w-4" />}
                block
                className="mt-5 border border-gray-300 py-2 text-sm hover:bg-gray-50"
                onClick={() => setShowReceiptModal(true)}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">No order selected</div>
        )}
      </Drawer>
      <Modal
        open={showReceiptModal}
        footer={null}
        onCancel={() => setShowReceiptModal(false)}
        centered
        width={400}
      >
        <ReceiptPreview order={orderData} />
      </Modal>
    </>
  );
};

export default PendingOrderDrawer;
