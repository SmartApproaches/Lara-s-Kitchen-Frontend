import React, { useState, useEffect } from "react";
import { Table, Skeleton, Alert, Checkbox, Modal } from "antd";
import { ArrowLeft01Icon, ArrowRight01Icon, Delete01Icon, Edit02Icon } from "hugeicons-react";

import { IMAGES } from "../../../../../constants";

const SpecialOfferTable = ({ specialOffer, isLoading, isError, onEdit, onDelete, isDeleting }) => {
  const [page, setPage] = useState(1);
  const [specialOfferData, setSpecialOfferData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const pageSize = 5;
  const totalPages = Math.ceil((specialOfferData?.length || 0) / pageSize);

  useEffect(() => {
    if (specialOffer) {
      setSpecialOfferData(specialOffer);
    }
  }, [specialOffer]);

  const handleRowSelect = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const currentPageData = specialOfferData?.slice((page - 1) * pageSize, page * pageSize);
      const currentPageIds = currentPageData?.map((item) => item.id) || [];
      setSelectedRows([...new Set([...selectedRows, ...currentPageIds])]);
    } else {
      const currentPageData = specialOfferData?.slice((page - 1) * pageSize, page * pageSize);
      const currentPageIds = currentPageData?.map((item) => item.id) || [];
      setSelectedRows(selectedRows.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const handleDelete = (record) => {
    console.log("Delete button clicked for:", record);
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete && onDelete) {
      console.log("Delete confirmed for:", recordToDelete.id);
      onDelete(recordToDelete.id);
    }
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleCancelDelete = () => {
    console.log("Delete cancelled");
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      return;
    }
    setBulkDeleteModalVisible(true);
  };

  const handleConfirmBulkDelete = () => {
    if (onDelete) {
      onDelete(selectedRows);
      setSelectedRows([]);
    }
    setBulkDeleteModalVisible(false);
  };

  const handleCancelBulkDelete = () => {
    console.log("Bulk delete cancelled");
    setBulkDeleteModalVisible(false);
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={specialOfferData
            ?.slice((page - 1) * pageSize, page * pageSize)
            .every((item) => selectedRows.includes(item.id))}
          indeterminate={
            specialOfferData
              ?.slice((page - 1) * pageSize, page * pageSize)
              .some((item) => selectedRows.includes(item.id)) &&
            !specialOfferData
              ?.slice((page - 1) * pageSize, page * pageSize)
              .every((item) => selectedRows.includes(item.id))
          }
        />
      ),
      dataIndex: "select",
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.includes(record.id)}
          onChange={(e) => handleRowSelect(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      className: "font-medium",
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percentage",
      className: "font-medium",
    },
    {
      title: "START DATE AND TIME",
      dataIndex: "startDateTime",
      className: "font-medium",
      render: (dateTime) => (
        <div className="flex items-center gap-2">
          <span>{dateTime?.date}</span>
          <span className="text-gray-500">•</span>
          <span>{dateTime?.time}</span>
        </div>
      ),
    },
    {
      title: "END DATE AND TIME",
      dataIndex: "endDateTime",
      className: "font-medium",
      render: (dateTime) => (
        <div className="flex items-center gap-2">
          <span>{dateTime?.date}</span>
          <span className="text-gray-500">•</span>
          <span>{dateTime?.time}</span>
        </div>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      className: "font-medium",
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
            <Edit02Icon size={20} />
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
            <Delete01Icon size={20} />
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

  const paginatedData = specialOfferData?.slice((page - 1) * pageSize, page * pageSize);

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
        {!specialOffer?.length ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Special Offers" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">Sorry Nothing Here!!!</h3>
            <p>Add a new special offer to get started</p>
          </div>
        ) : (
          <Table
            dataSource={paginatedData}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="custom-table min-w-[1000px]"
          />
        )}
      </div>

      {specialOffer?.length > 0 && (
        <div className="mt-4 flex items-center justify-between font-semibold text-gray-600">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            <ArrowLeft01Icon strokeWidth={2} size={20} />
          </button>
          <span className="text-base">
            {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            <ArrowRight01Icon strokeWidth={2} size={20} />
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
              <p className="font-medium text-gray-900">{recordToDelete.description}</p>
              <p className="text-sm text-gray-600">{recordToDelete.percentage}</p>
              <p className="text-sm text-gray-600">
                {recordToDelete.startDateTime?.date} {recordToDelete.startDateTime?.time} -{" "}
                {recordToDelete.endDateTime?.date} {recordToDelete.endDateTime?.time}
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
