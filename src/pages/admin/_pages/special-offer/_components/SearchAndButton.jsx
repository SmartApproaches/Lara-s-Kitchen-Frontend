import React, { useState } from "react";
import { PlusSignIcon, Search02Icon } from "hugeicons-react";

import { Button } from "../../../../../components";

const SearchAndButton = ({ onCreateOffer, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddOffer = (offerData) => {
    if (onCreateOffer) {
      onCreateOffer(offerData);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pl-3">
            <Search02Icon size={19} className="text-green-700" />
          </div>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchInput}
            className="block w-full rounded-full bg-green-100 py-3 pr-12 pl-6 font-medium text-green-700 placeholder:text-base placeholder:text-green-700 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none md:text-lg"
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          leftIcon={<PlusSignIcon size={18} />}
          onClick={() => handleAddOffer(true)}
        >
          Special Offer
        </Button>
      </div>
    </>
  );
};

export default SearchAndButton;
