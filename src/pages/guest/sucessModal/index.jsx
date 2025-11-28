import { Modal } from "antd";
import React from "react";
import { IMAGES } from "../../../constants";

const SuccessModal = ({ orderSuccess, setOrderSuccess }) => {
  return (
    <Modal
      open={!!orderSuccess}
      footer={null}
      onCancel={() => setOrderSuccess(null)}
      centered
      width="95%"
      style={{ maxWidth: "400px" }}
      bodyStyle={{ padding: "32px", borderRadius: "24px", textAlign: "center" }}
    >
      {orderSuccess && (
        <div className="flex flex-col items-center">
          <img src={IMAGES.sucessImage} alt="sucessImage" />

          <h2 className="mb-2 text-2xl font-bold text-[#1F5226]">Order Placed</h2>
          <p className="mb-6 text-sm text-gray-600">
            Your order has been received, you will soon be served
          </p>

          <div className="w-full space-y-3 rounded-xl bg-gray-50 p-4 text-left">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600">Table Number:</span>
              <span className="text-sm font-bold text-[#1F5226]">{orderSuccess.table_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Order Number:</span>
              <span className="text-sm font-bold text-[#1F5226]">{orderSuccess.order_number}</span>
            </div>
          </div>

          <button
            onClick={() => setOrderSuccess(null)}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#1F5226] to-[#2E6B38] py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            Continue Ordering
          </button>
        </div>
      )}
    </Modal>
  );
};

export default SuccessModal;
