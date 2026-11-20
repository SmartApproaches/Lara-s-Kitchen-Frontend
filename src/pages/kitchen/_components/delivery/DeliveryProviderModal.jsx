import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "antd";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { DeliveryTruck01Icon, Motorbike01Icon } from "@hugeicons/core-free-icons";

import { useUpdateOrderStatusMutation } from "../../../../redux/slices/kitchen/kitchenDashboardApiSlice";

const ProviderOption = ({ selected, onSelect, icon, title, subtitle, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onSelect}
    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
      selected
        ? "border-[#1F5226] bg-[#EFFFF1]"
        : "border-gray-200 bg-white hover:border-[#157F3B]/50"
    } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
  >
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
        selected ? "bg-[#1F5226] text-white" : "bg-[#D6FADB] text-[#1F5226]"
      }`}
    >
      <HugeiconsIcon icon={icon} size={26} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-base font-bold text-[#2A3A25]">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
    <span
      className={`h-5 w-5 flex-shrink-0 rounded-full border-2 ${
        selected ? "border-[#1F5226] bg-[#1F5226] shadow-[inset_0_0_0_3px_#fff]" : "border-gray-300"
      }`}
    />
  </button>
);

const showPickupCodeToast = (pickupCode) =>
  toast.success(
    <span>
      SmartEatX rider booked. Pickup code{" "}
      <strong className="text-xl tracking-widest">{pickupCode ?? "—"}</strong>: the rider will ask
      for it.
    </span>,
    { duration: 15000 },
  );

/**
 * "Who's delivering order #…?" pop-up shown when a delivery order is marked ready.
 * Sends PATCH update-order-status with status "ready" and the chosen delivery_provider.
 */
const DeliveryProviderModal = ({ order, onClose }) => {
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [provider, setProvider] = useState("internal");
  const [error, setError] = useState(null);

  // Reset each time the pop-up opens for an order.
  useEffect(() => {
    if (order) {
      setProvider("internal");
      setError(null);
    }
  }, [order?.id]);

  const deliveryFee = Number(order?.delivery_fee ?? 0);

  const send = async (chosen) => {
    setProvider(chosen);
    setError(null);
    try {
      const res = await updateOrderStatus({
        orderId: order.id,
        status: "ready",
        delivery_provider: chosen,
      }).unwrap();

      if (chosen === "external") {
        showPickupCodeToast(res?.data?.external_delivery?.pickup_code);
      } else {
        toast.success("Order marked as Ready ✅ Our riders will take it.");
      }
      onClose();
    } catch (err) {
      // The order is already marked ready at this point; keep the pop-up open so the
      // kitchen can retry SmartEatX or fall back to our rider.
      setError({
        provider: chosen,
        message: err?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const failedExternal = error?.provider === "external";

  return (
    <Modal
      open={!!order}
      onCancel={isLoading ? undefined : onClose}
      closable={!isLoading}
      maskClosable={!isLoading}
      footer={null}
      centered
      width={460}
      destroyOnHidden
      title={
        <span className="text-lg font-bold text-[#2A3A25]">
          Who&apos;s delivering order #{order?.order_number ?? order?.id}?
        </span>
      }
    >
      <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <ProviderOption
          selected={provider === "internal"}
          onSelect={() => setProvider("internal")}
          disabled={isLoading}
          icon={Motorbike01Icon}
          title="Our rider"
          subtitle="Lara's riders get the order, as usual."
        />
        <ProviderOption
          selected={provider === "external"}
          onSelect={() => setProvider("external")}
          disabled={isLoading}
          icon={DeliveryTruck01Icon}
          title="SmartEatX rider"
          subtitle={`We book a SmartEatX rider. The customer paid £${deliveryFee.toFixed(2)} for delivery.`}
        />

        {error && (
          <Alert type="error" showIcon message={error.message} className="!mt-4 !rounded-xl" />
        )}

        <div className="pt-2">
          {failedExternal ? (
            <div className="flex gap-3">
              <Button
                size="large"
                block
                loading={isLoading && provider === "external"}
                disabled={isLoading}
                onClick={() => send("external")}
                className="rounded-lg border border-[#157F3B] font-semibold !text-[#157F3B]"
              >
                Try again
              </Button>
              <Button
                size="large"
                block
                loading={isLoading && provider === "internal"}
                disabled={isLoading}
                onClick={() => send("internal")}
                className="rounded-lg !border-none !bg-[#1F5226] font-semibold !text-white hover:!bg-[#0d5729]"
              >
                Use our rider
              </Button>
            </div>
          ) : (
            <Button
              size="large"
              block
              loading={isLoading}
              disabled={isLoading}
              onClick={() => send(provider)}
              className="rounded-lg !border-none !bg-[#1F5226] font-semibold !text-white hover:!bg-[#0d5729]"
            >
              Mark as ready
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryProviderModal;
