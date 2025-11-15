import React, { useState, useEffect } from "react";
import { Card, Tag, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// ✅ Default Status Config (You can add more here if you want custom color/label)
const STATUS_MAP = {
  pending: { label: "Order Pending", color: "#FFD89C" },
  completed: { label: "Order Completed", color: "#32CD32" },
  cancelled: { label: "Order Cancelled", color: "#FF4D4F" },
  accepted: { label: "Order Accepted", color: "#00BC1A" },
  ready: { label: "Order Ready", color: "#FFA500" },
};

// ✅ Fallback color for unknown statuses
const DEFAULT_STATUS_COLOR = "#D3D3D3"; // grey
const DEFAULT_LABEL_PREFIX = "Order";

const OrderCard = ({
  id,
  status = "pending",
  orderId,
  orderType,
  time,
  description,
  price,
  paid,
  images = [],
  extraItems = 0,
  onEdit = () => {},
  onDelete = () => {},
  onClick = () => {},
  isSelected = false,
}) => {
  const [currentMainImage, setCurrentMainImage] = useState(images?.[0] || null);

  useEffect(() => {
    if (images?.length > 0) {
      setCurrentMainImage(images[0]);
    }
  }, [images]);

  const formattedTime = time || "—";

  // ✅ Automatically handle any new unknown status
  const statusInfo = STATUS_MAP[status] || {
    label: `${DEFAULT_LABEL_PREFIX} ${status?.charAt(0).toUpperCase() + status?.slice(1)}`,
    color: DEFAULT_STATUS_COLOR,
  };

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer rounded-2xl transition-all duration-300 ${
        isSelected ? "scale-[1.02] border-2 !border-green-500 shadow-lg" : "border border-gray-200"
      }`}
      bodyStyle={{ padding: "1rem" }}
    >
      {/* MAIN IMAGE + STATUS */}
      <div className="relative flex items-center justify-center gap-3 rounded-2xl !bg-[#1F5226]">
        <div className="relative flex w-3/4 items-center justify-center px-4 py-6">
          {currentMainImage ? (
            <img
              src={currentMainImage}
              alt="Order"
              className="h-36 w-36 rounded-xl object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-gray-200 text-gray-400">
              No Image
            </div>
          )}

          <div className="absolute top-2 left-2">
            <Tag
              color={statusInfo.color}
              className="!rounded-full border-none px-3 py-1 text-xs font-medium text-black"
              style={{
                backgroundColor: statusInfo.color,
                color: "#000",
                border: "none",
              }}
            >
              {statusInfo.label}
            </Tag>
          </div>
        </div>

        {/* SMALL THUMBNAILS */}
        <div className="flex w-1/4 flex-col items-center space-y-1 py-2">
          {images.slice(1, 4).map((img, idx) => (
            <div
              key={idx}
              className="flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentMainImage(img);
              }}
            >
              <img src={img} className="h-full w-full rounded-md object-cover" alt="sub" />
            </div>
          ))}

          {extraItems > 0 && (
            <div className="rounded-md bg-green-700 px-1 py-1 text-[8px] font-semibold text-white">
              +{extraItems} more
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold text-gray-800">{orderId}</p>
          <span className="rounded-full bg-gray-100 px-2 py-[2px] text-[11px] text-gray-600">
            {orderType}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
          <span className="opacity-70">Order Time:</span>
          <span className="font-medium text-gray-600">{formattedTime}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{description}</p>
      </div>

      {/* PRICE + ACTIONS */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">£{Number(price || 0).toFixed(2)}</p>

          {paid && (
            <Tag
              color="green"
              className="mt-1 rounded-md border-none text-xs font-medium text-white"
              style={{ backgroundColor: "#1F5226" }}
            >
              Paid
            </Tag>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="small"
            icon={<EditOutlined />}
            className="rounded-md border-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            className="rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
