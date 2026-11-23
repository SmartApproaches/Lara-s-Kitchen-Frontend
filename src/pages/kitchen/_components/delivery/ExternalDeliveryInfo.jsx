import { Button } from "antd";

import {
  canChangeRider,
  externalStatusChip,
  getPickupCode,
  isExternalDelivery,
} from "./externalDelivery";

/**
 * SmartEatX delivery panel for kitchen order cards and the order drawer:
 * badge, pickup code, rider name and a status chip. Renders nothing for other orders.
 */
const ExternalDeliveryInfo = ({ order, onChangeRider, large = false }) => {
  if (!isExternalDelivery(order)) return null;

  const delivery = order.external_delivery ?? {};
  const chip = externalStatusChip(delivery);
  const courierName = delivery.courier?.name;

  return (
    <div
      className="mt-4 rounded-xl border border-[#C3F4C9] bg-[#F5FFF6] p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#2A3A25] px-3 py-1 text-[10px] font-bold tracking-wide text-white">
          SmartEatX
        </span>
        <span
          className="rounded-lg px-3 py-1 text-right text-[10px] font-semibold"
          style={{ backgroundColor: chip.bg, color: chip.color }}
        >
          {chip.label}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className={`text-[#2A3A25] opacity-70 ${large ? "text-xs" : "text-[10px]"}`}>
            Pickup code
          </p>
          <p
            className={`font-mono font-bold tracking-[0.2em] text-[#1F5226] ${
              large ? "text-4xl" : "text-2xl"
            }`}
          >
            {getPickupCode(order) ?? "—"}
          </p>
        </div>
        {courierName && (
          <div className="text-right">
            <p className={`text-[#2A3A25] opacity-70 ${large ? "text-xs" : "text-[10px]"}`}>
              Rider&apos;s Name
            </p>
            <p className={`font-bold text-[#1F5226] ${large ? "text-base" : "text-xs"}`}>
              {courierName}
            </p>
          </div>
        )}
      </div>

      {onChangeRider && canChangeRider(order) && (
        <Button
          size="small"
          block
          className="mt-3 rounded-lg border border-[#157F3B] !text-[11px] font-semibold !text-[#157F3B]"
          onClick={(e) => {
            e.stopPropagation();
            onChangeRider(order);
          }}
        >
          Change rider
        </Button>
      )}
    </div>
  );
};

export default ExternalDeliveryInfo;
