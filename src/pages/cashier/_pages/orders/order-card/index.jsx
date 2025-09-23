import React, { useState, useEffect } from "react";
import { Card, Tag, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const statusColors = {
  pending: "#FFD89C",
  completed: "green",
  cancelled: "red",
};

const statusLabels = {
  pending: "Order Pending",
  completed: "Order Completed",
  cancelled: "Order Cancelled",
};

const OrderCard = ({
  status = "pending",
  orderId = "N2345678",
  orderType = "Online",
  time = "Aug 16, 2025 • 12:02pm",
  description = "1 plate of Amala, 2 plates of semo, baileys, coke, Fanta",
  price = 120,
  paid = true,
  images = [],
  extraItems = 0,
  onEdit,
  onDelete,
  onClick,
  isSelected,
}) => {
  const [currentMainImage, setCurrentMainImage] = useState(images[0] || null);

  // 🔑 update main image when images prop changes
  useEffect(() => {
    if (images && images.length > 0) {
      setCurrentMainImage(images[0]);
    }
  }, [images]);

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer rounded-2xl transition-all duration-300 ${isSelected ? "scale-[1.02] border-2 !border-green-500 shadow-lg" : "border border-gray-200"} `}
      bodyStyle={{ padding: "1rem" }}
    >
      {/* Top Section: Main Image + Thumbnails */}
      <div className="bg-primary relative flex items-center justify-center gap-3 rounded-2xl">
        {/* Main Image */}
        <div className="relative flex w-3/4 items-center justify-center px-4 py-6">
          {currentMainImage ? (
            <img
              src={currentMainImage}
              alt="Food"
              className="h-36 w-36 rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              No Image
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Tag
              color={statusColors[status]}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: statusColors[status], border: "none" }}
            >
              {statusLabels[status]}
            </Tag>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex w-1/4 flex-col items-center justify-start space-y-1 py-2">
          {images.slice(1, 4).map((img, idx) => (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-md bg-[#C6FFCE] object-contain p-1"
              key={idx}
            >
              <img src={img} alt="Thumbnail" onClick={() => setCurrentMainImage(img)} />
            </div>
          ))}
          {extraItems > 0 && (
            <div className="flex items-center justify-center rounded-md bg-green-600 px-1 py-1 text-[8px] font-semibold text-white">
              +{extraItems} Items
            </div>
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="mt-4">
        <div className="flex justify-between">
          <p className="font-semibold text-gray-800">{orderId}</p>
          <span>{orderType}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Order Time: </span>
          <span>{time}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-600">{description}</p>

      {/* Price & Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">£{price.toFixed(2)}</p>
          {paid && (
            <Tag color="green" className="rounded-md px-2 text-xs" style={{ border: "none" }}>
              Paid
            </Tag>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="small"
            icon={<EditOutlined />}
            className="rounded-md border-gray-300"
            onClick={onEdit}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            className="rounded-md"
            onClick={onDelete}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
