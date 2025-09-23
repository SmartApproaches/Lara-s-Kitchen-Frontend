import React from "react";
import { Card, Alert, Skeleton } from "antd";
import { ArrowUpRight01Icon } from "hugeicons-react";

const StatsCards = ({ stats, isLoading, isError }) => {
  const colors = {
    total: "bg-[#1F5226]",
    pending: "bg-[#F5AB0A]",
    cancelled: "bg-[#FF0000]",
    delivered: "bg-[#00BC1A]",
  };

  if (isLoading) return <Skeleton active paragraph={{ rows: 2 }} />;
  if (isError) return <Alert type="error" message="Failed to load stats" />;

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(stats).map(([key, s]) =>
        stats?.length !== 0 ? (
          <Card
            key={key}
            className={`relative overflow-hidden !rounded-2xl text-white shadow-md ${s?.label === "Total Orders" && "!bg-[#A5FFB1]"}`}
          >
            <p
              className={`absolute top-0 right-0 left-0 py-2 text-center text-sm font-semibold capitalize sm:text-base md:py-3 ${colors[key]} rounded-2xl text-white`}
            >
              {s?.label}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center sm:mt-10">
              <h2 className="text-primary text-xl font-bold sm:text-2xl lg:text-3xl">
                {s?.value.toLocaleString()}
              </h2>
              <div
                className={`mt-4 mb-2 flex flex-wrap justify-center gap-4 text-xs sm:text-sm ${s.label === "Total Orders" || s.label === "Delivered" ? "mb-5 text-[#00BC1A]" : "mb-2"}`}
              >
                <span className="font-medium">Delivery: {s?.delivery}</span>
                <span className="font-medium">Dine In: {s?.dineIn}</span>
                <span className="font-medium">Pick Up: {s?.pickup}</span>
              </div>
            </div>
            {s?.label === "Total Orders" && (
              <div className="absolute right-0 bottom-2 left-0 mx-auto flex h-1 w-fit items-center justify-center gap-1 rounded-xl bg-[#0CA921] p-2 py-3 text-xs font-medium text-white sm:text-sm">
                <ArrowUpRight01Icon size={15} />
                <p>12% vs last week</p>
              </div>
            )}
            {s?.label === "Delivered" && (
              <div className="bg-text text-primary absolute right-0 bottom-2 left-0 mx-auto flex h-1 w-fit items-center justify-center gap-1 rounded-xl p-2 py-3 text-xs font-medium sm:text-sm">
                <ArrowUpRight01Icon size={15} />
                <p>98% on-time delivery</p>
              </div>
            )}
          </Card>
        ) : (
          <div key={key} className="col-span-1">
            <Alert
              style={{
                border: "1px solid #00BC1A",
                color: "#00BC1A",
                backgroundColor: "#F0FFF4",
                fontWeight: "600",
              }}
              type="info"
              message="No stats available"
            />
          </div>
        ),
      )}
    </div>
  );
};

export default StatsCards;
