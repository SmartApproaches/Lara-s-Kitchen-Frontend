import React, { useState } from "react";
import RecentOrders from "../dashboard/components/recent-orders";
import OrderCard from "./order-card";
import { IMAGES, ICONS } from "../../../../constants";
import OrderSidePanel from "./order-sidepanel";

const orders = [
  {
    status: "pending",
    orderId: "N2345678",
    orderType: "Online",
    time: "Aug 16, 2025 • 12:02pm",
    description: "1 plate of Amala, 2 plates of semo, baileys, coke, Fanta",
    price: 120,
    paid: true,
    images: [IMAGES.abula, ICONS.efoIcon, ICONS.efoIcon, IMAGES.whine],
    extraItems: 2,
  },
  {
    status: "completed",
    orderId: "N9876543",
    orderType: "Table 4",
    time: "Aug 16, 2025 • 12:40pm",
    description: "2 plates of rice, chicken, malt, sprite",
    price: 85,
    paid: true,
    images: [IMAGES.abula, ICONS.efoIcon, ICONS.efoIcon, IMAGES.whine],
    extraItems: 2,
  },
  {
    status: "pending",
    orderId: "N2345678",
    orderType: "Online",
    time: "Aug 16, 2025 • 12:02pm",
    description: "1 plate of Amala, 2 plates of semo, baileys, coke, Fanta",
    price: 120,
    paid: true,
    images: [IMAGES.abula, ICONS.efoIcon, ICONS.efoIcon, IMAGES.whine], // ✅ changed
    extraItems: 2,
  },
  {
    status: "completed",
    orderId: "N9876543",
    orderType: "Table 4",
    time: "Aug 16, 2025 • 12:40pm",
    description: "2 plates of rice, chicken, malt, sprite",
    price: 85,
    paid: true,
    images: [IMAGES.abula, ICONS.efoIcon, ICONS.efoIcon, IMAGES.whine],
    extraItems: 2,
  },
];

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div>
      <h3 className="text-primary text-3xl font-bold">Order List</h3>
      <RecentOrders />

      {/* Main content + side panel wrapper */}
      <div className="mt-5 flex gap-4">
        {/* Orders grid */}
        <div className={`transition-all duration-300 ${selectedOrder ? "w-3/4" : "w-full"}`}>
          <div className={`grid gap-4 ${selectedOrder ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                isSelected={selectedOrder?.orderId === order.orderId}
                status={order.status}
                orderId={order.orderId}
                orderType={order.orderType}
                time={order.time}
                description={order.description}
                price={order.price}
                paid={order.paid}
                images={order.images}
                extraItems={order.extraItems}
                onClick={() => setSelectedOrder(order)}
                onEdit={() => console.log("Edit", order.orderId)}
                onDelete={() => console.log("Delete", order.orderId)}
              />
            ))}
          </div>
        </div>

        {/* Side panel */}
        {selectedOrder && (
          <div className="w-1/4 transition-all duration-300">
            <OrderSidePanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
