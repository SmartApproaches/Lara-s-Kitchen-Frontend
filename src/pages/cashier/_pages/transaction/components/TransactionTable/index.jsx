import React, { useState, useMemo } from "react";
import { Table, Tag, Button, Skeleton, Space } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PrinterIcon } from "@hugeicons/core-free-icons";
import { useGetCashierTransactionsQuery } from "../../../../../../redux/slices/cashier/transactionApiSlice";

const TransactionTable = () => {
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    data: transactionData,
    isLoading,
    isError,
  } = useGetCashierTransactionsQuery(
    { page },
    {
      pollingInterval: 3000,
      skipPollingIfUnfocused: true,
    },
  );

  // Format price to £
  const formatPrice = (price) =>
    `£${Number(price || 0).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Prepare table data
  const tableData = useMemo(() => {
    if (!transactionData?.data?.data) return [];
    return transactionData.data.data.map((tx) => {
      const customerName = tx.customer?.name || tx.guest?.name || "Unknown";
      const items = tx.items?.map((i) => i.menu_item?.name) || [];
      const extraCount = items.length > 2 ? items.length - 2 : 0;

      return {
        key: tx.id,
        orderNumber: tx.order_number,
        customer: customerName,
        items,
        extra: extraCount,
        price: formatPrice(tx.total_amount),
        method: tx.payment_method,
        status:
          tx.payment_status === "paid" || tx.payment_status === "success"
            ? "Successful"
            : tx.payment_status === "pending"
              ? "Pending"
              : "Failed",
      };
    });
  }, [transactionData]);

  // Print selected rows
  const handlePrint = () => {
    if (selectedRowKeys.length === 0) {
      alert("Please select at least one transaction to print.");
      return;
    }
    const selectedData = tableData.filter((row) => selectedRowKeys.includes(row.key));
    const printContent = selectedData
      .map(
        (row) =>
          `
        <div style="margin-bottom: 20px;">
          <h3>Order Number: ${row.orderNumber}</h3>
          <p><strong>Customer:</strong> ${row.customer}</p>
          <p><strong>Price:</strong> ${row.price}</p>
          <p><strong>Payment Method:</strong> ${row.method}</p>
          <p><strong>Status:</strong> ${row.status}</p>
          <hr />
        </div>
      `,
      )
      .join("");

    const newWin = window.open("", "_blank");
    newWin.document.write(
      `<html><head><title>Print Transactions</title></head><body>${printContent}</body></html>`,
    );
    newWin.document.close();
    newWin.print();
  };

  const columns = [
    {
      title: "",
      dataIndex: "select",
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
          {record.extra > 0 && (
            <Tag className="rounded-md !border-none !bg-gray-100 px-2 py-1 font-bold text-[#222222]">
              +{record.extra} more
            </Tag>
          )}
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
      render: (text) => (
        <span className="text-sm font-bold text-[#222222] capitalize">{text || "—"}</span>
      ),
    },
    {
      title: "PAYMENT STATUS",
      dataIndex: "status",
      render: (status) => {
        const colorClass =
          status === "Successful"
            ? "!bg-green-100 text-green-700"
            : status === "Pending"
              ? "!bg-yellow-100 text-yellow-700"
              : "!bg-red-100 text-red-700";
        return <Tag className={`rounded-md !border-none px-3 py-1 ${colorClass}`}>{status}</Tag>;
      },
    },
    {
      title: "ACTION",
      render: (_, record) => (
        <div className="flex gap-3">
          <Button
            icon={<HugeiconsIcon icon={PrinterIcon} size={20} className="text-gray-400" />}
            type="text"
            onClick={() => {
              const newWin = window.open("", "_blank");
              newWin.document.write(`
                <html><head><title>Print Transaction</title></head><body>
                <h3>Order Number: ${record.orderNumber}</h3>
                <p><strong>Customer:</strong> ${record.customer}</p>
                <p><strong>Price:</strong> ${record.price}</p>
                <p><strong>Payment Method:</strong> ${record.method}</p>
                <p><strong>Status:</strong> ${record.status}</p>
                </body></html>
              `);
              newWin.document.close();
              newWin.print();
            }}
          />
          <Button icon={<HugeiconsIcon icon={Delete02Icon} size={20} className="text-red-500" />} danger type="text" />
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  if (isLoading)
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );

  if (isError)
    return (
      <div className="rounded-lg bg-white p-4 text-center font-semibold text-red-500 shadow">
        Failed to fetch transactions. Please try again later.
      </div>
    );

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: transactionData?.data?.current_page || 1,
          total: transactionData?.data?.total || 0,
          pageSize: transactionData?.data?.per_page || 12,
          onChange: (p) => setPage(p),
          position: ["bottomCenter"], // ✅ Centers the pagination
        }}
        rowKey="key"
      />
    </div>
  );
};

export default TransactionTable;
