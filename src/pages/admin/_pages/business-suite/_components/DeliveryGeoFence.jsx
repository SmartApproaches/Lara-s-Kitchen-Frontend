import { useEffect, useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Clock01Icon, Delete01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Modal } from "antd";
import toast from "react-hot-toast";

import { customInfoToast } from "../../../../../utils/toast";

import {
  useDeleteGeofenceByTypeMutation,
  useGetGeofenceByTypeQuery,
  usePostGeofenceMutation,
  useUpdateGeofenceByTypeMutation,
} from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const resizeIcon = L.divIcon({
  className: "resize-handle",
  html: '<div style="width: 12px; height: 12px; background: white; border: 2px solid #22c55e; border-radius: 50%; cursor: move;"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
};

const DraggableMarker = ({ position, onDragEnd }) => {
  const [markerPos, setMarkerPos] = useState(position);
  const markerRef = useRef(null);

  useEffect(() => {
    setMarkerPos(position);
  }, [position]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const pos = marker.getLatLng();
        setMarkerPos(pos);
        onDragEnd(pos);
      }
    },
  };

  return <Marker position={markerPos} draggable eventHandlers={eventHandlers} ref={markerRef} />;
};

const ResizeHandle = ({ center, radius, onResize }) => {
  const [handlePos, setHandlePos] = useState(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const R = 6371000;
    const lat1 = (center.lat * Math.PI) / 180;
    const lng1 = (center.lng * Math.PI) / 180;
    const brng = (90 * Math.PI) / 180;
    const d = radius / R;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng),
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
      );

    setHandlePos({
      lat: (lat2 * 180) / Math.PI,
      lng: (lng2 * 180) / Math.PI,
    });
  }, [center, radius]);

  const eventHandlers = {
    drag() {
      const handle = handleRef.current;
      if (handle != null) {
        const pos = handle.getLatLng();
        const R = 6371000;
        const dLat = ((pos.lat - center.lat) * Math.PI) / 180;
        const dLon = ((pos.lng - center.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((center.lat * Math.PI) / 180) *
            Math.cos((pos.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        onResize(Math.round(distance));
      }
    },
  };

  if (!handlePos) return null;

  return (
    <Marker
      position={handlePos}
      icon={resizeIcon}
      draggable
      eventHandlers={eventHandlers}
      ref={handleRef}
    />
  );
};

const DeliveryGeoFence = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading: isLoadingGeofence,
    error: isErrorGeofence,
  } = useGetGeofenceByTypeQuery("delivery");
  const [postGeoFence, { isLoading, error: isErrorPost }] = usePostGeofenceMutation();
  const [updateGeofence, { isLoading: isLoadingUpdate }] = useUpdateGeofenceByTypeMutation();
  const [deleteGeofence, { isLoading: isLoadingDelete }] = useDeleteGeofenceByTypeMutation();

  const [fence, setFence] = useState({
    center: { lat: 0, lng: 0 },
    radius: 4000,
  });

  const geofenceData = data?.data;
  const updateGeofenceData = Object.keys(geofenceData || {}).length > 0;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [initialFence, setInitialFence] = useState(null);
  const [locationName, setLocationName] = useState("Location");
  const [nearbyPlaces, setNearbyPlaces] = useState({
    areas: [],
    landmarks: [],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isErrorPost) {
      toast.error(isErrorPost?.message || "Failed to save geofence");
    }
    if (isErrorGeofence) {
      toast.error(isErrorGeofence?.message || "Failed to load geofence");
    }
  }, [isErrorPost, isErrorGeofence]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${fence.center.lat}&lon=${fence.center.lng}&zoom=18&addressdetails=1`,
        );
        const data = await response.json();

        if (data.address) {
          const name =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            data.address.county ||
            "Location";
          setLocationName(name);
          setAddress(data.display_name);
        }

        const loadingToast = toast.loading("Fetching nearby areas and landmarks...");

        const radiusMeters = fence.radius;
        const overpassQuery = `
          [out:json][timeout:25];
          (
            node["name"](around:${radiusMeters},${fence.center.lat},${fence.center.lng});
            way["name"](around:${radiusMeters},${fence.center.lat},${fence.center.lng});
            relation["name"](around:${radiusMeters},${fence.center.lat},${fence.center.lng});
          );
          out body;
          >;
          out skel qt;
        `;

        const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: overpassQuery,
        });
        const overpassData = await overpassResponse.json();

        const areas = [];
        const landmarks = [];
        const seen = new Set();

        overpassData.elements.forEach((element) => {
          if (!element.tags || !element.tags.name) return;

          const name = element.tags.name;
          if (seen.has(name)) return;
          seen.add(name);

          const lat = element.lat || element.center?.lat;
          const lon = element.lon || element.center?.lon;
          if (!lat || !lon) return;

          const distance = calculateDistance(fence.center.lat, fence.center.lng, lat, lon);

          const tags = element.tags;

          if (
            tags.place &&
            ["suburb", "neighbourhood", "quarter", "district"].includes(tags.place)
          ) {
            areas.push({ name, distance, type: tags.place });
          } else if (
            tags.amenity ||
            tags.tourism ||
            tags.leisure ||
            tags.building === "stadium" ||
            tags.building === "university" ||
            tags.building === "college" ||
            tags.building === "hospital" ||
            tags.shop ||
            tags.historic
          ) {
            const type =
              tags.amenity ||
              tags.tourism ||
              tags.leisure ||
              tags.building ||
              tags.shop ||
              tags.historic;
            landmarks.push({ name, distance, type });
          }
        });

        const sortedAreas = areas.sort((a, b) => a.distance - b.distance).slice(0, 10);
        const sortedLandmarks = landmarks.sort((a, b) => a.distance - b.distance).slice(0, 15);

        setNearbyPlaces({
          areas: sortedAreas,
          landmarks: sortedLandmarks,
        });

        toast.success(`Found ${sortedAreas.length} areas and ${sortedLandmarks.length} landmarks`, {
          id: loadingToast,
        });
      } catch (err) {
        customInfoToast("No nearby places found");
      }
    };

    const debounce = setTimeout(fetchLocationData, 1000);
    return () => clearTimeout(debounce);
  }, [fence.center, fence.radius]);

  useEffect(() => {
    if (geofenceData) {
      const newCenter = {
        lat: parseFloat(geofenceData?.latitude),
        lng: parseFloat(geofenceData?.longitude),
      };
      const newRadius = geofenceData?.radius;

      const fenceData = {
        center: newCenter,
        radius: newRadius * 1000,
      };

      setFence(fenceData);
      setInitialFence(fenceData);
      setAddress(geofenceData?.address);
      setHasChanges(false);
    }
  }, [geofenceData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const loadingToast = toast.loading("Searching location...");

    const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
    const match = searchQuery.match(coordPattern);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const newCenter = { lat, lng };
        setFence((prev) => ({ ...prev, center: newCenter }));
        setHasChanges(true);
        toast.success("Location set from coordinates", { id: loadingToast });
      } else {
        toast.error("Invalid coordinates", { id: loadingToast });
      }
    } else {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        );
        const results = await response.json();

        if (results.length > 0) {
          const location = results[0];
          const newCenter = { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };

          setFence((prev) => ({ ...prev, center: newCenter }));
          setAddress(location.display_name);
          setHasChanges(true);
          toast.success("Location found", { id: loadingToast });
        } else {
          toast.error("Location not found", { id: loadingToast });
        }
      } catch (err) {
        toast.error("Failed to search location", { id: loadingToast });
      }
    }
  };

  const handleMarkerDragEnd = (newPos) => {
    const newCenter = { lat: newPos.lat, lng: newPos.lng };
    setFence((prev) => ({ ...prev, center: newCenter }));
    setHasChanges(true);
    toast.loading("Updating location data...", { duration: 2000 });
  };

  const handleRadiusChange = (newRadius) => {
    setFence((prev) => ({ ...prev, radius: newRadius }));
    setHasChanges(true);
    toast.loading("Updating coverage area...", { duration: 2000 });
  };

  const handleSave = async () => {
    if (!hasChanges) {
      customInfoToast("No changes to save");
      return;
    }

    const payload = {
      type: "delivery",
      latitude: fence.center.lat,
      longitude: fence.center.lng,
      radius: fence.radius / 1000,
      address: address,
    };

    try {
      if (updateGeofenceData) {
        await updateGeofence({ type: "delivery", data: payload }).unwrap();
        toast.success("Geofence updated successfully");
        setHasChanges(false);
        setInitialFence(fence);
      } else {
        await postGeoFence(payload).unwrap();
        toast.success("Geofence saved successfully");
        setHasChanges(false);
        setInitialFence(fence);
      }
    } catch (error) {
      toast.error(error.data?.message || "Failed to save geofence");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGeofence("delivery").unwrap();
      toast.success("Geofence deleted successfully");
      setIsDeleteModalOpen(false);
      navigate(-1);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete geofence");
    }
  };

  if (isLoadingGeofence) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-gray-600">Loading geofence data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="sticky top-0 z-[1100] border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold text-gray-900 sm:text-xl">Delivery Geofence</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {updateGeofenceData && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isLoadingDelete}
                className="flex items-center justify-center rounded-lg border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <HugeiconsIcon icon={Delete01Icon} className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isLoading || isLoadingUpdate}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              {isLoadingUpdate
                ? "Updating..."
                : isLoading
                  ? "Saving..."
                  : updateGeofenceData
                    ? "Update"
                    : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row-reverse">
        <div className="relative h-[105vh] w-full lg:h-full lg:flex-1">
          <div className="absolute top-4 left-1/2 z-[1000] w-[90%] max-w-md -translate-x-1/2 rounded-lg bg-white px-4 py-2 shadow-md">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Search01Icon} className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search location or coordinates (lat, lng)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <MapContainer
            center={[fence.center.lat, fence.center.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={[fence.center.lat, fence.center.lng]} />
            <DraggableMarker
              position={[fence.center.lat, fence.center.lng]}
              onDragEnd={handleMarkerDragEnd}
            />
            <Circle
              center={[fence.center.lat, fence.center.lng]}
              radius={fence.radius}
              pathOptions={{
                fillColor: "#22c55e",
                fillOpacity: 0.2,
                color: "#22c55e",
                weight: 3,
              }}
            />
            <ResizeHandle
              center={fence.center}
              radius={fence.radius}
              onResize={handleRadiusChange}
            />
          </MapContainer>
        </div>

        <div
          className={`w-full overflow-y-auto bg-white lg:w-80 lg:shadow-xl ${
            isCollapsed ? "lg:w-0" : ""
          }`}
        >
          <div className={`p-4 sm:p-6 ${isCollapsed ? "hidden lg:block" : "block"}`}>
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Coverage Summary</h2>
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="hidden text-gray-400 hover:text-gray-600 lg:block"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Real time report</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Radius: </span>
                    <span className="font-semibold text-gray-900">{fence.radius / 1000} km</span>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="mb-1 text-gray-600">
                      Center: <span className="font-semibold text-green-600">{locationName}</span>
                    </div>
                    <div className="font-mono text-xs text-gray-500">
                      {fence.center.lat.toFixed(4)}°, {fence.center.lng.toFixed(4)}°
                    </div>
                  </div>

                  {address && (
                    <div className="border-b border-gray-100 pb-3">
                      <div className="text-xs text-gray-600">Address:</div>
                      <div className="mt-1 text-sm text-gray-900">{address}</div>
                    </div>
                  )}

                  {nearbyPlaces.areas.length > 0 && (
                    <div className="border-b border-gray-100 pb-3">
                      <div className="mb-2 font-semibold text-gray-900">Areas Covered:</div>
                      <ul className="space-y-1">
                        {nearbyPlaces.areas.map((area, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {area.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nearbyPlaces.landmarks.length > 0 && (
                    <div>
                      <div className="mb-2 font-semibold text-gray-900">Landmarks Included:</div>
                      <ul className="space-y-1">
                        {nearbyPlaces.landmarks.map((landmark, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {landmark.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute top-1/2 left-4 z-[1000] hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg lg:flex"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5 rotate-180 text-gray-600" />
          </button>
        )}
      </div>

      <Modal
        title="Delete Geofence"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: isLoadingDelete }}
        cancelButtonProps={{ disabled: isLoadingDelete }}
      >
        <p>Are you sure you want to delete this geofence? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default DeliveryGeoFence;
