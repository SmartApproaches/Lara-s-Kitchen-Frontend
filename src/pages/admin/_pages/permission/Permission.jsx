import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SearchAndButton from "./_components/SearchAndButton";
import PermissionHeader from "./_components/PermissionsHeader";
import PermissionsTable from "./_components/PermissionsTable";
import PermissionsModal from "./_components/PermissionsModal";
import PermissionSuccessModal from "./_components/PermissionSuccessModal";
import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
  useGetPermissionsQuery,
} from "../../../../redux/slices/super-admin/permissionsApiSlice";

const Permission = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successData, setSuccessData] = useState({
    userName: "",
    userRole: "",
    isEditMode: false,
  });

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = useGetPermissionsQuery({
    page: currentPage,
  });
  const [deletePermission, { isLoading: isDeleting, error: deleteError }] =
    useDeletePermissionMutation();
  const [createPermission, { isLoading: isCreating, error: createError }] =
    useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating, error: updateError }] =
    useUpdatePermissionMutation();

  const allPermissions = useMemo(() => permissionsData?.data?.data || [], [permissionsData]);

  const filteredPermissions = useMemo(() => {
    if (!debouncedSearch) return allPermissions;

    const searchLower = debouncedSearch.toLowerCase();
    return allPermissions.filter((permission) => {
      const name = permission?.name?.toLowerCase() || "";
      const email = permission?.email?.toLowerCase() || "";
      const role = permission?.role?.name?.toLowerCase() || "";
      const status = permission?.status?.toLowerCase() || "";

      return (
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        role.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  }, [allPermissions, debouncedSearch]);
  const permissions = filteredPermissions;
  const pagination = {
    current: permissionsData?.data?.current_page || 1,
    pageSize: permissionsData?.data?.per_page || 10,
    total: debouncedSearch ? filteredPermissions.length : permissionsData?.data?.total || 0,
    lastPage: permissionsData?.data?.last_page || 1,
  };

  const handleCreatePermission = () => {
    setEditingPermission(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleSubmitPermission = async (permissionData) => {
    try {
      if (isEditMode && editingPermission) {
        await updatePermission({
          id: editingPermission.id,
          ...permissionData,
        }).unwrap();

        setSuccessData({
          userName: permissionData?.name || editingPermission?.name,
          userRole: permissionData?.role || editingPermission?.role?.name,
          isEditMode: true,
        });
      } else {
        await createPermission(permissionData).unwrap();

        setSuccessData({
          userName: permissionData.name,
          userRole: permissionData.role,
          isEditMode: false,
        });
      }

      setModalVisible(false);
      setEditingPermission(null);
      setIsEditMode(false);
      setSuccessModalVisible(true);
    } catch (error) {}
  };

  const handleDeletePermission = async (permissionIds) => {
    try {
      const idsToDelete = Array.isArray(permissionIds) ? permissionIds : [permissionIds];
      await Promise.all(idsToDelete.map((id) => deletePermission(id).unwrap()));

      toast.success(
        idsToDelete.length > 1
          ? `${idsToDelete.length} permissions deleted successfully!`
          : "Permission deleted successfully!",
      );

      const remainingItems = pagination.total - idsToDelete.length;
      const itemsOnCurrentPage = permissions.length - idsToDelete.length;

      if (itemsOnCurrentPage <= 0 && currentPage > 1 && remainingItems > 0) {
        setCurrentPage(1);
      }
    } catch {}
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingPermission(null);
    setIsEditMode(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSuccessData({ userName: "", userRole: "", isEditMode: false });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (createError) toast.error(createError?.data?.message || "Failed to create permission");
    if (updateError) toast.error(updateError?.data?.message || "Failed to update permission");
    if (deleteError) toast.error(deleteError?.data?.message || "Failed to delete permission");
  }, [createError, updateError, deleteError]);

  return (
    <div>
      <PermissionHeader />
      <SearchAndButton
        searchQuery={searchQuery}
        onCreatePermission={handleCreatePermission}
        onSearchChange={handleSearchChange}
      />

      <PermissionsTable
        permissions={permissions}
        isLoading={isLoadingPermissions}
        isError={isErrorPermissions}
        onEdit={handleEditPermission}
        onDelete={handleDeletePermission}
        isDeleting={isDeleting}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <PermissionsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPermission}
        editData={editingPermission}
        isEditMode={isEditMode}
        isSubmitting={isCreating || isUpdating}
      />

      <PermissionSuccessModal
        visible={successModalVisible}
        onClose={handleCloseSuccessModal}
        userName={successData.userName}
        userRole={successData.userRole}
        isEditMode={successData.isEditMode}
      />
    </div>
  );
};

export default Permission;
