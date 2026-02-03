import React, { useState, useEffect } from "react";
import { Table, Skeleton, Alert, Checkbox, Modal, Tag } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { IMAGES } from "../../../../../constants";

const PermissionsTable = ({
  permissions,
  isLoading,
  isError,
  onEdit,
  onDelete,
  isDeleting,
  pagination,
  onPageChange,
}) => {
  const [permissionsData, setPermissionsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);

  useEffect(() => {
    if (permissions) {
      setPermissionsData(permissions);
      setSelectedRows([]);
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
      const allIds = permissionsData?.map((item) => item?.id) || [];
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
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
    try {
      if (recordToDelete && onDelete) {
        await onDelete(recordToDelete.id);
      }
    } catch (error) {
    } finally {
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    }
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
    try {
      if (onDelete) {
        await onDelete(selectedRows);
      }
      setSelectedRows([]);
    } catch (error) {
    } finally {
      setBulkDeleteModalVisible(false);
    }
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
        return "green";
    }
  };

  const allIds = permissionsData?.map((item) => item?.id) || [];
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
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.includes(record?.id)}
          onChange={(e) => handleRowSelect(record?.id, e.target.checked)}
        />
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      className: ["font-medium", "capitalize"],
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      className: "font-medium",
    },
    {
      title: "ROLE",
      dataIndex: "role",
      className: ["font-medium", "capitalize"],
      render: (roleObj) => roleObj?.name || "N/A",
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
          {status || "Inactive"}
        </Tag>
      ),
    },
    {
      title: "DATE ADDED",
      dataIndex: "created_at",
      className: "font-medium",
      render: (created_at) => (created_at ? new Date(created_at).toLocaleString() : "N/A"),
    },
    {
      title: "LAST UPDATED",
      dataIndex: "updated_at",
      className: "font-medium",
      render: (updated_at) => (updated_at ? new Date(updated_at).toLocaleString() : "N/A"),
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
            <HugeiconsIcon icon={Edit02Icon} size={20} />
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
        <Alert type="error" message="Failed to load permissions" />
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
        {!permissions?.length ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Permissions" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">Sorry Nothing Here!!!</h3>
            <p>Add a new permission to get started</p>
          </div>
        ) : (
          <Table
            dataSource={permissionsData}
            columns={columns}
            rowKey="id"
            pagination={{
              current: pagination?.current || 1,
              pageSize: pagination?.pageSize || 10,
              total: pagination?.total || 0,
              showSizeChanger: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page) => onPageChange(page),
            }}
            className="custom-table min-w-[1000px]"
          />
        )}
      </div>

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
              <p className="font-medium text-gray-900">{recordToDelete?.name}</p>
              <p className="text-sm text-gray-600">Email: {recordToDelete?.email}</p>
              <p className="text-sm text-gray-600">Role: {recordToDelete?.role?.name || "N/A"}</p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <Tag color={getStatusColor(recordToDelete?.status)} className="ml-1 capitalize">
                  {recordToDelete.status}
                </Tag>
              </p>
              <p className="text-sm text-gray-600">
                Added: {new Date(recordToDelete?.created_at).toLocaleString()}
              </p>
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
