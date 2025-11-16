import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input, Spin } from "antd";
import { ArrowLeft02Icon } from "hugeicons-react";

import {
  useGetDeliveryFeeQuery,
  useUpdateDeliveryFeeMutation,
} from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";
import { customInfoToast } from "../../../../../utils/toast";

const DeliveryFee = () => {
  const navigate = useNavigate();
  const { data, isLoading: isLoadingFee, isError } = useGetDeliveryFeeQuery();
  const [updateDeliveryFee, { isLoading }] = useUpdateDeliveryFeeMutation();

  const [deliveryFee, setDeliveryFee] = useState("");
  const [originalFee, setOriginalFee] = useState("");

  useEffect(() => {
    if (data?.data?.base_delivery_fee !== undefined) {
      const feeValue = data.data.base_delivery_fee;
      setDeliveryFee(feeValue);
      setOriginalFee(feeValue);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setDeliveryFee(value);
    }
  };

  const handleSave = async () => {
    try {
      if (!deliveryFee || deliveryFee === "") {
        toast.error("Please enter a delivery fee");
        return;
      }

      const feeValue = parseFloat(deliveryFee);
      if (isNaN(feeValue) || feeValue < 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (deliveryFee === originalFee) {
        customInfoToast("No changes to save");
        return;
      }

      await updateDeliveryFee({ base_delivery_fee: feeValue, minimum_order_amount: 0 }).unwrap();
      toast.success("Delivery fee updated successfully");
      setOriginalFee(deliveryFee);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update delivery fee");
    }
  };

  const handleCancel = () => {
    setDeliveryFee(originalFee);
    navigate(-1);
  };

  if (isLoadingFee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-sm text-red-600 sm:text-base">Failed to load delivery fee</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white hover:bg-green-700 sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <button
                onClick={() => navigate(-1)}
                className="mt-1 shrink-0 text-gray-600 hover:text-gray-900 sm:mt-0"
              >
                <ArrowLeft02Icon size={20} className="sm:h-6 sm:w-6" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                  Set Delivery fee
                </h1>
                <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm md:text-base">
                  Set delivery fees for riders.
                </p>
              </div>
            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:flex-none sm:px-6 sm:text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-primary flex-1 rounded-md px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 sm:flex-none sm:px-6 sm:text-sm"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-4 sm:p-6 md:p-8">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 sm:text-base">
                Delivery fee amount
              </label>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="relative flex-1">
                  <Input
                    value={deliveryFee}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    prefix={
                      <span className="mr-1 text-base font-semibold text-gray-700 sm:text-lg">
                        £
                      </span>
                    }
                    size="large"
                    className="text-base sm:text-lg"
                    style={{
                      backgroundColor: "#f5f5f5",
                      border: "none",
                      height: "48px",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <div className="flex items-center justify-center rounded-lg bg-green-50 px-4 py-3 sm:justify-start sm:px-6">
                  <span className="text-xs font-medium whitespace-nowrap text-green-700 sm:text-sm">
                    Fixed Price
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryFee;
