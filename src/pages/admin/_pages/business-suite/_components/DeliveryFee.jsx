import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input, Spin, Modal } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Delete01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";

import {
  useDeleteSpecialDeliveryFeeMutation,
  useGetGeneralDeliveryFeeQuery,
  useGetSpecialDeliveryFeesQuery,
  usePostSpecialDeliveryFeeMutation,
  useUpdateGeneralDeliveryFeeMutation,
  useUpdateSpecialDeliveryFeeMutation,
} from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";
import { customInfoToast } from "../../../../../utils/toast";
import CityInput from "./CityInput";

const DeliveryFee = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading: isLoadingFee,
    error: errorGeneralDeliveryFee,
  } = useGetGeneralDeliveryFeeQuery();
  const [updateDeliveryFee, { isLoading, error: errorUpdateDeliveryFee }] =
    useUpdateGeneralDeliveryFeeMutation();
  const [
    postSpecialDeliveryFee,
    { isLoading: isLoadingPostSpecial, error: errorPostSpecialDelivery },
  ] = usePostSpecialDeliveryFeeMutation();
  const {
    data: specialDelivery,
    isLoading: isLoadingSpecialDelivery,
    error: errorSpecialDelivery,
  } = useGetSpecialDeliveryFeesQuery();
  const [
    updateSpecialDeliveryFee,
    { isLoading: isLoadingUpdateSpecialDelivery, error: errorUpdateSpecialDelivery },
  ] = useUpdateSpecialDeliveryFeeMutation();
  const [
    deleteSpecialDeliveryFee,
    { isLoading: isLoadingDeleteSpecialDelivery, error: errorDeleteSpecialDelivery },
  ] = useDeleteSpecialDeliveryFeeMutation();

  const [deliveryFee, setDeliveryFee] = useState("");
  const [originalFee, setOriginalFee] = useState("");
  const [specialLocations, setSpecialLocations] = useState([{ city: "", fee: "" }]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalSpecialLocations, setOriginalSpecialLocations] = useState([]);
  const [savingLocationIndex, setSavingLocationIndex] = useState(null);

  useEffect(() => {
    const errors = [
      {
        error: errorUpdateDeliveryFee,
        fallback: "Failed to update delivery fee",
      },
      {
        error: errorPostSpecialDelivery,
        fallback: "Failed to add special delivery fee",
      },
      {
        error: errorUpdateSpecialDelivery,
        fallback: "Failed to update special delivery fee",
      },
      {
        error: errorDeleteSpecialDelivery,
        fallback: "Failed to delete special delivery fee",
      },
    ];

    errors.forEach(({ error, fallback }) => {
      if (error) {
        toast.error(error?.data?.message || fallback);
      }
    });
  }, [
    errorUpdateDeliveryFee,
    errorPostSpecialDelivery,
    errorUpdateSpecialDelivery,
    errorDeleteSpecialDelivery,
  ]);

  useEffect(() => {
    if (data?.data?.base_delivery_fee !== undefined) {
      const feeValue = data.data.base_delivery_fee;
      setDeliveryFee(feeValue);
      setOriginalFee(feeValue);
    }
  }, [data]);

  useEffect(() => {
    if (specialDelivery?.data && Array.isArray(specialDelivery.data)) {
      if (specialDelivery.data.length > 0) {
        const mappedLocations = specialDelivery.data.map((item) => ({
          id: item.id,
          city: item.city || "",
          fee: item.base_delivery_fee || "",
          isEditing: false,
        }));
        setSpecialLocations(mappedLocations);
        setOriginalSpecialLocations(mappedLocations);
      }
    }
  }, [specialDelivery]);

  const handleEditLocation = (index) => {
    if (editingIndex !== null && editingIndex !== index) {
      toast.warning("Please save or cancel the current edit before editing another location");
      return;
    }

    const copy = [...specialLocations];
    copy[index] = { ...copy[index], isEditing: true };
    setSpecialLocations(copy);
    setEditingIndex(index);
  };

  const handleAddNewLocation = () => {
    if (editingIndex !== null) {
      toast.warning("Please save or cancel the current edit before adding a new location");
      return;
    }

    const newLocation = {
      city: "",
      fee: "",
      isEditing: true,
    };
    setSpecialLocations([...specialLocations, newLocation]);
    setEditingIndex(specialLocations.length);
  };

  const handleCancelEdit = (index) => {
    const copy = [...specialLocations];
    const original = originalSpecialLocations.find((loc) => loc.id === copy[index].id);

    if (original) {
      copy[index] = { ...original, isEditing: false };
      setSpecialLocations(copy);
    } else {
      setSpecialLocations((prev) => prev.filter((_, i) => i !== index));
    }

    setEditingIndex(null);
  };

  const handleSaveSpecialDelivery = async (index = null) => {
    try {
      if (index !== null) {
        setSavingLocationIndex(index);

        const location = specialLocations[index];

        if (!location.city || !location.fee) {
          toast.error("Please fill in all required fields");
          return;
        }

        const feeValue = parseFloat(location.fee);
        if (isNaN(feeValue) || feeValue < 0) {
          toast.error("Please enter a valid delivery fee");
          return;
        }

        if (location.id) {
          const original = originalSpecialLocations.find((loc) => loc.id === location.id);

          const payload = {};

          if (location.city !== original?.city) {
            payload.city = location.city;
          }

          const currentFee = parseFloat(location.fee);
          const originalFee = parseFloat(original?.fee);

          if (currentFee !== originalFee) {
            payload.base_delivery_fee = currentFee;
          }

          if (Object.keys(payload).length === 0) {
            customInfoToast("No changes to save");

            const copy = [...specialLocations];
            copy[index].isEditing = false;
            setSpecialLocations(copy);
            setEditingIndex(null);

            return;
          }

          await updateSpecialDeliveryFee({
            id: location.id,
            name: "0",
            minimum_order_amount: 0,
            ...payload,
          }).unwrap();

          toast.success("Special delivery location saved successfully");

          const copy = [...specialLocations];
          copy[index].isEditing = false;
          setSpecialLocations(copy);
          setEditingIndex(null);

          const originalCopy = [...originalSpecialLocations];
          const originalIndex = originalCopy.findIndex((loc) => loc.id === location.id);
          if (originalIndex !== -1) {
            originalCopy[originalIndex] = { ...copy[index], isEditing: false };
          }
          setOriginalSpecialLocations(originalCopy);
        } else {
          const payload = {
            name: "0",
            city: location.city,
            base_delivery_fee: feeValue,
            minimum_order_amount: 0,
          };

          const result = await postSpecialDeliveryFee(payload).unwrap();

          toast.success("Special delivery location created successfully");

          const copy = [...specialLocations];
          if (result.data?.id) {
            copy[index].id = result.data.id;
          }
          copy[index].isEditing = false;
          setSpecialLocations(copy);
          setEditingIndex(null);

          const originalCopy = [...originalSpecialLocations];
          originalCopy.push({ ...copy[index], isEditing: false });
          setOriginalSpecialLocations(originalCopy);
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save special delivery location");
    } finally {
      setSavingLocationIndex(null);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setDeliveryFee(value);
    }
  };

  const handleSpecialFeeChange = (index, value) => {
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      const copy = [...specialLocations];
      copy[index] = { ...copy[index], fee: value };
      setSpecialLocations(copy);
    }
  };

  const removeSpecialLocation = (index) => {
    const location = specialLocations[index];
    if (location.id) {
      setLocationToDelete({ id: location.id, index });
      setDeleteModalVisible(true);
    } else {
      setSpecialLocations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSpecialDeliveryFee(locationToDelete.id).unwrap();
      toast.success("Special delivery location deleted successfully");
      setSpecialLocations((prev) => prev.filter((_, i) => i !== locationToDelete.index));
      setDeleteModalVisible(false);
      setLocationToDelete(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete special delivery location");
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

      await updateDeliveryFee({
        base_delivery_fee: feeValue,
        minimum_order_amount: 0,
        name: "0",
      }).unwrap();
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

  if (errorGeneralDeliveryFee || errorSpecialDelivery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-sm text-red-600 sm:text-base">
            {errorGeneralDeliveryFee?.data?.message ||
              errorSpecialDelivery?.data?.message ||
              "Failed to load delivery fee"}
          </p>
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
                <HugeiconsIcon icon={ArrowLeft02Icon} size={20} className="sm:h-6 sm:w-6" />
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
                General Delivery fee amount
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

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mt-6 rounded-lg bg-white shadow">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-900 sm:text-base">
                Special Delivery fee
              </label>
              {isLoadingSpecialDelivery && <Spin size="small" />}
            </div>

            {specialLocations.map((loc, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-3 lg:hidden">
                  <div className="w-full">
                    <CityInput
                      value={loc.city}
                      disabled={!loc.isEditing}
                      onSelect={(data) => {
                        const copy = [...specialLocations];
                        copy[index] = {
                          ...copy[index],
                          city: data.address,
                        };
                        setSpecialLocations(copy);
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      value={loc.fee}
                      onChange={(e) => handleSpecialFeeChange(index, e.target.value)}
                      disabled={!loc.isEditing}
                      prefix="£"
                      placeholder="0.00"
                      size="large"
                      className="flex-1"
                      style={{
                        backgroundColor: "#f5f5f5",
                        border: "none",
                        height: "48px",
                      }}
                    />

                    {!loc.isEditing && loc.id && (
                      <button
                        type="button"
                        onClick={() => handleEditLocation(index)}
                        disabled={editingIndex !== null && editingIndex !== index}
                        className="text-primary flex h-12 w-12 shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        title="Edit location"
                      >
                        <PencilEdit02Icon strokeWidth={2} size={24} />
                      </button>
                    )}

                    {specialLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecialLocation(index)}
                        disabled={editingIndex !== null}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove location"
                      >
                        <Delete01Icon size={20} />
                      </button>
                    )}
                  </div>

                  {loc.isEditing && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveSpecialDelivery(index)}
                        disabled={isLoadingUpdateSpecialDelivery || isLoadingPostSpecial}
                        className="flex h-12 flex-1 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Save changes"
                      >
                        {(isLoadingUpdateSpecialDelivery || isLoadingPostSpecial) &&
                        savingLocationIndex === index
                          ? "Saving..."
                          : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelEdit(index)}
                        disabled={isLoadingUpdateSpecialDelivery || isLoadingPostSpecial}
                        className="flex h-12 flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Cancel edit"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="hidden w-full lg:flex lg:items-center lg:gap-3">
                  <div className="flex-1">
                    <CityInput
                      value={loc.city}
                      disabled={!loc.isEditing}
                      onSelect={(data) => {
                        const copy = [...specialLocations];
                        copy[index] = {
                          ...copy[index],
                          city: data.address,
                        };
                        setSpecialLocations(copy);
                      }}
                    />
                  </div>

                  <div className="w-40">
                    <Input
                      value={loc.fee}
                      onChange={(e) => handleSpecialFeeChange(index, e.target.value)}
                      disabled={!loc.isEditing}
                      prefix="£"
                      placeholder="0.00"
                      size="large"
                      className="text-black/60!"
                      style={{
                        backgroundColor: "#f5f5f5",
                        border: "none",
                        height: "48px",
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {!loc.isEditing && loc.id && (
                      <button
                        type="button"
                        onClick={() => handleEditLocation(index)}
                        disabled={editingIndex !== null && editingIndex !== index}
                        className="text-primary flex h-12 w-12 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        title="Edit location"
                      >
                        <PencilEdit02Icon strokeWidth={2} size={24} />
                      </button>
                    )}

                    {loc.isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveSpecialDelivery(index)}
                          disabled={isLoadingUpdateSpecialDelivery || isLoadingPostSpecial}
                          className="flex h-12 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Save changes"
                        >
                          {(isLoadingUpdateSpecialDelivery || isLoadingPostSpecial) &&
                          savingLocationIndex === index
                            ? "Saving..."
                            : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit(index)}
                          disabled={isLoadingUpdateSpecialDelivery || isLoadingPostSpecial}
                          className="flex h-12 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Cancel edit"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {specialLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecialLocation(index)}
                        disabled={editingIndex !== null}
                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove location"
                      >
                        <Delete01Icon size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex">
              <button
                onClick={handleAddNewLocation}
                disabled={editingIndex !== null}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                + Add other special locations
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setLocationToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: isLoadingDeleteSpecialDelivery,
        }}
        centered
      >
        <p>Are you sure you want to delete this special delivery location?</p>
      </Modal>
    </div>
  );
};

export default DeliveryFee;
