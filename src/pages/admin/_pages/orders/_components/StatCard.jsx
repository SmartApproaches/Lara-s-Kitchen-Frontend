import React from "react";
import { Card, Alert } from "antd";

const StatsCards = ({ stats }) => {
  const colorMap = {
    total_orders: "bg-[#1F5226]",
    pending_orders: "bg-[#F5AB0A]",
    cancelled_orders: "bg-[#FF0000]",
    delivered_orders: "bg-[#00BC1A]",
  };

  const labelMap = {
    total_orders: "Total Orders",
    pending_orders: "Pending Orders",
    cancelled_orders: "Cancelled Orders",
    delivered_orders: "Delivered Orders",
  };

  if (!stats || Object.keys(stats).length === 0)
    return (
      <Alert
        style={{
          border: "1px solid #00BC1A",
          color: "#00BC1A",
          backgroundColor: "#F0FFF4",
          fontWeight: "600",
        }}
        type="info"
        message="No order stats available"
      />
    );

  return (
    <>
      {Object.entries(stats).map(([key, s]) => (
        <Card
          key={key}
          className={`relative overflow-hidden !rounded-2xl text-white shadow-md ${
            key === "total_orders" && "!bg-[#A5FFB1]"
          }`}
        >
          <p
            className={`absolute top-0 right-0 left-0 py-2 text-center text-sm font-semibold capitalize sm:text-base md:py-3 ${colorMap[key]} rounded-2xl text-white`}
          >
            {labelMap[key]}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center sm:mt-10">
            <h2 className="text-primary text-xl font-bold sm:text-2xl lg:text-3xl">
              {s?.total || "0"}
            </h2>
            <div
              className={`mt-4 mb-2 flex flex-wrap justify-center gap-4 text-xs sm:text-sm ${
                key === "total_orders" || key === "delivered_orders"
                  ? "mb-5 text-[#00BC1A]"
                  : "mb-2"
              }`}
            >
              <span className="font-medium">Delivery: {s?.delivery || "N/A"}</span>
              <span className="font-medium">Dine In: {s?.dine_in || "N/A"}</span>
              <span className="font-medium">Pick Up: {s?.pickup || "N/A"}</span>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default StatsCards;
