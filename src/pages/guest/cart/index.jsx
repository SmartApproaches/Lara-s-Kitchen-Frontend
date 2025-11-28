import { Input, Modal } from "antd";
import React from "react";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import MenuImage from "../components/MenuImage";
const CartModal = ({
  isCartOpen,
  setIsCartOpen,
  cart,
  updateQty,
  removeItem,
  totalPrice,
  tableNumber,
  setTableNumber,
  handlePlaceOrder,
  isPlacingOrder,
}) => {
  return (
    <Modal
      open={isCartOpen}
      footer={null}
      onCancel={() => setIsCartOpen(false)}
      centered
      width="95%"
      style={{ maxWidth: "500px" }}
      bodyStyle={{ background: "#F8FFFA", borderRadius: "20px", padding: "20px" }}
    >
      <h2 className="mb-1 text-xl font-bold text-[#1F5226] sm:text-2xl">Checkout</h2>
      <p className="mb-4 text-xs text-gray-500 sm:text-sm">Review your order</p>

      <div className="max-h-[50vh] space-y-2.5 overflow-y-auto pr-1 sm:max-h-[55vh]">
        {cart?.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm sm:gap-3 sm:p-3"
          >
            <MenuImage
              src={item.media?.url}
              alt={item.name}
              className="h-14 w-14 rounded-lg object-cover sm:h-16 sm:w-16"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1F5226] sm:text-base">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                Size: {item.selectedSize} • £{item.base_price} each
              </p>

              <p className="text-xs text-gray-500 sm:text-sm">£{item.base_price} each</p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 active:scale-95"
              >
                <MinusOutlined className="text-xs" />
              </button>
              <span className="w-6 text-center text-sm font-semibold sm:w-7">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 active:scale-95"
              >
                <PlusOutlined className="text-xs" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 active:scale-95"
              >
                <DeleteOutlined className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-[#1F5226]">£{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-semibold text-[#1F5226] sm:text-sm">
          Table Number *
        </label>
        <Input
          placeholder="Enter table number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="h-11 rounded-xl border-2 border-[#1F5226]/20 transition focus:border-[#1F5226]"
          size="large"
        />
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#1F5226] to-[#2E6B38] py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPlacingOrder ? "Placing Order..." : `Place Order • £${totalPrice.toFixed(2)}`}
      </button>
    </Modal>
  );
};

export default CartModal;
