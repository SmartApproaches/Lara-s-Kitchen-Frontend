import React from "react";
import { Modal } from "antd";
import { Tick02Icon } from "hugeicons-react";

import { Button } from "../../../../../components";

const PermissionSuccessModal = ({ visible, onClose, userName, userRole, isEditMode = false }) => {
  const title = isEditMode ? "Permission Updated" : "Permission Granted";
  const role = userRole === "super_admin" ? "Super Admin" : userRole;
  const message = isEditMode
    ? `You have updated ${userName?.toLowerCase()}'s ${role?.toLowerCase()}'s permission`
    : `You have given ${userName?.toLowerCase()} ${role?.toLowerCase()} permission`;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closable={false}
      className="permission-success-modal"
      styles={{
        body: {
          textAlign: "center",
          padding: "30px 10px",
        },
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-10">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-500">
          <Tick02Icon strokeWidth={2} size={80} className="text-2xl text-white" />
        </div>

        <h2 className="mb-0 text-lg font-semibold text-[#178E28] md:text-xl lg:text-2xl">
          {title}
        </h2>

        <p className="max-w-xs text-base leading-relaxed text-gray-600 md:text-lg lg:text-xl">
          {message}
        </p>

        <Button variant="primary" size="lg" onClick={onClose}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default PermissionSuccessModal;
