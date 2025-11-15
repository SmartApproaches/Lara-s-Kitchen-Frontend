import { useState, useImperativeHandle, forwardRef } from "react";
import { Table, Tag, Skeleton, Alert } from "antd";
import { ArrowLeft01Icon, ArrowRight01Icon, Download01Icon } from "hugeicons-react";

import { useCSVExport } from "../../../../../hooks/useCSVExport";
import { IMAGES } from "../../../../../constants";
import { Button } from "../../../../../components";
import { customInfoToast } from "../../../../../utils/toast";

const OrdersTable = forwardRef(
  ({ orders, isLoading, isError, pagination, currentPage, onPageChange }, ref) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const { exportToCSV } = useCSVExport();

    const flattenOrderData = (orders) => {
      return orders.map((order) => ({
        order_number: order?.order_number || "N/A",
        customer_name: order?.customer_name || "N/A",
        order_type: order?.order?.order_type || "N/A",
        items: order?.category?.map((item) => item?.menu_item?.name).join(", ") || "N/A",
        grand_total: `₦${parseFloat(order?.order?.grand_total || 0).toFixed(2)}`,
        order_date: new Date(order?.order?.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        payment_status: order?.order?.payment_status || "N/A",
        status: order?.order?.status || "N/A",
      }));
    };

    useImperativeHandle(
      ref,
      () => ({
        exportAll: () => {
          if (orders && orders.length > 0) {
            const flattenedData = flattenOrderData(orders);
            exportToCSV(flattenedData, `all_orders_${new Date().toISOString().split("T")[0]}.csv`);
          }
        },
      }),
      [orders, exportToCSV],
    );

    const handleExportSelected = () => {
      if (selectedRowKeys.length === 0) {
        customInfoToast("Please select at least one row to export");
        return;
      }

      const selectedRows = orders.filter((order) => selectedRowKeys.includes(order?.id));
      const flattenedData = flattenOrderData(selectedRows);
      exportToCSV(flattenedData, `selected_orders_${new Date().toISOString().split("T")[0]}.csv`);
    };

    const columns = [
      {
        title: "Order Number",
        dataIndex: "order_number",
        className: "font-medium",
        render: (order_number, record) => {
          const hasSpecialOffer = record?.category?.some(
            (cat) => cat?.menu_item?.menu_type?.toLowerCase() === "special",
          );

          return (
            <div className="flex flex-col">
              <span>{order_number}</span>
              {hasSpecialOffer && (
                <Tag
                  color="green"
                  style={{
                    marginTop: "4px",
                    width: "fit-content",
                    borderRadius: "18px",
                    fontWeight: 500,
                    fontSize: "14px",
                    padding: "2px 12px",
                  }}
                >
                  Special Offer
                </Tag>
              )}
            </div>
          );
        },
      },
      {
        title: "Customer",
        dataIndex: "customer_name",
        className: "font-medium",
      },
      {
        title: "Category",
        dataIndex: "order",
        className: ["font-medium", "capitalize"],
        render: (_, record) => {
          return record?.order?.order_type || "N/A";
        },
      },
      {
        title: "Order",
        dataIndex: "category",
        className: "font-medium",
        render: (category, record) => {
          if (!category || category.length === 0) return "N/A";

          const firstItem = category[0];
          const remainingItems = category.slice(1);

          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={firstItem?.menu_item?.media?.url || "/api/placeholder/40/40"}
                  alt={firstItem?.menu_item?.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{firstItem?.menu_item?.name}</p>
                </div>
              </div>

              {remainingItems.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {remainingItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <p className="text-base text-gray-700">
                        {item?.menu_item?.name}
                        {remainingItems.length - 1 > idx && ", "}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Price",
        dataIndex: "order",
        className: "font-medium",
        render: (order) => {
          return `₦${parseFloat(order?.grand_total || 0).toFixed(2)}`;
        },
      },
      {
        title: "Date",
        dataIndex: "order",
        className: "font-medium",
        render: (order) => {
          return new Date(order?.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        },
      },
      {
        title: "Payment",
        dataIndex: "order",
        render: (order) => {
          const status = order?.payment_status;
          return (
            <Tag
              style={{
                borderRadius: "11px",
                fontSize: "15px",
                padding: "4px 13px",
              }}
              color={status === "paid" ? "green" : "red"}
            >
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Tag>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "order",
        render: (order) => {
          const status = order?.status;
          const colors = {
            pending: "orange",
            delivered: "green",
            cancelled: "red",
            processing: "blue",
          };
          return (
            <Tag
              style={{
                borderRadius: "11px",
                fontSize: "15px",
                padding: "4px 13px",
              }}
              color={colors[status?.toLowerCase()] || "gray"}
            >
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Tag>
          );
        },
      },
      {
        title: "Reviews",
        dataIndex: "order",
        render: (order) => {
          const reviews = order?.reviews || [];
          if (reviews.length === 0) return "No Reviews";

          return (
            <div className="flex flex-col gap-1">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <p className="text-base text-gray-700">{review?.comment}</p>
                </div>
              ))}
            </div>
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
      },
      getCheckboxProps: (record) => ({
        name: record.id,
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
          {!orders || orders?.length === 0 ? (
            <div className="col-span-3 mb-10 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C] md:mt-14">
              <img src={IMAGES.emptyState} alt="No Orders" className="h-40 w-40" />
              <h3 className="text-xl font-semibold md:text-2xl">No Orders Found</h3>
              <p>Orders will appear here once they are placed</p>
            </div>
          ) : (
            <Table
              loading={isLoading}
              dataSource={orders}
              columns={columns}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={false}
              className="custom-table min-w-[1500px]"
            />
          )}
        </div>

        {orders && orders?.length > 0 && pagination && (
          <div className="mt-4 flex items-center justify-between font-semibold text-gray-600">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
            >
              <ArrowLeft01Icon strokeWidth={2} size={20} />
            </button>
            <span className="text-base">
              Page {currentPage} of {pagination?.last_page || 1}
            </span>
            <button
              disabled={currentPage === pagination?.last_page || isLoading}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
            >
              <ArrowRight01Icon strokeWidth={2} size={20} />
            </button>
          </div>
        )}
      </div>
    );
  },
);

export default OrdersTable;
