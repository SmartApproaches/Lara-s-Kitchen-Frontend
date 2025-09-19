import React from "react";
import { Tag, Row, Col } from "antd";

const orders = [
  {
    id: "N2345678",
    type: "Dine in",
    items: 5,
    table: "T1",
    status: "Pending",
    destination: "Kitchen",
  },
  {
    id: "N2345678",
    type: "Online",
    items: 5,
    table: "ON",
    status: "Pending",
    destination: "Delivery",
  },
  {
    id: "N2345678",
    type: "Dine in",
    items: 5,
    table: "T1",
    status: "Pending",
    destination: "Ready",
  },
];

const RecentOrders = () => {
  return (
    <div className="rounded-2xl bg-[#DAFFDF] p-6">
      <h3 className="mb-5 text-lg font-medium text-gray-500">Recent Orders</h3>

      <Row gutter={[16, 16]}>
        {orders.map((order, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <div className="rounded-xl bg-[#C6FFCE] py-4">
              <div className="flex items-center gap-3 px-4">
                {/* Table / Order type circle */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFB800] text-sm font-bold">
                  {order.table}
                </div>

                {/* Order info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="mb-1 text-base font-bold text-[#1F5226]">{order.id}</div>
                    <Tag className="!rounded-md !border-none !bg-[#FFF5E6] px-2 py-1 text-xs">
                      {order.status}
                    </Tag>
                  </div>
                  <div className="text-[13px] text-[#1F5226]">
                    {order.type} • {order.items} Items →
                    <span className="ml-2 rounded-md bg-[#CFF5D9] px-2 py-0.5 text-xs">
                      {order.destination}
                    </span>
                  </div>
                </div>

                {/* Status */}
                {/* <Tag className="!rounded-md !border-none !bg-[#FFF5E6] px-2 py-1 text-xs">
                  {order.status}
                </Tag> */}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecentOrders;
