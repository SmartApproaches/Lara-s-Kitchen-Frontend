import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CatalogueHeader from "./_components/CatalogueHeader";
import SearchAndButton from "./_components/SearchAndButton";
import CatalogueTable from "./_components/CatalogueTable";
import { useDeleteCatalogueItemMutation } from "../../../../redux/slices/super-admin/catalogueApiSlice";

const useCatalogueApi = () => {
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
            image: "https://via.placeholder.com/80x80.png?text=Amala",
            name: "Amala with Ewedu",
            category: "Dine In",
            price: "£12.00",
            description: "Delicious Amala served with Ewedu soup and assorted meats.",
            availability: "Available",
          },
          {
            id: "2",
            image: "https://via.placeholder.com/80x80.png?text=Semo",
            name: "Semo with Egusi",
            category: "Online",
            price: "£15.00",
            description: "Smooth Semo paired with thick Egusi soup, spicy and tasty.",
            availability: "Out of Stock",
          },
          {
            id: "3",
            image: "https://via.placeholder.com/80x80.png?text=Rice",
            name: "Jollof Rice",
            category: "Pick Up",
            price: "£10.00",
            description: "Classic Nigerian Jollof rice served with chicken and plantain.",
            availability: "Available",
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

  return { data, isLoading, isError };
};

const Catalogue = () => {
  const { data: catalogue, isLoading, isError } = useCatalogueApi();
  const [deleteCatalogueItem, { isLoading: isDeleting, error: deleteError }] =
    useDeleteCatalogueItemMutation();

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError?.data?.message || "Failed to delete catalogue item.");
    }
  }, [deleteError]);

  const handleDeleteCatalogueItem = async (itemIds) => {
    try {
      const idsToDelete = Array.isArray(itemIds) ? itemIds : [itemIds];
      await Promise.all(idsToDelete.map((id) => deleteCatalogueItem(id).unwrap()));
      toast.success(
        idsToDelete.length > 1
          ? `${idsToDelete.length} catalogue items deleted successfully!`
          : "Catalogue item deleted successfully!",
      );
    } catch {}
  };

  return (
    <>
      <CatalogueHeader />
      <SearchAndButton />
      <CatalogueTable
        catalogue={catalogue}
        isLoading={isLoading}
        isDeleting={isDeleting}
        isError={isError}
        onDelete={handleDeleteCatalogueItem}
      />
    </>
  );
};

export default Catalogue;
