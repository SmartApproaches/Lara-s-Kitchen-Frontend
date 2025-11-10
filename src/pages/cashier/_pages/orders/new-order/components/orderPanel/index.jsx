import React, { useState } from "react";
import { Drawer, Button, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ArrowUp01Icon, Cancel01Icon } from "hugeicons-react";
const OrderPanel = ({ drawerOpen, cartItemsArray, subTotal, setCart }) => {
  const [collapseInfo, setCollapseInfo] = useState(true);
  const [orderType, setOrderType] = useState("Eat-In");

  const tabs = [
    { key: "Eat-In", label: "Eat-In" },
    { key: "Pickup", label: "Pickup" },
    { key: "Delivery", label: "Delivery" },
  ];
  const handleDeleteItem = (item) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[item.id];
      return newCart;
    });
  };
  return (
    <Drawer
      placement="right"
      open={drawerOpen}
      width={420}
      mask={false}
      closable={false}
      bodyStyle={{
        background: "#FFFFFF",
        padding: 0,
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-lg font-semibold text-[#0A3A1A]">N2345678</p>
          <p className="text-sm text-gray-500">Michael Nile</p>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={<DeleteOutlined />} danger type="text" onClick={handleDeleteItem} />
          <button
            className="text-2xl text-[#0A3A1A] hover:opacity-60"
            onClick={() => setCart({})} // closes panel by clearing cart
          >
            <Cancel01Icon />
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <button
          className="flex w-full items-center justify-between"
          onClick={() => setCollapseInfo(!collapseInfo)}
        >
          <span className="font-semibold text-[#0A3A1A]">Customer Information</span>
          <ArrowUp01Icon className={`${collapseInfo ? "rotate-180" : ""}`} />
        </button>

        {collapseInfo && (
          <div className="mt-3 space-y-3">
            <div>
              <p className="mb-1 text-sm text-gray-500">Name:</p>
              <Input defaultValue="Lola Toriola" className="h-9 rounded-md" />
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">Phone Number:</p>
              <Input defaultValue="+44 20 7823 4567" className="h-9 rounded-md" />
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">Table Number:</p>
              <Input defaultValue="Table 1" className="h-9 rounded-md" />
            </div>
          </div>
        )}
      </div>

      {/* ORDER TYPE TABS */}
      <div className="m-4 flex gap-2 rounded-lg bg-[#C6FFCE] p-1">
        {tabs.map((tab) => {
          const isActive = orderType === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setOrderType(tab.key)}
              className={`flex-1 rounded-md py-2 font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#00BC1A] text-white shadow-sm"
                  : "text-[#0A3A1A] hover:bg-[#9BFFAA]/60"
              } `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ORDER ITEMS */}
      <div className="max-h-[38vh] space-y-3 overflow-y-auto px-4">
        {cartItemsArray.map(({ item, qty }) => {
          const itemTotal = Number(item.base_price) * qty;

          return (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border p-3 shadow-sm">
              <img src={item.media?.url} className="h-14 w-14 rounded-md object-cover" />

              <div className="flex-1">
                {/* Full text, no truncation */}
                <p className="text-base leading-tight font-bold text-[#1F5226]">{item.name}</p>

                {/* Expand description to fill card better */}
                <p className="text-sm leading-snug text-gray-700">{item.description}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-[#00BC1A]">
                      £{Number(item.base_price).toFixed(2)}
                    </p>
                    <span className="text-[#979797]">{qty}×</span>
                  </div>

                  {/* Each item has its own computed total */}
                  <span className="text-sm font-semibold text-[#00BC1A]">
                    £{itemTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ORDER SUMMARY */}
      <div className="mx-4 mt-4 rounded-lg bg-[#F4F4F4] px-4 py-5">
        <div className="mb-1 flex justify-between text-sm font-medium">
          <span>Sub Total</span>
          <span>£{subTotal.toFixed(2)}</span>
        </div>
        <div className="border border-dashed" />
        <div className="mt-2 flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>£{subTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-3 p-4">
        <Button block size="large" className="rounded-md !bg-[#0F5821] !text-white">
          Place Order
        </Button>

        <Button block size="large" className="rounded-md border bg-white">
          Print receipt
        </Button>
      </div>
    </Drawer>
  );
};

export default OrderPanel;
