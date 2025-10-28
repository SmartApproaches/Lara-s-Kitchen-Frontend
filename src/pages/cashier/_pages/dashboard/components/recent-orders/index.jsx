import React from "react";
import { Tag, Row, Col, Skeleton } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const getOrderDisplay = (order) => {
  const type = order?.order_type?.toLowerCase();
  const tableNumber = order?.table_number;

  switch (type) {
    case "pickup":
      return {
        prefix: "PK",
        label: "Pickup",
        bgColor: "#F5AB0A", // Yellow
      };

    case "delivery":
      return {
        prefix: "DL",
        label: "Delivery",
        bgColor: "#00BC1A", // Green
      };

    case "dine_in":
      return {
        prefix: `T${tableNumber || ""}`,
        label: "Dine in",
        bgColor: "#1F5226", // Dark Green
      };

    default:
      return {
        prefix: "--",
        label: "Unknown",
        bgColor: "#6B7280",
      };
  }
};

const RecentOrders = ({ recentOrders = [], loading }) => {
  return (
    <div className="rounded-2xl bg-[#DAFFDF] p-6">
      <h3 className="mb-5 text-lg font-medium text-gray-500">Recent Orders</h3>

      {loading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <div className="rounded-xl bg-white p-4">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : recentOrders.length === 0 ? (
        <p className="text-sm text-gray-500">No recent orders found</p>
      ) : (
        <Row gutter={[16, 16]}>
          {recentOrders.map((order) => {
            const { prefix, label, bgColor } = getOrderDisplay(order);

            return (
              <Col key={order.id} xs={24} sm={12} md={8}>
                <div className="rounded-2xl bg-[#C6FFCE]">
                  <div className="flex items-center gap-3 p-4">
                    {/* Badge: PK / DL / T4 */}
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: bgColor }}
                    >
                      {prefix}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 text-green-900">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">{order.order_number}</span>

                        <Tag className="!rounded-md !border-none !bg-white/50 px-2 py-1 text-[11px] font-medium text-green-900 capitalize">
                          {order.status}
                        </Tag>
                      </div>

                      <p className="mt-0.5 text-sm text-green-700">
                        {label} • {order.items?.length || 0} Items
                      </p>
                    </div>

                    <ArrowRightOutlined className="text-green-900" />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default RecentOrders;
