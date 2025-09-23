import React from "react";
import { Table, Tag, Button } from "antd";
import { PrinterOutlined, DeleteOutlined } from "@ant-design/icons";

// Sample data
const data = [
  {
    key: "1",
    orderNumber: "NG2543678",
    customer: "Ken Mike",
    items: ["Amala", "Coke", "Fanta"],
    extra: 2,
    price: "£12.00",
    method: "Card",
    status: "Failed",
  },
  {
    key: "2",
    orderNumber: "NG2543678",
    customer: "Joy Atoyebi",
    items: ["Amala", "Coke", "Fanta"],
    extra: 2,
    price: "£12.00",
    method: "Cash",
    status: "Successful",
  },
  {
    key: "3",
    orderNumber: "NG2543678",
    customer: "Jessica Ade",
    items: ["Amala", "Coke", "Fanta"],
    extra: 2,
    price: "£12.00",
    method: "Transfer",
    status: "Failed",
  },
];

// Define columns
const columns = [
  {
    title: "",
    dataIndex: "select",
    render: () => <input type="checkbox" className="h-4 w-4" />,
    width: 40,
  },
  {
    title: "ORDER NUMBER",
    dataIndex: "orderNumber",
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customer",
  },
  {
    title: "ORDER SUMMARY",
    dataIndex: "items",
    render: (items, record) => (
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 2).map((item, i) => (
          <Tag key={i} className="text-gray-700">
            {item}
          </Tag>
        ))}
        <Tag className="text-gray-700">+{record.extra} items</Tag>
      </div>
    ),
  },
  {
    title: "PRICE",
    dataIndex: "price",
  },
  {
    title: "PAYMENT METHOD",
    dataIndex: "method",
  },
  {
    title: "PAYMENT STATUS",
    dataIndex: "status",
    render: (status) => (
      <Tag
        className={`rounded px-3 py-1 ${
          status === "Successful"
            ? "border !border-green-300 !bg-green-100 text-green-700"
            : "border !border-red-300 !bg-red-100 text-red-700"
        }`}
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "ACTION",
    render: () => (
      <div className="flex gap-3">
        <Button icon={<PrinterOutlined />} type="text" />
        <Button icon={<DeleteOutlined />} danger type="text" />
      </div>
    ),
  },
];

const TransactionTable = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <Table columns={columns} dataSource={data} pagination={false} rowKey="key" />
    </div>
  );
};

export default TransactionTable;
