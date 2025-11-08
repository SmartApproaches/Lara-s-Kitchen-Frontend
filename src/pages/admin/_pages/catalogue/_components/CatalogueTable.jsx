import { useState, useEffect } from "react";
import { Table, Skeleton, Alert, Image, Checkbox, Modal, Dropdown } from "antd";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete01Icon,
  Edit02Icon,
} from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import toast, { LoaderIcon } from "react-hot-toast";

import { IMAGES } from "../../../../../constants";
import { useEditCatalogueItemMutation } from "../../../../../redux/slices/super-admin/catalogueApiSlice";
import { customInfoToast } from "../../../../../utils/toast";

const CatalogueTable = ({
  catalogue,
  isLoading,
  pagination,
  isError,
  onDelete,
  isDeleting,
  currentPage,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const [catalogueData, setCatalogueData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState(null);

  const [editCatalogueItem] = useEditCatalogueItemMutation();

  useEffect(() => {
    if (catalogue) {
      setCatalogueData(catalogue);
      setSelectedRows([]);
    }
  }, [catalogue]);

  const handleRowSelect = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = catalogueData?.map((item) => item?.id) || [];
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleEdit = (record) => {
    if (!record || !record.id) return;
    navigate(`/admin/catalogue/add-new-food/${record.id}`);
  };

  const handleDelete = (record) => {
    if (!record || !record.id) return;
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

  const handleCancelBulkDelete = () => {
    setBulkDeleteModalVisible(false);
  };

  const handleAvailabilityChange = async (recordId, newStatus) => {
    const item = catalogueData.find((item) => item?.id === recordId);
    if (!item) return;

    if (item?.availability === newStatus) {
      customInfoToast(`Item is already marked as ${newStatus}`);
      return;
    }

    const newStatusText = newStatus === "In Stock" ? "in_stock" : "out_of_stock";
    setUpdatingAvailabilityId(recordId);

    try {
      const formData = new FormData();
      formData.append("availability", newStatusText);

      const result = await editCatalogueItem({
        id: recordId,
        data: formData,
      }).unwrap();

      if (result) {
        toast.success("Availability status updated successfully!");
      }
    } catch (error) {
      const errorMessage =
        typeof error?.data?.message === "string"
          ? error.data.message
          : "An error occurred while updating availability.";

      toast.error(errorMessage);
    } finally {
      setUpdatingAvailabilityId(null);
    }
  };

  const getAvailabilityItems = (record) => [
    {
      key: "In Stock",
      label: (
        <div
          onClick={() => handleAvailabilityChange(record?.id, "In Stock")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          In Stock
        </div>
      ),
    },
    {
      key: "Out of Stock",
      label: (
        <div
          onClick={() => handleAvailabilityChange(record?.id, "Out of Stock")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          Out of Stock
        </div>
      ),
    },
  ];

  const allIds = catalogueData?.map((item) => item?.id) || [];
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
      title: "IMAGE",
      dataIndex: "image",
      key: "image",
      width: 100,
      className: "font-medium",
      render: (src, record) => (
        <Image
          src={src || IMAGES?.emptyState}
          alt={record?.name || "food item"}
          width={60}
          height={60}
          className="rounded-lg object-cover"
          preview={false}
          fallback={IMAGES?.emptyState}
          onError={(e) => {
            e.target.src = IMAGES?.emptyState;
          }}
        />
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 150,
      className: "font-medium",
      render: (text) => <span className="capitalize">{text || "N/A"}</span>,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      width: 120,
      className: "font-medium",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      width: 100,
      className: "font-medium",
      render: (text) => <span className="font-semibold text-green-600">{text || "N/A"}</span>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 250,
      className: "font-medium",
      render: (text) => (
        <div
          className="max-w-xs capitalize overflow-hidden text-ellipsis whitespace-nowrap"
          title={text || ""}
        >
          {text || "No description available"}
        </div>
      ),
    },
    {
      title: "AVAILABILITY",
      dataIndex: "availability",
      key: "availability",
      width: 150,
      className: "font-medium",
      render: (status, record) => (
        <Dropdown
          menu={{ items: getAvailabilityItems(record) }}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
            {updatingAvailabilityId === record?.id ? (
              <LoaderIcon className="animate-spin text-gray-400" size={20} />
            ) : (
              <>
                <p
                  className={`m-0 font-semibold ${
                    status === "In Stock" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {status || "Unknown"}
                </p>
                <ArrowDown01Icon className="text-xs text-gray-400" size={16} />
              </>
            )}
          </div>
        </Dropdown>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      width: 100,
      fixed: "right",
      className: "font-medium",
      render: (_, record) => (
        <div className="flex gap-3">
          <button
            className="cursor-pointer transition-colors hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            title="Edit item"
            type="button"
          >
            <Edit02Icon size={20} />
          </button>
          <button
            className="cursor-pointer transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            title="Delete item"
            type="button"
            disabled={isDeleting}
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
        <Alert type="error" message="Failed to load catalogue" />
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
            className="rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 md:py-2"
            type="button"
            disabled={isDeleting}
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {!catalogue || catalogue?.length === 0 ? (
          <div className="col-span-3 mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Items" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">No Items Found</h3>
            <p>Items will appear here once they are added</p>
          </div>
        ) : (
          <Table
            dataSource={catalogueData}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={false}
            className="custom-table"
            scroll={{ x: 1200 }}
            bordered
          />
        )}
      </div>

      {catalogue && catalogue?.length > 0 && pagination && (
        <div className="mt-4 flex items-center justify-between font-semibold text-gray-600">
          <button
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            <ArrowLeft01Icon strokeWidth={2} size={20} />
          </button>
          <span className="text-base">
            Page {currentPage} of {pagination?.lastPage || 1}
          </span>
          <button
            disabled={currentPage === pagination?.lastPage || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="flex items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            <ArrowRight01Icon strokeWidth={2} size={20} />
          </button>
        </div>
      )}

      <Modal
        title="Delete Confirmation"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        okType="danger"
        okButtonProps={{ loading: isDeleting }}
        cancelText="Cancel"
        centered
        maskClosable={false}
        keyboard={true}
      >
        <div>
          <p className="text-base font-medium text-[#444444]">
            Are you sure you want to delete this food item?
          </p>
          {recordToDelete && (
            <div className="mt-3 rounded bg-gray-50 p-3">
              <div className="mb-2 flex items-center gap-3">
                <Image
                  src={recordToDelete?.image || IMAGES?.emptyState}
                  alt={recordToDelete?.name || "food item"}
                  width={50}
                  height={50}
                  className="rounded object-cover"
                  preview={false}
                  fallback={IMAGES?.emptyState}
                />
                <div>
                  <p className="mb-1 font-medium text-gray-900 capitalize">{recordToDelete?.name || "N/A"}</p>
                  <p className="text-sm text-gray-600">{recordToDelete?.category || "N/A"}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{recordToDelete?.price || "N/A"}</p>
              <p className="mt-1 capitalize text-sm text-gray-600">
                {recordToDelete?.description || "No description"}
              </p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title={`Delete ${selectedRows.length} Catalogue Item${selectedRows.length > 1 ? "s" : ""}`}
        open={bulkDeleteModalVisible}
        onOk={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
        okText="Delete All"
        okType="danger"
        okButtonProps={{ loading: isDeleting }}
        cancelText="Cancel"
        centered
        maskClosable={false}
        keyboard={true}
      >
        <p>
          Are you sure you want to delete {selectedRows.length} selected catalogue item
          {selectedRows.length > 1 ? "s" : ""}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default CatalogueTable;
