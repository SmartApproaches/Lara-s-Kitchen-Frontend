import { useState, useEffect } from "react";
import { Input } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";

const CityInput = ({ value, onSelect, disabled }) => {
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSelect) {
      onSelect({ address: val });
    }
  };

  return (
    <div className="relative w-full">
      <Input
        value={query}
        disabled={disabled}
        placeholder="Enter city name"
        size="large"
        allowClear
        suffix={<HugeiconsIcon icon={Location01Icon} size={20} className="text-gray-600" />}
        onChange={handleChange}
        className="text-black/60!"
        style={{
          backgroundColor: "#f5f5f5",
          border: "none",
          height: "48px",
          fontWeight: 500,
        }}
      />
    </div>
  );
};

export default CityInput;
