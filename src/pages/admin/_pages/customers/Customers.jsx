import React, { useEffect, useState } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

import CustomersHeader from "./_components/CustomersHeader";
import CustomersCards from "./_components/CustomersCards";
import { useCSVExport } from "../../../../hooks/useCSVExport";
import { useGetCustomersQuery } from "../../../../redux/slices/super-admin/customersApiSlice";

const CustomersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState(null);

  const { data, isLoading, isError } = useGetCustomersQuery({
    page: currentPage,
    filter: customerFilter,
    search: debouncedSearch,
  });

  const { exportToCSV } = useCSVExport();

  const customers = data?.data?.data || [];
  const pagination = {
    current: data?.data?.current_page || 1,
    pageSize: data?.data?.per_page || 10,
    total: data?.data?.total || 0,
    lastPage: data?.data?.last_page || 1,
  };

  const handleFilterChange = (status) => {
    setCustomerFilter(status);
    setCurrentPage(1);
  };

  const handleCSVExport = () => {
    if (!customers.length) return;
    exportToCSV(customers, "customers.csv");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <CustomersHeader
        handleCSVExport={handleCSVExport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={handleFilterChange}
      />
      <CustomersCards customers={customers} isLoading={isLoading} isError={isError} />

      {!isLoading && !isError && customers.length > 0 && (
        <div className="mt-3 flex items-center justify-between font-semibold text-gray-600">
          <button
            disabled={currentPage === 1 || isLoading}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft01Icon strokeWidth={2} />
          </button>
          <span>
            {pagination.current} of {pagination.lastPage}
          </span>
          <button
            disabled={currentPage === pagination.lastPage || isLoading}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight01Icon strokeWidth={2} />
          </button>
        </div>
      )}
    </>
  );
};

export default CustomersPage;
