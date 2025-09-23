import React, { useEffect, useState } from "react";
import { message } from "antd";
import toast from "react-hot-toast";

import SearchAndButton from "./_components/SearchAndButton";
import SpecialOfferHeader from "./_components/SpecialOfferHeader";
import SpecialOfferTable from "./_components/SpecialOfferTable";
import SpecialOfferModal from "./_components/SpecialOfferModal";
import {
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} from "../../../../redux/slices/super-admin/specialOfferApiSlice";

const useSpecialOfferApi = () => {
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
            description: "Abula 50% offer",
            percentage: "50% off",
            startDateTime: { date: "06/09/2025", time: "01:00 pm" },
            endDateTime: { date: "11/09/2025", time: "01:00 pm" },
          },
          {
            id: "2",
            description: "Jollof rice 10% offer",
            percentage: "10% off",
            startDateTime: { date: "06/09/2025", time: "01:00 pm" },
            endDateTime: { date: "11/09/2025", time: "01:00 pm" },
          },
          {
            id: "3",
            description: "Christmas 50% Offer",
            percentage: "50% off",
            startDateTime: { date: "06/09/2025", time: "01:00 pm" },
            endDateTime: { date: "11/09/2025", time: "01:00 pm" },
          },
          {
            id: "4",
            description: "Easter Special offer",
            percentage: "10% off",
            startDateTime: { date: "06/09/2025", time: "01:00 pm" },
            endDateTime: { date: "11/09/2025", time: "01:00 pm" },
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

const SpecialOffer = () => {
  const { data: specialOffer, isLoading, isError } = useSpecialOfferApi();
  const [deleteOffer, { isLoading: isDeleting, error: deleteError }] = useDeleteOfferMutation();
  const [createOffer, { isLoading: isCreating, error: createError }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating, error: updateError }] = useUpdateOfferMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (createError) toast.error(createError?.data?.message || "Failed to create special offer");
    if (updateError) toast.error(updateError?.data?.message || "Failed to update special offer");
    if (deleteError) toast.error(deleteError?.data?.message || "Failed to delete special offer");
  }, [createError, updateError, deleteError]);

  const handleCreateOffer = () => {
    setEditingOffer(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleSubmitOffer = async (offerData) => {
    try {
      if (isEditMode && editingOffer) {
        await updateOffer({ id: editingOffer.id, ...offerData }).unwrap();
        toast.success("Special offer updated successfully!");
      } else {
        await createOffer(offerData).unwrap();
        toast.success("Special offer created successfully!");
      }
      setModalVisible(false);
      setEditingOffer(null);
      setIsEditMode(false);
    } catch {}
  };

  const handleDeleteOffer = async (offerIds) => {
    try {
      const idsToDelete = Array.isArray(offerIds) ? offerIds : [offerIds];
      await Promise.all(idsToDelete.map((id) => deleteOffer(id).unwrap()));
      toast.success(
        idsToDelete.length > 1
          ? `${idsToDelete.length} special offers deleted successfully!`
          : "Special offer deleted successfully!",
      );
    } catch {}
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingOffer(null);
    setIsEditMode(false);
  };

  return (
    <div>
      <SpecialOfferHeader />
      <SearchAndButton onCreateOffer={handleCreateOffer} />

      <SpecialOfferTable
        specialOffer={specialOffer}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEditOffer}
        onDelete={handleDeleteOffer}
        isDeleting={isDeleting}
      />

      <SpecialOfferModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitOffer}
        editData={editingOffer}
        isEditMode={isEditMode}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
};

export default SpecialOffer;
