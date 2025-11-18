import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Radio, Pagination, Spin, Form } from "antd";
import { ArrowLeft02Icon, Search01Icon } from "hugeicons-react";
import dayjs from "dayjs";

import { Button } from "../../../../../components";
import { customWarningToast } from "../../../../../utils/toast";
import { useGetSpecialOffersMenuQuery } from "../../../../../redux/slices/super-admin/specialOfferApiSlice";

const { TextArea } = Input;

const OFFER_NAME_MAX_LENGTH = 21;
const DESCRIPTION_MAX_LENGTH = 28;

const SpecialOfferModal = ({
  visible,
  onClose,
  onSubmit,
  editData = null,
  isEditMode = false,
  isSubmitting,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [offerName, setOfferName] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [availabilityDate, setAvailabilityDate] = useState(dayjs());

  const { data: menuData, isLoading: isLoadingMenu } = useGetSpecialOffersMenuQuery({
    page: currentPage,
    search: debouncedSearchQuery,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (visible) {
      if (isEditMode && editData) {
        setCurrentStep(2);
        setOfferName(editData.offer_name || "");
        setDescription(editData.description || "");
        if (editData.from_date) {
          setFromDate(dayjs(editData.from_date));
        }
        if (editData.to_date) {
          setToDate(dayjs(editData.to_date));
        }
        if (editData.availability_date) {
          setAvailabilityDate(dayjs(editData.availability_date));
        }
      } else if (!isEditMode) {
        setCurrentStep(1);
        setSelectedDish(null);
        setOfferName("");
        setDescription("");
        setFromDate(dayjs());
        setToDate(dayjs());
        setAvailabilityDate(dayjs());
        setCurrentPage(1);
      }
    }
  }, [visible, isEditMode, editData]);

  const handleDishSelection = () => {
    if (!selectedDish) {
      customWarningToast("Please select a dish");
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    if (!offerName.trim()) {
      customWarningToast("Please enter an offer name");
      return;
    }
    if (!description.trim()) {
      customWarningToast("Please enter a description");
      return;
    }

    if (toDate.isBefore(fromDate)) {
      customWarningToast("To date must be after from date");
      return;
    }

    const offerData = {
      offer_name: offerName,
      description: description,
      menu_item_id: isEditMode ? editData.menu_item_id : selectedDish.id,
      from_date: fromDate.format("YYYY-MM-DD"),
      to_date: toDate.format("YYYY-MM-DD"),
      availability_date: availabilityDate.format("YYYY-MM-DD"),
    };

    try {
      await onSubmit(offerData);
      handleClose();
    } catch (error) {}
  };

  const handleClose = () => {
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 2 && !isEditMode) {
      setCurrentStep(1);
    } else {
      handleClose();
    }
  };

  const DateSelector = ({ label, date, onDateChange }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="w-full space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <DatePicker
          open={open}
          value={date}
          onChange={(val) => {
            if (val) onDateChange(val);
            setOpen(false);
          }}
          onOpenChange={(status) => setOpen(status)}
          className="hidden w-full p-3!"
        />
      </div>
    );
  };

  const menuItems = menuData?.data?.data || [];
  const totalItems = menuData?.data?.total || 0;
  const perPage = menuData?.data?.per_page || 12;

  return (
    <Modal
      title={
        <div className="relative flex flex-wrap items-center justify-between gap-3 px-5 pb-3 sm:flex-nowrap">
          {currentStep === 2 && !isEditMode && (
            <div
              className="absolute top-1 -left-1 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-800 sm:relative sm:top-0 sm:left-0"
              onClick={handleBack}
            >
              <ArrowLeft02Icon size={20} />
            </div>
          )}

          <h2 className="text-secondary m-0 flex-grow pl-8 text-base font-bold sm:pl-0 md:text-xl">
            {currentStep === 1
              ? "Select Special Offer Dish"
              : isEditMode
                ? "Edit Special Offer"
                : "New Special Offer"}
          </h2>

          {currentStep === 1 && !isEditMode && (
            <div className="mt-2 w-full sm:mt-0 sm:w-auto">
              <Input
                suffix={<Search01Icon size={16} />}
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-[#D2FFD9] p-1 px-4 sm:w-[140px]"
              />
            </div>
          )}
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="100%"
      style={{ maxWidth: 600, padding: 10 }}
    >
      {currentStep === 1 ? (
        <div className="space-y-5 pt-5">
          {isLoadingMenu ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {menuItems.length > 0 ? (
                <Radio.Group
                  onChange={(e) =>
                    setSelectedDish(menuItems.find((item) => item.id === e.target.value))
                  }
                  value={selectedDish?.id}
                  className="w-full"
                >
                  <div className="flex w-full flex-col gap-y-3 pb-5">
                    {menuItems.map((dish) => (
                      <Radio key={dish.id} value={dish.id} className="w-full">
                        <div
                          className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                            selectedDish?.id === dish.id ? "bg-accent" : "bg-gray-50"
                          }`}
                        >
                          <img
                            src={dish?.media?.url}
                            alt={dish?.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <span className="text-base font-medium text-gray-800 capitalize md:text-lg">
                            {dish?.name}
                          </span>
                        </div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              ) : (
                <p className="text-center text-lg text-gray-500">No dishes found.</p>
              )}

              {totalItems > perPage && (
                <div className="flex justify-center pt-4">
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={perPage}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              )}

              <Button
                type="primary"
                className="w-full"
                size="lg"
                onClick={handleDishSelection}
                disabled={!selectedDish}
              >
                Next
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-5 pt-5">
          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Offer Name</label>
            <Input
              placeholder="Enter Offer Name"
              size="large"
              value={offerName}
              maxLength={OFFER_NAME_MAX_LENGTH}
              showCount
              onChange={(e) => setOfferName(e.target.value)}
              className="text-base"
              style={{ backgroundColor: "#f5f5f5", border: "none" }}
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Description</label>
            <TextArea
              placeholder="Enter Description"
              rows={3}
              value={description}
              maxLength={DESCRIPTION_MAX_LENGTH}
              showCount
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none text-base"
              style={{ backgroundColor: "#f5f5f5", border: "none" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <DateSelector label="From Date" date={fromDate} onDateChange={setFromDate} />
            <DateSelector label="To Date" date={toDate} onDateChange={setToDate} />
          </div>

          <DateSelector
            label="Available Date"
            date={availabilityDate}
            onDateChange={setAvailabilityDate}
          />

          <Button
            type="primary"
            className="flex- w-full"
            size="lg"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {isEditMode ? "Update Offer" : "Add Offer"}
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default SpecialOfferModal;
