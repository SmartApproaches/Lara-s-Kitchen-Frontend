import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input, Skeleton } from "antd";
import { ArrowLeftOutlined, PhoneOutlined } from "@ant-design/icons";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import toast from "react-hot-toast";

import {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
} from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";

// Same key and libraries as the cashier's order panel, so the two Google Maps loads match.
const GOOGLE_MAPS_API_KEY = "AIzaSyAdj9yCjRwmShW7rJbvHlEcyfMsztXw_iE";
const MAP_LIBRARIES = ["places"];

const UK_PHONE = /^(\+44|0)\d{9,10}$/;
const cleanPhone = (value) => String(value ?? "").replace(/[\s\-()]/g, "");

// The backend keeps the pin to 6 decimal places (about 10 cm).
const round6 = (n) => Number(Number(n).toFixed(6));
const toPin = (lat, lng) => {
  const la = Number(lat);
  const ln = Number(lng);
  return lat != null && lng != null && Number.isFinite(la) && Number.isFinite(ln)
    ? { lat: round6(la), lng: round6(ln) }
    : null;
};

// Sunderland, used only to centre the map when no pin is saved yet.
const FALLBACK_CENTER = { lat: 54.904249, lng: -1.37729 };

const EMPTY = { name: "", phone: "", address: "", city: "", postcode: "" };

const Card = ({ title, children, hint }) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    {title && <h2 className="mb-1 text-base font-semibold text-gray-900">{title}</h2>}
    {hint && <p className="mb-4 text-sm text-gray-500">{hint}</p>}
    {children}
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <span className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
    {children}
  </div>
);

const RestaurantSettings = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAppSettingsQuery();
  const [updateAppSettings, { isLoading: isSaving }] = useUpdateAppSettingsMutation();
  const { isLoaded: mapsLoaded, loadError: mapsError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  const [form, setForm] = useState(EMPTY);
  const [initial, setInitial] = useState({ ...EMPTY, pin: null });
  const [pin, setPin] = useState(null);
  const [isFinding, setIsFinding] = useState(false);

  useEffect(() => {
    const s = data?.data;
    if (!s) return;
    const loaded = {
      name: s.restaurant_name ?? "",
      phone: s.restaurant_phone ?? "",
      address: s.restaurant_address ?? "",
      city: s.restaurant_city ?? "",
      postcode: s.restaurant_postcode ?? "",
    };
    const savedPin = toPin(s.restaurant_latitude, s.restaurant_longitude);
    setForm(loaded);
    setInitial({ ...loaded, pin: savedPin });
    setPin(savedPin);
  }, [data]);

  // Whether SmartEatX riders can be booked, from what's saved (not what's being typed).
  const missing = useMemo(() => {
    const list = [];
    if (!initial.phone) list.push("phone number");
    if (!initial.address) list.push("address");
    if (!initial.pin) list.push("map pin");
    return list;
  }, [initial]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Looks up the typed address and moves the pin there.
  const findOnMap = () => {
    const query = [form.address, form.city, form.postcode]
      .map((v) => v.trim())
      .filter(Boolean)
      .join(", ");
    if (!query) {
      toast.error("Type the address first.");
      return;
    }
    if (!window.google?.maps) {
      toast.error("The map hasn't loaded yet. Try again in a moment.");
      return;
    }
    setIsFinding(true);
    new window.google.maps.Geocoder().geocode(
      { address: query, region: "uk" },
      (results, status) => {
        setIsFinding(false);
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setPin({ lat: round6(lat()), lng: round6(lng()) });
          toast.success("Pin moved. Drag it onto the door riders use.");
        } else {
          toast.error("We couldn't find that address on the map. Drag the pin instead.");
        }
      },
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("The restaurant name can't be empty.");
      return;
    }
    if (!form.address.trim()) {
      toast.error("The street address can't be empty.");
      return;
    }
    const phone = cleanPhone(form.phone);
    if (phone && !UK_PHONE.test(phone)) {
      toast.error("The phone number must be a UK number, such as +447911123456");
      return;
    }

    // Send only what changed.
    const changes = {};
    if (form.name.trim() !== initial.name) changes.restaurant_name = form.name.trim();
    if (phone !== cleanPhone(initial.phone)) changes.restaurant_phone = phone;
    if (form.address.trim() !== initial.address) changes.restaurant_address = form.address.trim();
    if (form.city.trim() !== initial.city) changes.restaurant_city = form.city.trim();
    if (form.postcode.trim() !== initial.postcode)
      changes.restaurant_postcode = form.postcode.trim();
    if (pin && (pin.lat !== initial.pin?.lat || pin.lng !== initial.pin?.lng)) {
      changes.restaurant_latitude = round6(pin.lat);
      changes.restaurant_longitude = round6(pin.lng);
    }

    if (Object.keys(changes).length === 0) {
      toast("No changes to save");
      return;
    }

    try {
      const res = await updateAppSettings(changes).unwrap();
      toast.success(res?.message || "Restaurant details saved");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save the restaurant details");
    }
  };

  const header = (
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/business-suite")}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          aria-label="Back"
        >
          <ArrowLeftOutlined className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Restaurant</h1>
          <p className="text-sm text-gray-500">Where riders collect orders</p>
        </div>
      </div>
      {!isLoading && !error && (
        <div className="flex gap-3">
          <Button onClick={() => navigate(-1)} className="h-10 rounded-lg px-6">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={isSaving}
            className="h-10 rounded-lg !bg-[#1F5226] px-6 hover:!bg-[#0d5729]"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        {header}
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        {header}
        <Alert
          type="error"
          showIcon
          message={error?.data?.message || "Error loading the restaurant details"}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {header}

      {missing.length === 0 ? (
        <Alert type="success" showIcon className="!mb-4" message="SmartEatX riders: ready" />
      ) : (
        <Alert
          type="warning"
          showIcon
          className="!mb-4"
          message={`SmartEatX riders can't be booked until the ${missing.join(" and ")} ${
            missing.length === 1 ? "is" : "are"
          } set`}
        />
      )}

      <div className="space-y-4">
        <Card title="Details riders see">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Restaurant name" required>
              <Input size="large" value={form.name} onChange={set("name")} />
            </Field>
            <Field label="Phone number">
              <Input
                size="large"
                type="tel"
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="+44 7911 123456"
                value={form.phone}
                onChange={set("phone")}
              />
              <span className="mt-1 block text-xs text-gray-400">
                Riders call this when they can&apos;t find you or the order isn&apos;t ready.
              </span>
            </Field>
            <div className="md:col-span-2">
              <Field label="Street address" required>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    size="large"
                    value={form.address}
                    onChange={set("address")}
                    className="sm:flex-1"
                  />
                  <Button
                    size="large"
                    onClick={findOnMap}
                    loading={isFinding}
                    disabled={!mapsLoaded}
                    className="rounded-lg border-[#157F3B] !text-[#157F3B]"
                  >
                    Find on map
                  </Button>
                </div>
              </Field>
            </div>
            <Field label="City">
              <Input size="large" value={form.city} onChange={set("city")} />
            </Field>
            <Field label="Postcode">
              <Input size="large" value={form.postcode} onChange={set("postcode")} />
            </Field>
          </div>
        </Card>

        <Card
          title="Map pin"
          hint="Put the pin on the door riders use. SmartEatX riders must be within 200 metres of it to confirm they've arrived."
        >
          {mapsError ? (
            <Alert type="error" showIcon message="The map couldn't load. Check your connection." />
          ) : !mapsLoaded ? (
            <Skeleton.Node active className="!h-80 !w-full" />
          ) : (
            <div className="overflow-hidden rounded-lg">
              <GoogleMap
                center={pin ?? FALLBACK_CENTER}
                zoom={pin ? 18 : 14}
                mapContainerStyle={{ height: 320, width: "100%" }}
                options={{
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: false,
                }}
                onClick={(e) =>
                  !pin && setPin({ lat: round6(e.latLng.lat()), lng: round6(e.latLng.lng()) })
                }
              >
                {pin && (
                  <MarkerF
                    position={pin}
                    draggable
                    onDragEnd={(e) =>
                      setPin({ lat: round6(e.latLng.lat()), lng: round6(e.latLng.lng()) })
                    }
                  />
                )}
              </GoogleMap>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <span>
              Latitude:{" "}
              <span className="font-mono text-gray-900">{pin ? pin.lat.toFixed(6) : "—"}</span>
            </span>
            <span>
              Longitude:{" "}
              <span className="font-mono text-gray-900">{pin ? pin.lng.toFixed(6) : "—"}</span>
            </span>
            {!pin && (
              <span className="text-amber-600">
                Click the map or use Find on map to place the pin.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantSettings;
