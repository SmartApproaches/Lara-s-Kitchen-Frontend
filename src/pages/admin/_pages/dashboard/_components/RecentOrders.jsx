import React, { useState } from "react";
import { List, Tag, Card } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const RecentOrders = ({ orders }) => {
  const [itemIndices, setItemIndices] = useState(orders?.map(() => 0) || []);

  const handleNext = () => {
    setItemIndices((prev) =>
      prev.map((index, orderIdx) => {
        const maxIndex = (orders[orderIdx]?.items?.length || 1) - 1;
        return index < maxIndex ? index + 1 : index;
      }),
    );
  };

  const handlePrevious = () => {
    setItemIndices((prev) => prev.map((index) => (index > 0 ? index - 1 : index)));
  };

  const canGoNext = itemIndices.some(
    (index, orderIdx) => index < (orders[orderIdx]?.items?.length || 1) - 1,
  );

  const canGoPrevious = itemIndices.some((index) => index > 0);

  return (
    <Card
      title="Recent Orders"
      extra={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="text-gray-500" />
          </button>
          <button onClick={handleNext} disabled={!canGoNext} className="disabled:opacity-30">
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-gray-500" />
          </button>
        </div>
      }
      className="rounded-xl border border-gray-100 shadow-sm"
    >
      <List
        dataSource={orders}
        renderItem={(order, orderIdx) => {
          const currentItemIndex = itemIndices[orderIdx] || 0;
          const item = order?.items?.[currentItemIndex];

          return (
            <List.Item className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item?.menu_item?.media?.url}
                  alt={item?.menu_item?.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold capitalize text-gray-900">{item?.menu_item?.name}</p>
                  <p className="text-sm font-bold text-green-600">£{item?.subtotal}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(order?.created_at).toLocaleDateString()}
                </p>
                <Tag
                  style={{ borderRadius: "12px" }}
                  color={order?.status === "completed" ? "green" : "orange"}
                  className="px-2 capitalize py-0.5 text-xs"
                >
                  {order?.status?.replaceAll("_", " ")}
                </Tag>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default RecentOrders;
