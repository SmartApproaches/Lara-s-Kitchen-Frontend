import React, { useEffect, useState } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

import CustomersHeader from "./_components/CustomersHeader";
import CustomersCards from "./_components/CustomersCards";
import { useCSVExport } from "../../../../hooks/useCSVExport";

const useGetCustomers = () => {
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
            id: 1,
            name: "Rose James",
            email: "rose@example.com",
            orders: 12,
            phone: "123-456-7890",
            spend: "£250.00",
          },
          {
            id: 2,
            name: "Junior Wale",
            email: "junior@example.com",
            orders: 5,
            phone: "987-654-3210",
            spend: "£90.00",
          },
          {
            id: 3,
            name: "Amaka Obi",
            email: "amaka@example.com",
            orders: 8,
            phone: "555-666-7777",
            spend: "£150.00",
          },
        ]);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, isError };
};

const CustomersPage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data, isLoading, isError } = useGetCustomers();
  const { exportToCSV } = useCSVExport();

  const totalPages = Math.ceil((data?.length || 0) / pageSize);

  const handleCSVExport = () => {
    if (!data) return;
    exportToCSV(data, "customers.csv");
  };

  return (
    <>
      <CustomersHeader handleCSVExport={handleCSVExport} />
      <CustomersCards customers={data} isLoading={isLoading} isError={isError} />

      {!isLoading && !isError && data && (
        <div className="mt-3 flex items-center justify-between font-semibold text-gray-600">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            <ArrowLeft01Icon strokeWidth={2} />
          </button>
          <span>
            {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            <ArrowRight01Icon strokeWidth={2} />
          </button>
        </div>
      )}
    </>
  );
};

export default CustomersPage;
