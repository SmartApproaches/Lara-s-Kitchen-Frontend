import { Button, Tag, Dropdown } from "antd";
import { Search01Icon, FilterIcon, Cancel01Icon, Upload04Icon } from "hugeicons-react";
import { useState } from "react";

import { Button as CustomButton } from "../../../../../components";

const CustomersHeader = ({ handleCSVExport }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const filterOptions = [
    { key: "highest_order", label: "Highest Order" },
    { key: "lowest_order", label: "Lowest Order" },
    { key: "all", label: "All" },
  ];  

  const handleFilterSelect = ({ key }) => {
    const selected = filterOptions.find((option) => option.key === key);
    if (selected) setSelectedFilter(selected.label);
  };

  const handleClearFilter = () => {
    setSelectedFilter(null);
  };

  const filterMenuItems = filterOptions.map((option) => ({
    key: option.key,
    label: option.label,
  }));

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black md:text-3xl lg:text-4xl">Customers</h1>
        <CustomButton
          size="lg"
          type="primary"
          onClick={handleCSVExport}
          leftIcon={<Upload04Icon strokeWidth={2} size={18} />}
        >
          Export
        </CustomButton>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pl-3">
            <Search01Icon size={19} strokeWidth={2} className="text-[#326137]" />
          </div>
          <input
            type="text"
            placeholder="Search by name"
            className="block w-full rounded-4xl bg-[#D2FFD9] py-3 pr-3 pl-6 font-medium text-[#0CA921] placeholder:text-base placeholder:text-[#0CA921] focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none md:text-[18px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedFilter && (
            <Tag
              style={{
                padding: "9px 20px",
                fontSize: "15px",
                color: "#222222",
                display: "flex",
                alignItems: "center",
              }}
              color="white"
              className="font-semibold"
              closable
              onClose={handleClearFilter}
              closeIcon={
                <span className="ml-2 cursor-pointer rounded-full bg-gray-200 p-1">
                  <Cancel01Icon size={14} />
                </span>
              }
            >
              {selectedFilter}
            </Tag>
          )}
          <Dropdown menu={{ items: filterMenuItems, onClick: handleFilterSelect }}>
            <Button
              icon={<FilterIcon size={20} />}
              className="text-primary border-none !bg-white !text-base"
            >
              Filter
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
