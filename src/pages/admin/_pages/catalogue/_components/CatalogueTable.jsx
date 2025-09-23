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

import { IMAGES } from "../../../../../constants";

const CatalogueTable = ({ catalogue, isLoading, isError, onDelete, isDeleting }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [catalogueData, setCatalogueData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const pageSize = 5;
  const totalPages = Math.ceil((catalogueData?.length || 0) / pageSize);

  useEffect(() => {
    if (catalogue) {
      setCatalogueData(catalogue);
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
      const currentPageData = catalogueData?.slice((page - 1) * pageSize, page * pageSize);
      const currentPageIds = currentPageData?.map((item) => item.id) || [];
      setSelectedRows([...new Set([...selectedRows, ...currentPageIds])]);
    } else {
      const currentPageData = catalogueData?.slice((page - 1) * pageSize, page * pageSize);
      const currentPageIds = currentPageData?.map((item) => item.id) || [];
      setSelectedRows(selectedRows.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleEdit = (record) => {
    navigate(`/admin/catalogue/add-new-food/${record.id}`);
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
    setBulkDeleteModalVisible(false);
  };

  const handleAvailabilityChange = (recordId, newStatus) => {
    setCatalogueData((prevData) =>
      prevData.map((item) => (item.id === recordId ? { ...item, availability: newStatus } : item)),
    );
  };

  const getAvailabilityItems = (record) => [
    {
      key: "In Stock",
      label: (
        <div
          onClick={() => handleAvailabilityChange(record.id, "In Stock")}
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
          onClick={() => handleAvailabilityChange(record.id, "Out of Stock")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          Out of Stock
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={catalogueData
            ?.slice((page - 1) * pageSize, page * pageSize)
            .every((item) => selectedRows.includes(item.id))}
          indeterminate={
            catalogueData
              ?.slice((page - 1) * pageSize, page * pageSize)
              .some((item) => selectedRows.includes(item.id)) &&
            !catalogueData
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
      title: "IMAGE",
      dataIndex: "image",
      className: "font-medium",
      render: (src) => (
        <Image
          src={src}
          alt="food item"
          width={60}
          height={60}
          className="rounded-lg object-cover"
          preview={false}
        />
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      className: "font-medium",
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      className: "font-medium",
    },
    {
      title: "PRICE",
      dataIndex: "price",
      className: "font-medium",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      className: "font-medium",
    },
    {
      title: "AVAILABILITY",
      dataIndex: "availability",
      className: "font-medium",
      render: (status, record) => (
        <Dropdown
          menu={{ items: getAvailabilityItems(record) }}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
            <p
              className={`m-0 font-semibold ${
                status === "In Stock" || status === "Available" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status === "Available" ? "In Stock" : status}
            </p>
            <ArrowDown01Icon className="text-xs text-gray-400" />
          </div>
        </Dropdown>
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
            title="Edit item"
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
            title="Delete item"
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
        <Alert type="error" message="Failed to load catalogue" />
      </div>
    );

  const paginatedData = catalogueData?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mt-8">
      {selectedRows.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm md:text-base">
          <span className="font-medium text-blue-800">
            {selectedRows.length} item{selectedRows.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600 md:py-2"
            type="button"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {catalogue?.length < 1 ? (
          <div className="col-span-3 mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Items" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">No Items Found</h3>
            <p>Items will appear here once they are added</p>
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

      {catalogue?.length > 0 && (
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
                  src={recordToDelete.image}
                  alt={recordToDelete.name}
                  width={50}
                  height={50}
                  className="rounded object-cover"
                  preview={false}
                />
                <div>
                  <p className="mb-1 font-medium text-gray-900">{recordToDelete.name}</p>
                  <p className="text-sm text-gray-600">{recordToDelete.category}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{recordToDelete.price}</p>
              <p className="mt-1 text-sm text-gray-600">{recordToDelete.description}</p>
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
