import React, { useState, useEffect } from "react";
import { Table, Skeleton, Alert, Checkbox, Modal, Tag } from "antd";
import { ArrowLeft01Icon, ArrowRight01Icon, Delete01Icon, Edit02Icon } from "hugeicons-react";
import { IMAGES } from "../../../../../constants";

const PermissionsTable = ({ permissions, isLoading, isError, onEdit, onDelete, isDeleting }) => {
  const [page, setPage] = useState(1);
  const [permissionsData, setPermissionsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const pageSize = 5;
  const totalPages = Math.ceil((permissionsData?.length || 0) / pageSize);

  useEffect(() => {
    if (permissions) {
      setPermissionsData(permissions);
    }
  }, [permissions]);

  const handleRowSelect = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const currentPageData = permissionsData?.slice((page - 1) * pageSize, page * pageSize);
      const currentPageIds = currentPageData?.map((item) => item.id) || [];
      setSelectedRows([...new Set([...selectedRows, ...currentPageIds])]);
    } else {
      const currentPageData = permissionsData?.slice((page - 1) * pageSize, page * pageSize);
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
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete && onDelete) {
      onDelete(recordToDelete.id);
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

  const handleConfirmBulkDelete = () => {
    if (onDelete) {
      onDelete(selectedRows);
      setSelectedRows([]);
    }
    setBulkDeleteModalVisible(false);
  };

  const handleCancelBulkDelete = () => {
    setBulkDeleteModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={permissionsData
            ?.slice((page - 1) * pageSize, page * pageSize)
            .every((item) => selectedRows.includes(item.id))}
          indeterminate={
            permissionsData
              ?.slice((page - 1) * pageSize, page * pageSize)
              .some((item) => selectedRows.includes(item.id)) &&
            !permissionsData
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
      title: "NAME",
      dataIndex: "name",
      className: "font-medium",
    },
    {
      title: "ROLE",
      dataIndex: "role",
      className: "font-medium",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      className: "font-medium",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          className="!rounded-[11px] !p-1 !px-4 capitalize sm:!text-base"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "DATE ADDED",
      dataIndex: "dateAdded",
      className: "font-medium",
    },
    {
      title: "LAST UPDATED",
      dataIndex: "lastUpdated",
      className: "font-medium",
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
            title="Edit permission"
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
            title="Delete permission"
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
        <Alert type="error" message="Failed to load permissions" />
      </div>
    );

  const paginatedData = permissionsData?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mt-8">
      {selectedRows.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm md:text-base">
          <span className="font-medium text-blue-800">
            {selectedRows.length} item{selectedRows.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="cursor-pointer rounded bg-red-500 px-3 py-1 md:py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            type="button"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {!permissions?.length ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Permissions" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">Sorry Nothing Here!!!</h3>
            <p>Add a new permission to get started</p>
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

      {permissions?.length > 0 && (
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
        title={
          <span style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>Delete Permission</span>
        }
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
          <p>Are you sure you want to delete this permission?</p>
          {recordToDelete && (
            <div className="mt-3 rounded bg-gray-50 p-3">
              <p className="font-medium text-gray-900">{recordToDelete.name}</p>
              <p className="text-sm text-gray-600">Role: {recordToDelete.role}</p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <Tag color={getStatusColor(recordToDelete.status)} className="ml-1 capitalize">
                  {recordToDelete.status}
                </Tag>
              </p>
              <p className="text-sm text-gray-600">Added: {recordToDelete.dateAdded}</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title={
          <span style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>
            {`Delete ${selectedRows.length} Permission${selectedRows.length > 1 ? "s" : ""}`}
          </span>
        }
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
          Are you sure you want to delete {selectedRows.length} selected permission
          {selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default PermissionsTable;
