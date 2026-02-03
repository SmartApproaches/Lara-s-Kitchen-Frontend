import { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";

const AddressAutocomplete = ({ value, onSelect, disabled }) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  const search = async (val) => {
    setQuery(val);

    if (val.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${val}&addressdetails=1&limit=10&featuretype=city`,
      );
      const data = await res.json();
      const filteredData = data.filter((item) => {
        const type = item.type;
        const addressType = item.address?.city || item.address?.town || item.address?.village;
        return (
          type === "city" ||
          type === "town" ||
          type === "village" ||
          type === "administrative" ||
          addressType
        );
      });
      setResults(filteredData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div>
        <Input
          value={query || "Not specified"}
          disabled={disabled}
          placeholder="Enter city name"
          size="large"
          allowClear
          suffix={<HugeiconsIcon icon={Location01Icon} size={20} className="text-gray-600" />}
          onChange={(e) => search(e.target.value)}
          className="text-black/60!"
          style={{
            backgroundColor: "#f5f5f5",
            border: "none",
            height: "48px",
            fontWeight: 500,
          }}
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white shadow-lg">
          {results.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => {
                const cityName =
                  item.address?.city || item.address?.town || item.address?.village || item.name;
                onSelect({
                  address: cityName,
                  lat: Number(item.lat),
                  lng: Number(item.lon),
                });
                setQuery(cityName);
                setResults([]);
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              {item.address?.city || item.address?.town || item.address?.village || item.name}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="pointer-events-none absolute top-3 right-3 text-xs text-gray-400">
          Searching…
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
