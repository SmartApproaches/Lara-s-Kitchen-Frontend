import React from "react";
import { List, Tag, Card } from "antd";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

const RecentOrders = ({ data }) => {
  const orders = data || [
    {
      id: 1,
      name: "Abula",
      price: "£12.00",
      date: "06 Aug 2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "Semo",
      price: "£12.00",
      date: "06 Aug 2025",
      status: "Complete",
    },
  ];

  return (
    <Card
      title="Recent Orders"
      extra={
        <div className="flex items-center gap-2">
          <button>
            <ArrowLeft01Icon size={18} className="text-gray-500" />
          </button>
          <button>
            <ArrowRight01Icon size={18} className="text-gray-500" />
          </button>
        </div>
      }
      className="rounded-xl shadow-sm border border-gray-100"
    >
      <List
        dataSource={orders}
        renderItem={(item) => (
          <List.Item className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/api/placeholder/40/40"
                alt={item.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm font-bold text-green-600">{item.price}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{item.date}</p>
              <Tag
                style={{ borderRadius: "12px" }}
                color={item.status === "Complete" ? "green" : "orange"}
                className="px-2 py-0.5 text-xs"
              >
                {item.status}
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentOrders;
