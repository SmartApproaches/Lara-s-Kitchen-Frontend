import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input, Select, Switch, Button, Skeleton, Alert } from "antd";
import { LinkOutlined, ArrowLeftOutlined, PhoneOutlined } from "@ant-design/icons";

import { Button as CustomButton } from "../../../../../components";
import { customInfoToast } from "../../../../../utils/toast";
import {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
} from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";

// Converts a UK phone number to international format with no spaces (e.g. "07911 123456"
// -> "+447911123456"), which is what the backend expects. Returns null if it isn't a UK number.
const toUkInternational = (value) => {
  let digits = String(value ?? "").replace(/[\s().-]/g, "");
  if (digits.startsWith("+44")) digits = digits.slice(3);
  else if (digits.startsWith("0044")) digits = digits.slice(4);
  else if (digits.startsWith("44") && digits.length >= 11) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1); // "0" trunk prefix, incl. "+44 (0)20…"
  return /^[1-9]\d{8,9}$/.test(digits) ? `+44${digits}` : null;
};

const AppSettings = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAppSettingsQuery();
  const [updateAppSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();

  const [formData, setFormData] = useState({
    versionNumber: "",
    updateType: "",
    iosStoreUrl: "",
    androidStoreUrl: "",
    maintenanceMode: false,
    restaurantPhone: "",
  });

  const [initialData, setInitialData] = useState({
    versionNumber: "",
    updateType: "",
    iosStoreUrl: "",
    androidStoreUrl: "",
    maintenanceMode: false,
    restaurantPhone: "",
  });

  useEffect(() => {
    if (data?.data) {
      const loadedData = {
        versionNumber: data.data?.version_number || "",
        updateType: data.data?.update_type || "",
        iosStoreUrl: data.data?.ios_store_url || "",
        androidStoreUrl: data.data?.android_store_url || "",
        maintenanceMode: data.data?.is_maintenance_mode || false,
        restaurantPhone: data.data?.restaurant_phone || "",
      };
      setFormData(loadedData);
      setInitialData(loadedData);
    }
  }, [data]);

  const updateTypes = [
    { value: "hard", label: "Hard Update" },
    { value: "soft", label: "Soft Update" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getChangedFields = () => {
    const changedFields = {};

    if (formData.versionNumber !== initialData.versionNumber) {
      changedFields.version_number = formData.versionNumber;
    }
    if (formData.updateType !== initialData.updateType) {
      changedFields.update_type = formData.updateType;
    }
    if (formData.iosStoreUrl !== initialData.iosStoreUrl) {
      changedFields.ios_store_url = formData.iosStoreUrl;
    }
    if (formData.androidStoreUrl !== initialData.androidStoreUrl) {
      changedFields.android_store_url = formData.androidStoreUrl;
    }
    if (formData.maintenanceMode !== initialData.maintenanceMode) {
      changedFields.is_maintenance_mode = formData.maintenanceMode;
    }

    const phone = formData.restaurantPhone.trim()
      ? toUkInternational(formData.restaurantPhone)
      : "";
    if (phone !== (toUkInternational(initialData.restaurantPhone) ?? initialData.restaurantPhone)) {
      changedFields.restaurant_phone = phone;
    }

    return changedFields;
  };

  const handleSave = async () => {
    if (!formData.versionNumber) {
      customInfoToast("Please enter version number");
      return;
    }
    if (!formData.updateType) {
      customInfoToast("Please select update type");
      return;
    }

    // SmartEatX riders call this number, so it must be a UK phone number.
    if (formData.restaurantPhone.trim() && !toUkInternational(formData.restaurantPhone)) {
      customInfoToast("Enter a valid UK phone number, e.g. 020 1234 5678 or +44 20 1234 5678");
      return;
    }

    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 0) {
      customInfoToast("No changes detected");
      return;
    }

    try {
      const response = await updateAppSettings(changedFields).unwrap();

      if (response?.status) {
        toast.success(response.message || "Settings saved successfully");
        setInitialData(formData);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save settings");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            >
              <ArrowLeftOutlined className="text-xl" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">App Settings</h1>
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            >
              <ArrowLeftOutlined className="text-xl" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">App Settings</h1>
          </div>
        </div>
        <Alert
          message={error?.data?.message || "Error loading App Settings"}
          description="Failed to fetch App Settings data. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          >
            <ArrowLeftOutlined className="text-xl" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">App Settings</h1>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleCancel} className="h-10 rounded-lg border border-gray-300 px-6">
            Cancel
          </Button>
          <CustomButton
            type="primary"
            onClick={handleSave}
            loading={isUpdating}
            className="h-10 rounded-lg bg-green-700 px-6 hover:bg-green-800"
          >
            Save
          </CustomButton>
        </div>
      </div>

      <p className="mb-6 text-base text-gray-500">
        Manage and configure settings for the Lara's Kitchen mobile app.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <label className="text-base font-medium whitespace-nowrap text-gray-700">
                Version Number
              </label>
              <Input
                placeholder="Enter Version Number"
                value={formData.versionNumber}
                onChange={(e) => handleInputChange("versionNumber", e.target.value)}
                className="h-12 lg:max-w-[280px]"
                size="large"
              />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <label className="text-base font-medium whitespace-nowrap text-gray-700">
                Update Type
              </label>
              <Select
                placeholder="Select Type"
                value={formData.updateType || undefined}
                onChange={(value) => handleInputChange("updateType", value)}
                className="w-full lg:max-w-[280px]"
                size="large"
                options={updateTypes}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <label className="text-base font-medium whitespace-nowrap text-gray-700">
              iOS Store URL
            </label>
            <Input
              prefix={<LinkOutlined className="text-gray-400" />}
              placeholder="Your URL"
              value={formData.iosStoreUrl}
              onChange={(e) => handleInputChange("iosStoreUrl", e.target.value)}
              className="h-12 lg:flex-1"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <label className="text-base font-medium whitespace-nowrap text-gray-700">
              Android Store URL
            </label>
            <Input
              prefix={<LinkOutlined className="text-gray-400" />}
              placeholder="Your URL"
              value={formData.androidStoreUrl}
              onChange={(e) => handleInputChange("androidStoreUrl", e.target.value)}
              className="h-12 lg:flex-1"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div>
              <label className="text-base font-medium whitespace-nowrap text-gray-700">
                Restaurant Phone
              </label>
              <p className="text-xs text-gray-500">
                SmartEatX riders call this number. Needed before booking SmartEatX riders.
              </p>
            </div>
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="e.g. 020 1234 5678"
              type="tel"
              value={formData.restaurantPhone}
              onChange={(e) => handleInputChange("restaurantPhone", e.target.value)}
              className="h-12 lg:max-w-[280px]"
              size="large"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-medium text-gray-700">Maintenance Mode</label>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm ${!formData.maintenanceMode ? "font-medium text-gray-900" : "text-gray-500"}`}
              >
                No
              </span>
              <Switch
                checked={formData.maintenanceMode}
                onChange={(checked) => handleInputChange("maintenanceMode", checked)}
                className={formData.maintenanceMode ? "bg-[#1f5226]!" : ""}
              />
              <span
                className={`text-sm ${formData.maintenanceMode ? "font-medium text-gray-900" : "text-gray-500"}`}
              >
                Yes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
