import React from "react";
import { Table, Tag, Button } from "antd";
import { PrinterIcon, Delete02Icon } from "hugeicons-react";

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
    render: (text) => <span className="text-sm font-bold text-[#222222]">{text}</span>,
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customer",
    render: (text) => <span className="text-sm font-bold text-[#222222]">{text}</span>,
  },
  {
    title: "ORDER SUMMARY",
    dataIndex: "items",
    render: (items, record) => (
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 2).map((item, i) => (
          <Tag
            key={i}
            className="rounded-md !border-none !bg-gray-100 px-2 py-1 font-bold text-[#222222]"
          >
            {item}
          </Tag>
        ))}
        <Tag className="rounded-md !border-none !bg-gray-100 px-2 py-1 font-bold text-[#222222]">
          +{record.extra} items
        </Tag>
      </div>
    ),
  },
  {
    title: "PRICE",
    dataIndex: "price",
    render: (text) => <span className="text-sm font-bold text-[#222222]">{text}</span>,
  },
  {
    title: "PAYMENT METHOD",
    dataIndex: "method",
    render: (text) => <span className="text-sm font-bold text-[#222222]">{text}</span>,
  },
  {
    title: "PAYMENT STATUS",
    dataIndex: "status",
    render: (status) => (
      <Tag
        className={`rounded-md !border-none px-3 py-1 ${
          status === "Successful" ? "!bg-green-100 text-green-700" : "!bg-red-100 text-red-700"
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
        <Button icon={<PrinterIcon />} type="text" />
        <Button icon={<Delete02Icon />} danger type="text" />
      </div>
    ),
  },
];

const TransactionTable = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        className="custom-table"
      />
    </div>
  );
};

export default TransactionTable;
