import React, { useState, useEffect } from "react";
import { Table, Skeleton, Alert, Checkbox, Modal } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Delete01Icon, Edit02Icon } from "@hugeicons/core-free-icons";

import { IMAGES } from "../../../../../constants";

const SpecialOfferTable = ({
  specialOffers,
  isLoading,
  isError,
  onEdit,
  onDelete,
  isDeleting,
  pagination,
  currentPage,
  onPageChange,
}) => {
  const [specialOfferData, setSpecialOfferData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);

  useEffect(() => {
    if (specialOffers) {
      setSpecialOfferData(specialOffers);
    }
  }, [specialOffers]);

  const handleRowSelect = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (recordToDelete && onDelete) {
      await onDelete(recordToDelete.id);
    }
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      return;
    }
    setBulkDeleteModalVisible(true);
  };

  const handleConfirmBulkDelete = async () => {
    if (onDelete) {
      await onDelete(selectedRows);
      setSelectedRows([]);
    }
    setBulkDeleteModalVisible(false);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = specialOfferData?.map((item) => item?.id) || [];
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleCancelBulkDelete = () => {
    setBulkDeleteModalVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDuration = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "N/A";
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    if (diffDays < 30) return `${diffDays} days`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 month";
    return `${diffMonths} months`;
  };

  const allIds = specialOfferData?.map((item) => item?.id) || [];
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedRows.includes(id));
  const isSomeSelected = allIds.some((id) => selectedRows.includes(id)) && !isAllSelected;

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={isAllSelected}
          indeterminate={isSomeSelected}
        />
      ),
      dataIndex: "select",
      key: "select",
      width: 60,
      fixed: "left",
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.includes(record?.id)}
          onChange={(e) => handleRowSelect(record?.id, e.target.checked)}
        />
      ),
    },
    {
      title: "OFFER NAME",
      dataIndex: "offer_name",
      key: "offer_name",
      className: "font-medium",
      render: (text) => <span className="font-semibold text-gray-900">{text || "N/A"}</span>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      className: "font-medium",
      render: (text) => <span className="text-gray-700">{text || "N/A"}</span>,
    },
    {
      title: "DURATION",
      key: "duration",
      className: "font-medium",
      render: (_, record) => (
        <span className="font-medium text-gray-900">
          {calculateDuration(record?.from_date, record?.to_date)}
        </span>
      ),
    },
    {
      title: "AVAILABLE DATE",
      dataIndex: "availability_date",
      key: "availability_date",
      className: "font-medium",
      render: (dateString) => (
        <span className="font-medium text-gray-900">{formatDate(dateString)}</span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      className: "font-medium",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-3">
          <button
            className="cursor-pointer transition-colors hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            title="Edit special offer"
            type="button"
          >
            <HugeiconsIcon icon={Edit02Icon} size={20} />
          </button>
          <button
            className="cursor-pointer transition-colors hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            title="Delete special offer"
            type="button"
          >
            <HugeiconsIcon icon={Delete01Icon} size={20} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="mt-10">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );

  if (isError)
    return (
      <div className="mt-10">
        <Alert type="error" message="Failed to load special offers" />
      </div>
    );

  return (
    <div className="mt-8">
      {selectedRows.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm md:text-base">
          <span className="font-medium text-blue-800">
            {selectedRows.length} item{selectedRows.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="cursor-pointer rounded bg-red-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-600 md:py-2"
            type="button"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {!specialOffers?.length ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Special Offers" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">Sorry Nothing Here!!!</h3>
            <p>Add a new special offer to get started</p>
          </div>
        ) : (
          <Table
            dataSource={specialOfferData}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={false}
            className="custom-table"
            scroll={{ x: 1200 }}
            bordered
          />
        )}
      </div>

      {specialOffers?.length > 0 && (
        <div className="mt-4 flex items-center justify-between font-semibold text-gray-600">
          <button
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} size={20} />
          </button>
          <span className="text-base">
            Page {currentPage} of {pagination?.last_page || 1}
          </span>
          <button
            disabled={currentPage === pagination?.last_page || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} size={20} />
          </button>
        </div>
      )}

      <Modal
        title="Delete Special Offer"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        okButtonProps={{ loading: isDeleting }}
        okType="danger"
        cancelText="Cancel"
        centered
        maskClosable={false}
        keyboard={true}
      >
        <div>
          <p>Are you sure you want to delete this special offer?</p>
          {recordToDelete && (
            <div className="mt-3 rounded bg-gray-50 p-3">
              <p className="font-medium text-gray-900">{recordToDelete.offer_name}</p>
              <p className="text-sm text-gray-600">{recordToDelete.description}</p>
              <p className="text-sm text-gray-600">
                {formatDate(recordToDelete.from_date)} - {formatDate(recordToDelete.to_date)}
              </p>
              <p className="text-sm text-gray-500">
                Available: {formatDate(recordToDelete.availability_date)}
              </p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title={`Delete ${selectedRows.length} Special Offer${selectedRows.length > 1 ? "s" : ""}`}
        open={bulkDeleteModalVisible}
        onOk={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
        okText="Delete All"
        okType="danger"
        cancelText="Cancel"
        centered
        okButtonProps={{ loading: isDeleting }}
        maskClosable={false}
        keyboard={true}
      >
        <p>
          Are you sure you want to delete {selectedRows.length} selected special offer
          {selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default SpecialOfferTable;
