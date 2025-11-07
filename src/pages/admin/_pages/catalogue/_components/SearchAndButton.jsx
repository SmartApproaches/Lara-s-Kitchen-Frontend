import React from "react";
import { Link } from "react-router-dom";
import { PlusSignIcon, Search01Icon } from "hugeicons-react";

import { Button } from "../../../../../components";

const SearchAndButton = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pl-3">
          <Search01Icon size={19} strokeWidth={2} className="text-[#326137]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name"
          className="block w-full rounded-4xl bg-[#D2FFD9] py-3 pr-3 pl-6 font-medium text-[#0CA921] placeholder:text-base placeholder:text-[#0CA921] focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none md:text-[18px]"
        />
      </div>

      <Link className="w-full justify-end md:flex" to="/admin/catalogue/add-new-food">
        <Button
          size="lg"
          className="w-full md:w-fit"
          leftIcon={<PlusSignIcon strokeWidth={2} size={18} />}
        >
          Add new food
        </Button>
      </Link>
    </div>
  );
};

export default SearchAndButton;
