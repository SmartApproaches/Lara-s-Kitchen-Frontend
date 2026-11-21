// Helpers for SmartEatX ("external") deliveries on kitchen orders.

// Tolerates casing/spacing variants ("delivery", "DELIVERY", "Delivery ", "home_delivery").
export const isDeliveryOrder = (order) =>
  String(order?.order_type ?? order?.orderType ?? order?.type ?? "")
    .trim()
    .toLowerCase()
    .includes("deliver");

export const isExternalDelivery = (order) =>
  order?.delivery_provider === "external" && !!order?.external_delivery;

// Once SmartEatX's rider has collected the order it can no longer be called off.
const COLLECTED_STATUSES = ["picked_up", "in_transit", "at_dropoff", "delivered"];

export const canChangeRider = (order) =>
  String(order?.status ?? "").toLowerCase() === "ready" &&
  isExternalDelivery(order) &&
  !COLLECTED_STATUSES.includes(order.external_delivery.status);

const capitalise = (value) =>
  String(value ?? "")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

// Chip text + colours for external_delivery.status.
export const externalStatusChip = (externalDelivery) => {
  const status = externalDelivery?.status;
  const courierName = externalDelivery?.courier?.name;

  switch (status) {
    case "pending":
    case "scheduled":
    case "searching":
      return { label: "Finding a rider", bg: "#FFEDC7", color: "#B77900" };
    case "assigned":
      return {
        label: courierName ? `Rider on the way · ${courierName}` : "Rider on the way",
        bg: "#DCEBFF",
        color: "#1D5FBF",
      };
    case "at_pickup":
      return { label: "Rider is here", bg: "#00BC1A", color: "#FFFFFF" };
    case "picked_up":
    case "in_transit":
    case "at_dropoff":
      return { label: "On its way to the customer", bg: "#D4F7DC", color: "#1F5226" };
    case "delivered":
      return { label: "Delivered", bg: "#E9FDEB", color: "#00BC1A" };
    case "cancelled":
    case "failed":
    case "returned":
      return {
        label: externalDelivery?.reason
          ? `${capitalise(status)}: ${externalDelivery.reason}`
          : capitalise(status),
        bg: "#FEE2E2",
        color: "#B91C1C",
      };
    default:
      return { label: capitalise(status) || "Unknown", bg: "#F3F4F6", color: "#4B5563" };
  }
};
