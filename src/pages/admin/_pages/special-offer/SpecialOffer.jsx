import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SearchAndButton from "./_components/SearchAndButton";
import SpecialOfferHeader from "./_components/SpecialOfferHeader";
import SpecialOfferTable from "./_components/SpecialOfferTable";
import SpecialOfferModal from "./_components/SpecialOfferModal";
import {
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useGetSpecialOffersQuery,
  useUpdateOfferMutation,
} from "../../../../redux/slices/super-admin/specialOfferApiSlice";
import { customInfoToast } from "../../../../utils/toast";

const SpecialOffer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: offer,
    isLoading: isLoadingOffer,
    error: isErrorOffer,
  } = useGetSpecialOffersQuery({ page: currentPage });
  const [deleteOffer, { isLoading: isDeleting, error: deleteError }] = useDeleteOfferMutation();
  const [createOffer, { isLoading: isCreating, error: createError }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating, error: updateError }] = useUpdateOfferMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const offerTableRef = React.createRef();

  const pagination = {
    current_page: offer?.data?.current_page,
    last_page: offer?.data?.last_page,
    per_page: offer?.data?.per_page,
    total: offer?.data?.total,
  };

  useEffect(() => {
    if (createError) toast.error(createError?.data?.message || "Failed to create special offer");
    if (updateError) toast.error(updateError?.data?.message || "Failed to update special offer");
    if (deleteError) toast.error(deleteError?.data?.message || "Failed to delete special offer");
    if (isErrorOffer) toast.error(isErrorOffer?.data?.message || "Failed to fetch special offers");
  }, [createError, updateError, deleteError, isErrorOffer]);

  const handleCreateOffer = () => {
    setEditingOffer(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const filteredOffers = useMemo(() => {
    return offer?.data?.data?.filter((offer) => {
      const matchesSearch = offer?.offer_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [offer, searchQuery]);

  const handleSubmitOffer = async (offerData) => {
    try {
      if (isEditMode && editingOffer) {
        const hasChanges =
          offerData.offer_name !== editingOffer.offer_name ||
          offerData.description !== editingOffer.description ||
          offerData.menu_item_id !== editingOffer.menu_item_id ||
          new Date(offerData.from_date).toISOString() !==
            new Date(editingOffer.from_date).toISOString() ||
          new Date(offerData.to_date).toISOString() !==
            new Date(editingOffer.to_date).toISOString() ||
          new Date(offerData.availability_date).toISOString() !==
            new Date(editingOffer.availability_date).toISOString();

        if (!hasChanges) {
          customInfoToast("No changes detected.");
          return;
        }

        await updateOffer({ id: editingOffer.id, ...offerData }).unwrap();
        toast.success("Special offer updated successfully!");
      } else {
        await createOffer(offerData).unwrap();
        toast.success("Special offer created successfully!");
      }

      handleCloseModal();
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
      <SearchAndButton onCreateOffer={handleCreateOffer} onSearchChange={handleSearchChange} />

      <SpecialOfferTable
        onEdit={handleEditOffer}
        onDelete={handleDeleteOffer}
        isDeleting={isDeleting}
        ref={offerTableRef}
        specialOffers={filteredOffers}
        isLoading={isLoadingOffer}
        isError={isErrorOffer}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
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
