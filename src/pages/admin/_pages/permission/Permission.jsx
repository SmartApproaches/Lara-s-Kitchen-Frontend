import React, { useEffect, useState } from "react";
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
} from "../../../../redux/slices/super-admin/permissionsApiSlice";

const usePermissionApi = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      try {
        setData([
          {
            id: "1",
            name: "Julien Mike",
            email: "julien.mike@example.com",
            role: "Kitchen",
            status: "Active",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
          {
            id: "2",
            name: "Sade Mathew",
            email: "sade.mathew@example.com",
            role: "Cashier",
            status: "Inactive",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
          {
            id: "3",
            name: "Louis Daniel",
            email: "louis.daniel@example.com",
            role: "Rider",
            status: "Completed",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
          {
            id: "4",
            name: "Myrian James",
            email: "myrian.james@example.com",
            role: "Kitchen",
            status: "Inactive",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
          {
            id: "5",
            name: "Joyce Adedeji",
            email: "joyce.adedeji@example.com",
            role: "Rider",
            status: "Completed",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
          {
            id: "6",
            name: "Moyosore James",
            email: "moyosore.james@example.com",
            role: "Cashier",
            status: "Inactive",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
          {
            id: "7",
            name: "Adekeye Adeolu",
            email: "adekeye.adeolu@example.com",
            role: "Rider",
            status: "Completed",
            dateAdded: "01 Aug, 2025",
            lastUpdated: "01 Aug, 2025",
          },
        ]);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, isError, setData };
};

const Permission = () => {
  const { data: permissions, isLoading, isError } = usePermissionApi();
  const [deletePermission, { isLoading: isDeleting, error: deleteError }] =
    useDeletePermissionMutation();
  const [createPermission, { isLoading: isCreating, error: createError }] =
    useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating, error: updateError }] =
    useUpdatePermissionMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successData, setSuccessData] = useState({ userName: "", userRole: "", isEditMode: false });

  useEffect(() => {
    if (createError) toast.error(createError?.data?.message || "Failed to create permission");
    if (updateError) toast.error(updateError?.data?.message || "Failed to update permission");
    if (deleteError) toast.error(deleteError?.data?.message || "Failed to delete permission");
  }, [createError, updateError, deleteError]);

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
        await updatePermission({ id: editingPermission.id, ...permissionData }).unwrap();
        setSuccessData({
          userName: permissionData.name || editingPermission.name,
          userRole: permissionData.role || editingPermission.role,
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
    } catch {}
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

  return (
    <div>
      <PermissionHeader />
      <SearchAndButton onCreatePermission={handleCreatePermission} />

      <PermissionsTable
        permissions={permissions}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEditPermission}
        onDelete={handleDeletePermission}
        isDeleting={isDeleting}
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
