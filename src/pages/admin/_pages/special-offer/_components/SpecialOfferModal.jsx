import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker } from "antd";
import { ArrowLeft02Icon } from "hugeicons-react";
import dayjs from "dayjs";

import { Button } from "../../../../../components";
import { customWarningToast } from "../../../../../utils/toast";

const { TextArea } = Input;

const SpecialOfferModal = ({
  visible,
  onClose,
  onSubmit,
  editData = null,
  isEditMode = false,
  isSubmitting,
}) => {
  const [description, setDescription] = useState("");
  const [percentage, setPercentage] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  useEffect(() => {
    if (isEditMode && editData) {
      setDescription(editData.description || "");
      setPercentage(editData.percentage?.replace("% off", "") || "");
      if (editData.startDateTime) {
        const startDateParsed = dayjs(editData.startDateTime.date, "DD/MM/YYYY");
        setStartDate(startDateParsed.isValid() ? startDateParsed : dayjs());
        setStartTime(editData.startDateTime.time || "00:00");
      }
      if (editData.endDateTime) {
        const endDateParsed = dayjs(editData.endDateTime.date, "DD/MM/YYYY");
        setEndDate(endDateParsed.isValid() ? endDateParsed : dayjs());
        setEndTime(editData.endDateTime.time || "00:00");
      }
    }
  }, [isEditMode, editData]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      customWarningToast("Please enter a description");
      return;
    }
    if (!percentage.trim()) {
      customWarningToast("Please enter percentage");
      return;
    }
    const percentageNum = parseInt(percentage);
    if (isNaN(percentageNum) || percentageNum < 1 || percentageNum > 100) {
      customWarningToast("Percentage must be between 1 and 100");
      return;
    }

    const startDateTime = dayjs(`${startDate.format("YYYY-MM-DD")} ${startTime}`);
    const endDateTime = dayjs(`${endDate.format("YYYY-MM-DD")} ${endTime}`);
    if (endDateTime.isBefore(startDateTime)) {
      customWarningToast("End date and time must be after start date and time");
      return;
    }

    const offerData = {
      id: isEditMode ? editData.id : Date.now().toString(),
      description,
      percentage: `${percentage}% off`,
      startDateTime: { date: startDate.format("DD/MM/YYYY"), time: startTime },
      endDateTime: { date: endDate.format("DD/MM/YYYY"), time: endTime },
    };

    try {
      await onSubmit(offerData, isEditMode);
      handleClose();
    } catch {}
  };

  const handleClose = () => {
    setDescription("");
    setPercentage("");
    setStartDate(dayjs());
    setEndDate(dayjs());
    setStartTime("00:00");
    setEndTime("00:00");
    onClose();
  };

  const adjustDate = (date, days) => date.add(days, "day");

  const DateTimeSelector = ({ label, date, time, onDateChange, onTimeChange }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="w-full space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-x-1">
            <div className="bg-primary flex items-center rounded text-xs text-white">
              <button
                type="button"
                className="rounded-l px-2 py-1 hover:bg-green-800"
                onClick={() => onDateChange(adjustDate(date, -1))}
              >
                <ArrowLeft02Icon size={14} />
              </button>
              <div className="cursor-pointer px-3 py-1 text-center" onClick={() => setOpen(true)}>
                <div className="text-sm font-bold">{date.format("DD")}</div>
                <div className="text-[10px]">{date.format("MMM")}</div>
              </div>
              <button
                type="button"
                className="rounded-r px-2 py-1 hover:bg-green-800"
                onClick={() => onDateChange(adjustDate(date, 1))}
              >
                <ArrowLeft02Icon size={14} className="rotate-180" />
              </button>
            </div>
            <DatePicker
              open={open}
              value={date}
              onChange={(val) => {
                if (val) onDateChange(val);
                setOpen(false);
              }}
              onOpenChange={(status) => setOpen(status)}
              className="hidden"
            />
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-2 py-[6px] text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            style={{ maxWidth: 110 }}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-center gap-3 pb-3">
          <h2 className="text-secondary m-0 text-lg font-bold md:text-xl">
            {isEditMode ? "Edit Special Offer" : "New Special Offer"}
          </h2>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="100%"
      style={{ maxWidth: 600, padding: 10 }}
    >
      <div className="space-y-5 pt-5">
        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Description</label>
          <TextArea
            placeholder="Enter Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none text-base"
            style={{ backgroundColor: "#f5f5f5", border: "none" }}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DateTimeSelector
            label="Start Date & Time"
            date={startDate}
            time={startTime}
            onDateChange={setStartDate}
            onTimeChange={setStartTime}
          />
          <DateTimeSelector
            label="End Date & Time"
            date={endDate}
            time={endTime}
            onDateChange={setEndDate}
            onTimeChange={setEndTime}
          />
        </div>
        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Percentage</label>
          <div className="relative">
            <Input
              placeholder="Enter Percent off"
              size="large"
              value={percentage}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 100)) {
                  setPercentage(value);
                }
              }}
              className="pr-6 text-base"
              style={{ backgroundColor: "#f5f5f5", border: "none" }}
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-gray-500">
              %
            </span>
          </div>
        </div>
        <Button
          type="primary"
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {isEditMode ? "Update Offer" : "Add Offer"}
        </Button>
      </div>
    </Modal>
  );
};

export default SpecialOfferModal;
