import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CatalogueHeader from "./_components/CatalogueHeader";
import SearchAndButton from "./_components/SearchAndButton";
import CatalogueTable from "./_components/CatalogueTable";
import {
  useDeleteCatalogueItemMutation,
  useGetCatalogueQuery,
} from "../../../../redux/slices/super-admin/catalogueApiSlice";

const Catalogue = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    data: catalogue,
    isLoading,
    isError,
  } = useGetCatalogueQuery({
    page: currentPage,
    search: debouncedSearch,
  });

  const [deleteCatalogueItem, { isLoading: isDeleting, error: deleteError }] =
    useDeleteCatalogueItemMutation();

  const catalogueData = useMemo(() => {
    const rawData = catalogue?.data?.data || [];
    return rawData.map((item) => ({
      id: item?.id,
      name: item?.name,
      category: item?.category?.name || "N/A",
      price: `£${parseFloat(item?.sizes?.map((size) => size.price)[0] || 0).toFixed(2)}`,
      description: item?.description || "No description",
      image: item?.media?.url || "",
      availability: item?.availability === "in_stock" ? "In Stock" : "Out of Stock",
    }));
  }, [catalogue]);

  const pagination = {
    current: catalogue?.data?.current_page || 1,
    pageSize: catalogue?.data?.per_page || 10,
    total: catalogue?.data?.total || 0,
    lastPage: catalogue?.data?.last_page || 1,
  };

  const handleDeleteCatalogueItem = async (itemIds) => {
    try {
      const idsToDelete = Array.isArray(itemIds) ? itemIds : [itemIds];

      for (const id of idsToDelete) {
        await deleteCatalogueItem(id).unwrap();
      }

      toast.success(
        idsToDelete.length > 1
          ? `${idsToDelete.length} catalogue items deleted successfully!`
          : "Catalogue item deleted successfully!",
      );
    } catch (error) {
      const errorMessage =
        typeof error?.data?.message === "string"
          ? error.data.message
          : "Failed to delete catalogue item.";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError?.data?.message || "Failed to delete catalogue item.");
    }
  }, [deleteError]);

  return (
    <>
      <CatalogueHeader />
      <SearchAndButton searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CatalogueTable
        catalogue={catalogueData}
        isLoading={isLoading}
        isDeleting={isDeleting}
        isError={isError}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onDelete={handleDeleteCatalogueItem}
      />
    </>
  );
};

export default Catalogue;
