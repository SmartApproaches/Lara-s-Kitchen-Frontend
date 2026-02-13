import React from "react";
import { Button } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons/core-free-icons";
import { IMAGES } from "../../../../../constants";
import { formatPhone } from "../../../../../utils/formatPhone";
import { formattedDate } from "../../../../../utils/formateDate";
import { formattedTime } from "../../../../../utils/formatTime";
const ReceiptPreview = ({ order }) => {
  console.log("order", order);
  const orderItems = order?.items || [];

  // Get values from order data
  const subtotal = Number(order?.total_amount || 0);
  const deliveryFee = Number(order?.delivery_fee || 0);
  const discountAmount = Number(order?.discount_amount || 0);
  const discountPercentage = Number(order?.discount_percentage || 0);
  const grandTotal = Number(order?.grand_total || 0);
  const customerInfo = order?.customer || order?.guest;

  const handlePrintReceipt = () => {
    const printContents = document.getElementById("receipt-content").innerHTML;
    const printWindow = window.open("", "", "width=600,height=800");

    printWindow.document.write(`
<html>
  <head>
    <title>&nbsp;</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
      @page {
        size: auto;
        margin: 10mm;
      }

      body {
        font-family: sans-serif;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        text-align: center;
      }

      /* Ensures the receipt is centered on printed page */
      #print-wrapper {
        width: 100%;
        max-width: 350px; /* thermal printer size */
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div id="print-wrapper">
      ${printContents}
    </div>
  </body>
</html>

  `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for Tailwind to load to avoid blank page
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

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
          <span className="font-medium">Order ID</span>
          <span>{order?.orderId || order?.order_number}</span>
        </div>
        {order?.orderType === "dine_in" && (
          <div className="flex justify-between">
            <span className="font-medium">Table No.</span>
            <span>{order?.table || "-"}</span>
          </div>
        )}

        {order?.orderType !== "dine_in" && (
          <>
            <div className="mt-2 border-t border-dashed border-gray-300 pt-1" />
            <div className="flex justify-between">
              <div className="flex flex-col justify-between">
                <span className="font-medium">Name</span>
                <span>{customerInfo?.name}</span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="font-medium">Phone Number</span>
                <span>{formatPhone(customerInfo?.phone)}</span>
              </div>
            </div>
            <div className="mt-2 flex flex-col justify-between border-t border-dashed border-gray-300 pt-1">
              <span className="font-medium">Address</span>
              <span>{customerInfo?.address?.formatted_address}</span>
            </div>
          </>
        )}

        <div className="mt-2 flex justify-between border-t border-dashed border-gray-300 pt-1">
          <div className="flex flex-col justify-between">
            <span className="font-medium">Date</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex flex-col justify-between">
            <span className="font-medium">Time</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="mt-2 border-t border-dashed border-gray-300 pt-1" />
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

        {order?.note && (
          <div className="py-0.5 text-[13px]">
            <div className="text-[11px] text-gray-500">
              <span className="font-medium">Note:</span> {order?.note}
            </div>
          </div>
        )}

        <div className="my-2 border-t border-dotted border-gray-300" />

        {/* Subtotal (total_amount from order) */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fee (delivery_fee from order) */}
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>£{deliveryFee.toFixed(2)}</span>
        </div>

        {/* Discount (discount_amount and discount_percentage from order) */}
        <div className="flex justify-between text-green-600">
          <span>Discount ({discountPercentage.toFixed(0)}%)</span>
          <span>-£{discountAmount.toFixed(2)}</span>
        </div>

        <div className="my-2 border-t border-dotted border-gray-300" />

        {/* Grand Total (grand_total from order) */}
        <div className="flex justify-between text-base font-semibold">
          <span>Grand Total</span>
          <span>£{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-5">
        <Button
          type="primary"
          icon={<HugeiconsIcon icon={PrinterIcon} className="h-4 w-4" />}
          className="h-10 w-full rounded-lg !bg-[#164D2F] text-white hover:bg-[#1c5e3a]"
          onClick={handlePrintReceipt}
        >
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default ReceiptPreview;
