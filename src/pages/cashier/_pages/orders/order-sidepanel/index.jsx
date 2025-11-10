import React, { useState } from "react";
import {
  Cancel01Icon,
  ArrowUp01Icon,
  PrinterIcon,
  Delete02Icon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { Drawer, Button } from "antd";
import { useNavigate } from "react-router-dom";

const orderSteps = ["Order received", "In Kitchen", "Order ready", "Paid", "Received"];

const OrderSidePanel = ({ order, onClose }) => {
  const navigate = useNavigate();
  const [isCustomerInfoExpanded, setIsCustomerInfoExpanded] = useState(true);

  const orderItems = order?.items || [];
  console.log("order", order);
  const customerData = {
    name: order?.customer?.name || "-",
    phone: order?.customer?.phone || "-",
    email: order?.customer?.email || "-",
  };
  const tabs = [
    { key: "Dine-In", label: "Dine-In", apiValue: "dine_in" },
    { key: "Pickup", label: "Pickup", apiValue: "pickup" },
    { key: "Delivery", label: "Delivery", apiValue: "delivery" },
  ];
  const subtotal = orderItems.reduce((sum, i) => sum + Number(i.subtotal || 0), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleEdit = () => {
    onClose();
    navigate(`/cashier/edit-order/${order?.id}`);
  };

  return (
    <Drawer
      title={null}
      placement="right"
      width={380}
      open={!!order}
      onClose={onClose}
      className="order-drawer !p-0"
    >
      {/* HEADER */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-[#2D8A4E]">{order?.orderId || "N2345678"}</p>
            <p className="text-sm text-gray-400">{order?.customer?.name || "-"}</p>
          </div>
          <div className="flex gap-2">
            <Button
              icon={<PencilEdit02Icon className="h-4 w-4" />}
              onClick={handleEdit}
              size="small"
            />
            <Button danger icon={<Delete02Icon className="h-4 w-4" />} size="small" />
          </div>
        </div>
      </div>

      {/* CUSTOMER INFO */}
      <div className="mt-3 px-4">
        <button
          onClick={() => setIsCustomerInfoExpanded(!isCustomerInfoExpanded)}
          className="flex w-full items-center justify-between rounded-md border bg-gray-50 px-3 py-2 text-sm font-medium"
        >
          <span>Customer Information</span>
          <ArrowUp01Icon
            className={`h-4 w-4 transition-transform ${isCustomerInfoExpanded ? "" : "rotate-180"}`}
          />
        </button>

        {isCustomerInfoExpanded && (
          <div className="mt-2 rounded-md p-3 text-sm">
            <div className="mb-1 flex justify-between">
              <span>Name:</span>
              <span className="font-semibold">{customerData.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number:</span>
              <span className="font-semibold">{customerData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-semibold">{customerData.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* ORDER TYPE BUTTONS */}
      <div className="m-4 flex gap-2 rounded-lg bg-[#C6FFCE] p-1">
        {tabs.map(({ key, label, apiValue }) => (
          <button
            key={key}
            className={`flex-1 rounded-md py-2 font-semibold transition-all duration-200 ${
              order?.orderType === apiValue
                ? "bg-[#00BC1A] text-white shadow-sm"
                : "text-[#0A3A1A] hover:bg-[#9BFFAA]/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ITEMS LIST */}
      <div className="mt-4 space-y-3 overflow-y-auto px-4">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  item?.menu_item?.media?.url ||
                  order?.images?.[index] ||
                  "https://via.placeholder.com/40"
                }
                alt=""
                className="h-12 w-12 rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#2D8A4E]">{item.menu_item?.name}</p>
                <p className="text-[11px] text-gray-500">{item.menu_item?.description}</p>
                <p className="text-sm font-semibold text-[#00BC1A]">
                  £{Number(item.price).toFixed(2)}{" "}
                  <span className="text-xs text-gray-500">{item?.quantity}x</span>
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#00BC1A]">
              £{Number(item.subtotal || item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* TOTAL SECTION */}
      <div className="mx-4 mt-5 rounded-xl bg-gray-100 p-4 text-sm">
        <div className="mb-2 flex justify-between">
          <span>Sub Total</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span>Tax 5%</span>
          <span>£{tax.toFixed(2)}</span>
        </div>
        <hr className="my-2 border-dotted border-gray-400" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>

      {/* ORDER STATUS TRACKER */}
      {/* <div className="mt-5 flex items-center justify-between px-4 text-xs">
        {orderSteps.map((step, i) => {
          const current = orderSteps.indexOf(order?.status || "In Kitchen");
          const active = i <= current;
          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div
                className={`h-5 w-5 rounded-full border ${
                  active ? "border-[#3ADF60] bg-[#3ADF60]" : "border-gray-300"
                }`}
              ></div>
              <span className={`mt-1 ${active ? "text-[#3ADF60]" : "text-gray-400"}`}>{step}</span>
            </div>
          );
        })}
      </div> */}

      {/* PRINT RECEIPT */}
      <div className="mt-6 px-4">
        <Button
          icon={<PrinterIcon className="h-4 w-4" />}
          block
          className="border border-gray-300 py-2 text-sm hover:bg-gray-50"
        >
          Print Receipt
        </Button>
      </div>
    </Drawer>
  );
};

export default OrderSidePanel;
