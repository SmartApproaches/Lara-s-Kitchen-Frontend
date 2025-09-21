import React, { useState } from "react";
import {
  Cancel01Icon,
  ArrowUp01Icon,
  PrinterIcon,
  Delete02Icon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { IMAGES } from "../../../../../constants";

const steps = ["Order received", "In Kitchen", "Order ready", "Paid", "Received"];

const OrderSidePanel = ({ order, onClose }) => {
  const [isCustomerInfoExpanded, setIsCustomerInfoExpanded] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("Send");
  const [activeStep, setActiveStep] = useState(1); // default: "In Kitchen"

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const customerData = {
    name: "Lola Toriola",
    phone: "+44 20 7123 4567",
    table: order?.orderType,
  };

  const orderItems = [
    {
      name: "Abula",
      description: "Rice stew and beans with sauce",
      price: 12.5,
      image: IMAGES.abula,
    },
    {
      name: "Efo Riro",
      description: "Vegetable soup with assorted meat",
      price: 15.0,
      image: IMAGES.abula,
    },
    {
      name: "Jollof Rice",
      description: "Spicy rice dish with chicken",
      price: 10.0,
      image: IMAGES.abula,
    },
    {
      name: "Pounded Yam",
      description: "Starchy side dish, perfect with soup",
      price: 8.0,
      image: IMAGES.abula,
    },
  ];

  const subtotal = order?.price - 1;
  const total = order?.price;

  return (
    <div className="fixed inset-0 z-50 flex h-fit justify-end" onClick={handleOverlayClick}>
      {/* Side Panel */}
      <div className="animate-in slide-in-from-right flex h-full w-80 flex-col bg-white px-4 shadow-2xl duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-16">
            <h2 className="text-lg font-semibold text-gray-900">{order?.orderId}</h2>
            <div className="flex gap-1">
              <button className="rounded p-1 hover:bg-gray-100">
                <Delete02Icon className="h-4 w-4 text-gray-400" />
              </button>
              <button className="rounded p-1 hover:bg-gray-100">
                <PencilEdit02Icon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Cancel01Icon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Customer Information */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setIsCustomerInfoExpanded(!isCustomerInfoExpanded)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
          >
            <span className="font-medium text-gray-900">Customer Information</span>
            <ArrowUp01Icon
              className={`h-5 w-5 text-gray-500 transition-transform ${isCustomerInfoExpanded ? "" : "rotate-180"}`}
            />
          </button>

          {isCustomerInfoExpanded && (
            <div className="space-y-5 px-4 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium text-gray-900">{customerData.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone Number</span>
                <span className="text-sm font-medium text-gray-900">{customerData.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Table Number</span>
                <span className="text-sm font-medium text-gray-900">{customerData.table}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex overflow-hidden rounded-2xl bg-[#C6FFCE]">
          {["Send", "Pickup", "Delivery"].map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                selectedMethod === method
                  ? "bg-green-500 text-white"
                  : "bg-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="mt-5 overflow-y-auto">
          {orderItems.map((item, index) => (
            <div key={index} className={`${index < orderItems.length - 1 ? "mb-3" : ""}`}>
              <div className="flex items-center gap-3 rounded-md border px-4 py-2 transition-colors hover:bg-gray-50">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <img src={item.image} alt="" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 text-lg font-bold text-[#1F5226]">{item.name}</h4>
                  <p className="line-clamp-2 text-[11px] text-gray-500">{item.description}</p>
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-[#00BC1A]">
                      £{item.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-[#00BC1A]">
                      £{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 space-y-3 rounded-md bg-[#EEEEEE] px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#444444]">Sub Total</span>
            <span className="text-[13px] font-medium text-[#444444]">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-[#232323] pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-gray-900">Total</span>
              <span className="text-[13px] font-bold text-gray-900">£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-4 px-2 py-4">
          <div className="flex items-center overflow-hidden rounded-full bg-gray-100 shadow-inner">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 py-2 text-center text-[8px] font-medium ${
                  index === activeStep
                    ? "bg-green-500 text-white"
                    : index < activeStep
                      ? "bg-green-200 text-gray-700"
                      : "bg-transparent text-gray-500"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Bottom */}
        <div className="space-y-3 p-4">
          <div className="flex gap-2">
            <button className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <PrinterIcon className="h-5 w-5" />
              <span className="hidden text-black sm:inline">Print receipt</span>
            </button>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F5226] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700">
            <span className="font-medium">Make Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSidePanel;
