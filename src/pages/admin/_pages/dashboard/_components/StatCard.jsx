import React from "react";
import { Card } from "antd";

const StatCard = ({ icon, title, value }) => {
  return (
    <Card className="rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:drop-shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-base font-semibold text-gray-500">{title}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-accent shrink-0 rounded-2xl p-3">
            <img src={icon} className="h-10 w-10 object-contain sm:h-12 sm:w-12" alt={title} />
          </div>

          <div>
            <h3 className="text-primary text-2xl font-bold sm:text-3xl lg:text-4xl">{value}</h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
