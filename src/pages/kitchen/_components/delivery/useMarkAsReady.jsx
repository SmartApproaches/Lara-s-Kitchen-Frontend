import { useState } from "react";
import toast from "react-hot-toast";

import { useUpdateOrderStatusMutation } from "../../../../redux/slices/kitchen/kitchenDashboardApiSlice";
import DeliveryProviderModal from "./DeliveryProviderModal";
import { isDeliveryOrder } from "./externalDelivery";

/**
 * Marks kitchen orders ready. Delivery orders open the "who delivers" pop-up first;
 * collection and dine-in orders are marked ready straight away.
 *
 * Render `deliveryModal` once in the page.
 */
const useMarkAsReady = () => {
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deliveryOrder, setDeliveryOrder] = useState(null);

  const markAsReady = async (order) => {
    if (isDeliveryOrder(order)) {
      setDeliveryOrder(order);
      return;
    }

    try {
      await updateOrderStatus({ orderId: order.id, status: "ready" }).unwrap();
      toast.success("Order marked as Ready ✅");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order ❌");
    }
  };

  const deliveryModal = (
    <DeliveryProviderModal order={deliveryOrder} onClose={() => setDeliveryOrder(null)} />
  );

  return {
    markAsReady,
    // Re-open the pop-up for a ready order (e.g. switch a SmartEatX booking to our rider).
    changeRider: setDeliveryOrder,
    deliveryModal,
  };
};

export default useMarkAsReady;
