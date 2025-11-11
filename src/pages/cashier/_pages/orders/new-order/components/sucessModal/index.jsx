import { Button, Modal } from "antd";
import React from "react";
import { IMAGES } from "../../../../../../../constants";
const SuccessModal = ({ isSuccessModalOpen, handleCloseSuccessModal, orderData }) => {
  return (
    <Modal
      open={isSuccessModalOpen}
      onCancel={handleCloseSuccessModal}
      footer={null}
      centered
      width={440}
      closable={false}
    >
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <img src={IMAGES.sucessImage} alt="sucessImage" />

        <h2 className="mb-2 text-2xl font-bold text-[#178E28]">Order Sent To Kitchen</h2>

        {orderData && (
          <div className="mx-auto mt-2 bg-white">
            <p className="mb-1 text-sm text-gray-500">Order Number:</p>
            <p className="mb-4 text-2xl font-bold text-[#00BC1A]">{orderData.order_number}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="leading-relaxed">
                has been sent to the kitchen, you will be notified when its ready
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SuccessModal;
