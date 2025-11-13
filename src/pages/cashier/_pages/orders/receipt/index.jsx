import React from "react";
import { Button } from "antd";
import { PrinterIcon } from "hugeicons-react";
import { IMAGES } from "../../../../../constants";
const ReceiptPreview = ({ order, onPrint }) => {
  const orderItems = order?.items || [];
  const subtotal = orderItems.reduce((sum, i) => sum + Number(i.subtotal || 0), 0);
  const total = subtotal;
  const change = total * 0.2; // example change logic — adjust as needed

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      id="receipt-content"
      className="mx-auto rounded-lg bg-white p-4 text-center print:w-full print:shadow-none"
    >
      {/* Logo */}
      <div className="flex justify-center">
        <img src={IMAGES.logo} alt="logo" className="h-16 object-contain" />
      </div>

      {/* Title */}
      <h2 className="my-2 text-lg font-[600] tracking-wide">*****Receipt*****</h2>

      {/* Info Section */}
      <div className="mb-3 text-left text-xs">
        <div className="flex justify-between">
          <span className="font-medium">Date</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Time</span>
          <span>{formattedTime}</span>
        </div>

        <div className="mt-2 border-t border-dotted border-gray-300 pt-1" />
        <div className="flex justify-between">
          <span className="font-medium">Order ID</span>
          <span>{order?.orderId || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Table No.</span>
          <span>{order?.table || "Table 4"}</span>
        </div>
        <div className="mt-2 border-t border-dotted border-gray-300 pt-1" />
      </div>

      {/* Items */}
      <div className="text-left text-sm">
        <div className="mb-1 flex justify-between font-semibold">
          <span>Description</span>
          <span>Price</span>
        </div>

        {orderItems.map((item, idx) => (
          <div key={idx} className="flex justify-between py-0.5 text-[13px]">
            <span>
              {item.menu_item?.name} ×{item.quantity}
            </span>
            <span>£{Number(item.subtotal).toFixed(2)}</span>
          </div>
        ))}

        <div className="my-2 border-t border-dotted border-gray-300" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Change</span>
          <span>£{change.toFixed(2)}</span>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-5">
        <Button
          type="primary"
          icon={<PrinterIcon className="h-4 w-4" />}
          className="h-10 w-full rounded-lg !bg-[#164D2F] text-white hover:bg-[#1c5e3a]"
          onClick={onPrint}
        >
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default ReceiptPreview;
