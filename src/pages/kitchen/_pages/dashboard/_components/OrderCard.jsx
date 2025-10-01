import React from "react";
import { Card, Avatar, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const OrderCard = ({
  orderId = "N2345678",
  orderType = "Dine In",
  itemCount = 5,
  timeAgo = "3 mins ago",
  status = "Preparing",
  avatarText = "T1",
}) => {
  return (
    <Card
      className="w-full rounded-xl border-none shadow-sm transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "#C6FFCE",
      }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <Avatar
          className="shrink-0 text-sm font-bold sm:text-base"
          style={{
            backgroundColor: "#FF8C00",
            color: "#000",
            width: "48px",
            height: "48px",
          }}
        >
          {avatarText}
        </Avatar>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-primary min-w-0 text-base font-bold tracking-wide break-words sm:text-lg md:text-xl">
              {orderId}
            </span>
            <span className="shrink-0 text-xs whitespace-nowrap text-gray-500 sm:text-sm">
              <ClockCircleOutlined className="mr-1" />
              {timeAgo}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="font-medium break-words text-[#4CAF50]">{orderType}</span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-[#4CAF50]" />
              <span className="shrink-0 font-medium whitespace-nowrap text-[#4CAF50]">
                {itemCount} Items
              </span>
            </div>

            <Tag
              className="m-0 !w-fit shrink-0 border-none !px-3 py-1 text-xs font-medium sm:!px-4 sm:text-sm"
              style={{
                backgroundColor:
                  status === "Preparing" ? "#FFF3D7" : status === "Ready" ? "#C3F4C9" : "#FFE6E6",
                color:
                  status === "Preparing" ? "#F5AB0A" : status === "Ready" ? "#00BC1A" : "#FF0000",
                borderRadius: "10px",
              }}
            >
              {status}
            </Tag>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
