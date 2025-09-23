import { useState, useImperativeHandle, forwardRef } from "react";
import { Table, Tag, Skeleton, Alert } from "antd";
import { ArrowLeft01Icon, ArrowRight01Icon, Download01Icon } from "hugeicons-react";

import { useCSVExport } from "../../../../../hooks/useCSVExport";
import { IMAGES } from "../../../../../constants";
import { Button } from "../../../../../components";

const OrdersTable = forwardRef(({ orders, isLoading, isError }, ref) => {
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { exportToCSV } = useCSVExport();
  const pageSize = 5;
  const totalPages = Math.ceil((orders?.length || 0) / pageSize);

  useImperativeHandle(
    ref,
    () => ({
      exportAll: () => {
        if (orders && orders.length > 0) {
          exportToCSV(orders, `all_orders_${new Date().toISOString().split("T")[0]}.csv`);
        }
      },
    }),
    [orders, exportToCSV],
  );

  const handleExportSelected = () => {
    if (selectedRowKeys.length === 0) {
      alert("Please select at least one row to export");
      return;
    }

    const selectedRows = orders.filter((order) => selectedRowKeys.includes(order.orderNo));
    exportToCSV(selectedRows, `selected_orders_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNo",
      className: "font-medium",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      className: "font-medium",
    },
    {
      title: "Category",
      dataIndex: "category",
      className: "font-medium",
    },
    {
      title: "Order",
      dataIndex: "order",
      className: "font-medium",
    },
    {
      title: "Price",
      dataIndex: "price",
      className: "font-medium",
    },
    {
      title: "Date",
      dataIndex: "date",
      className: "font-medium",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      render: (val) => (
        <Tag
          style={{
            borderRadius: "11px",
            fontSize: "15px",
            padding: "4px 13px",
          }}
          color={val === "Success" ? "green" : "red"}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val) => {
        const colors = {
          Pending: "orange",
          Completed: "green",
          Canceled: "red",
        };
        return (
          <Tag
            style={{
              borderRadius: "11px",
              fontSize: "15px",
              padding: "4px 13px",
            }}
            color={colors[val]}
          >
            {val}
          </Tag>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        const currentPageKeys = paginatedData.map((row) => row.orderNo);
        setSelectedRowKeys((prev) => [...new Set([...prev, ...currentPageKeys])]);
      } else {
        const currentPageKeys = paginatedData.map((row) => row.orderNo);
        setSelectedRowKeys((prev) => prev.filter((key) => !currentPageKeys.includes(key)));
      }
    },
    onSelect: (record, selected) => {
      if (selected) {
        setSelectedRowKeys((prev) => [...prev, record.orderNo]);
      } else {
        setSelectedRowKeys((prev) => prev.filter((key) => key !== record.orderNo));
      }
    },
    getCheckboxProps: (record) => ({
      name: record.orderNo,
    }),
  };

  if (isLoading)
    return (
      <div className="mt-10">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );

  if (isError)
    return (
      <div className="mt-10">
        <Alert type="error" message="Failed to load orders" />
      </div>
    );

  const paginatedData = orders?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mt-4 md:text-[18px]">
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 flex gap-3">
          <Button
            variant="primary"
            icon={<Download01Icon size={16} />}
            onClick={handleExportSelected}
            disabled={selectedRowKeys.length === 0}
          >
            Export Selected ({selectedRowKeys.length})
          </Button>
          <Button variant="outline" onClick={() => setSelectedRowKeys([])}>
            Clear Selection
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        {orders?.length < 1 ? (
          <div className="col-span-3 mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Orders" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">No Orders Found</h3>
            <p>Orders will appear here once they are placed</p>
          </div>
        ) : (
          <Table
            dataSource={paginatedData}
            columns={columns}
            rowKey="orderNo"
            rowSelection={rowSelection}
            pagination={false}
            className="custom-table min-w-[1000px]"
          />
        )}
      </div>

      {orders?.length > 0 && (
        <div className="mt-3 flex items-center justify-between font-semibold text-gray-600">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            <ArrowLeft01Icon strokeWidth={2} />
          </button>
          <span>
            {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            <ArrowRight01Icon strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
});

export default OrdersTable;
