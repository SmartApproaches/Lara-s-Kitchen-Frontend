import React, { useState, useEffect } from "react";
import { Modal, Input, Select } from "antd";

import { Button } from "../../../../../components";
import { customWarningToast } from "../../../../../utils/toast";

const { Option } = Select;

const PermissionsModal = ({
  visible,
  onClose,
  onSubmit,
  editData = null,
  isEditMode = false,
  isSubmitting,
}) => {
  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [phone, setPhone] = useState("");

  const roles = [
    {
      value: "Super Admin",
      label: "Super Admin",
      description: "The Super Admin would have access to:",
      permissions: [
        "Manage users & roles",
        "Add/edit/remove menu items",
        "View and manage all orders",
        "Access all transactions & reports",
        "Full system settings access",
      ],
    },
    {
      value: "Cashier",
      label: "Cashier",
      description: "The Cashier would have access to:",
      permissions: [
        "Receive and manage customer orders",
        "Process and record payments",
        "Print/reprint receipts",
        "View transaction history (own branch/desk)",
      ],
    },
    {
      value: "Rider",
      label: "Rider",
      description: "The Rider would have access to:",
      permissions: [
        "View assigned deliveries",
        "Access customer delivery details",
        "Update delivery status (picked up, on the way, delivered)",
        "Track delivery history",
      ],
    },
    {
      value: "Kitchen",
      label: "Kitchen",
      description: "The Kitchen staff would have access to:",
      permissions: [
        "Receive incoming orders",
        "View order details (items, customer info, timestamp)",
        "Update order status (preparing → ready)",
      ],
    },
    {
      value: "Consumer",
      label: "Consumer",
      description: "The Consumer would have access to:",
      permissions: [
        "Browse menu items",
        "Place orders for dine-in, takeout, or delivery",
        "Make payments securely",
        "View order history and status",
      ],
    },
  ];

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!employeeName.trim()) {
      customWarningToast("Please enter employee name");
      return;
    }
    if (!email.trim()) {
      customWarningToast("Please enter email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      customWarningToast("Please enter a valid email address");
      return;
    }
    if (!selectedRole) {
      customWarningToast("Please select a role");
      return;
    }

    const normalizedRole =
      selectedRole?.toLowerCase() === "super admin" ? "super_admin" : selectedRole?.toLowerCase();
    
    const permissionData = {};

    if (isEditMode && editData) {
      if (employeeName !== editData?.name) {
        permissionData.name = employeeName;
      }
      if (email !== editData?.email) {
        permissionData.email = email;
      }
      const originalRole =
        editData?.role?.name?.toLowerCase() === "super admin"
          ? "super_admin"
          : editData?.role?.name?.toLowerCase();
      if (normalizedRole !== originalRole) {
        permissionData.role = normalizedRole;
      }
      if (normalizedRole === "rider" && phone !== editData?.phone) {
        permissionData.phone = phone;
      }
      if (Object.keys(permissionData).length === 0) {
        customWarningToast("No changes made to update");
        return;
      }
    } else {
      permissionData.name = employeeName;
      permissionData.email = email;
      permissionData.role = normalizedRole;
      if (normalizedRole === "rider" && phone.trim()) {
        permissionData.phone = phone;
      }
      if (normalizedRole === "rider" && !phone.trim()) {
        customWarningToast("Please enter phone number for rider");
        return;
      }
    }

    try {
      await onSubmit(permissionData);

      setEmployeeName("");
      setEmail("");
      setSelectedRole("");
    } catch (error) {}
  };

  const handleClose = () => {
    setEmployeeName("");
    setEmail("");
    setSelectedRole("");
    setPhone("");
    onClose();
  };

  const adminSelection =
    selectedRole === "super_admin"
      ? "Super Admin"
      : selectedRole === "Kitchen Staff"
        ? "Kitchen"
        : selectedRole;

  const selectedRoleData = roles.find(
    (role) => role.value.toLowerCase() === adminSelection.toLowerCase(),
  );

  useEffect(() => {
    if (isEditMode && editData) {
      setEmployeeName(editData?.name || "");
      setEmail(editData?.email || "");
      setSelectedRole(editData?.role?.name || "");
    }
  }, [isEditMode, editData]);

  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-3 pb-3">
          <h2 className="text-secondary m-0 text-lg font-bold md:text-xl">
            {isEditMode ? "Edit Role Permission" : "New Role Permission"}
          </h2>
        </div>
      }
      closable={true}
      open={visible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      width="100%"
      style={{ maxWidth: 600, padding: 10 }}
    >
      <div className="space-y-5 pt-5">
        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Employee Name</label>
          <Input
            placeholder="Enter Employee Name"
            size="large"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="text-base capitalize"
            style={{ backgroundColor: "#f5f5f5", border: "none" }}
          />
        </div>

        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Email</label>
          <Input
            placeholder="Enter Email Address"
            size="large"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-base"
            style={{ backgroundColor: "#f5f5f5", border: "none" }}
          />
        </div>

        {selectedRole === "Rider" && (
          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Phone Number</label>
            <Input
              placeholder="Enter Phone Number"
              size="large"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-base"
              style={{ backgroundColor: "#f5f5f5", border: "none" }}
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Select Role</label>
          <Select
            placeholder="Select Role"
            size="large"
            value={selectedRole}
            onChange={setSelectedRole}
            className="w-full text-base capitalize"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            {roles.map((role) => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
        </div>

        {selectedRoleData && (
          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-green-800">Role Description</h3>
            <p className="mb-3 text-green-700">{selectedRoleData.description}</p>
            <ul className="space-y-1">
              {selectedRoleData.permissions.map((permission, index) => (
                <li key={index} className="flex items-center text-green-600">
                  <span className="mr-2 text-base text-green-500">•</span>
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          type="primary"
          className="w-full"
          size="lg"
          htmltype="button"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditMode ? "Update Permission" : "Give Permission"}
        </Button>
      </div>
    </Modal>
  );
};

export default PermissionsModal;
