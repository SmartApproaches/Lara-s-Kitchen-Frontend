import React from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { useGetGeofenceQuery } from "../../../../../redux/slices/super-admin/businessSuiteApiSlice";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapWithCircle = ({ center, radius }) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      style={{ width: "100%", height: "256px", borderRadius: "15px" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[center.lat, center.lng]} />
      <Circle
        center={[center.lat, center.lng]}
        radius={radius}
        pathOptions={{
          strokeColor: "#22c55e",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#22c55e",
          fillOpacity: 0.2,
          color: "#22c55e",
        }}
      />
    </MapContainer>
  );
};

const GeoFence = () => {
  const navigate = useNavigate();
  const {
    data: geofenceResponse,
    isLoading: isLoadingGeofence,
    error: isErrorGeofence,
  } = useGetGeofenceQuery();

  const geofenceData = geofenceResponse?.data || [];

  const deliveryGeofence = geofenceData.find((fence) => fence.type === "delivery");
  const dineInGeofence = geofenceData.find((fence) => fence.type === "dine_in");

  const deliveryFence = deliveryGeofence
    ? {
        center: {
          lat: parseFloat(deliveryGeofence.latitude),
          lng: parseFloat(deliveryGeofence.longitude),
        },
        radius: deliveryGeofence.radius,
        address: deliveryGeofence.address,
      }
    : {
        center: { lat: 0, lng: 0 },
        radius: 0,
        address: "Not Set",
      };

  const dineInFence = dineInGeofence
    ? {
        center: {
          lat: parseFloat(dineInGeofence.latitude),
          lng: parseFloat(dineInGeofence.longitude),
        },
        radius: dineInGeofence.radius,
        address: dineInGeofence.address,
      }
    : {
        center: { lat: 0, lng: 0 },
        radius: 0,
        address: "Not Set",
      };

  if (isLoadingGeofence) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading geofence data...</div>
      </div>
    );
  }

  if (isErrorGeofence) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">
          {isErrorGeofence?.data?.message || "Error loading geofence data"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-3">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              onClick={() => navigate(-1)}
              className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-900"
            />
            <h1 className="text-2xl font-bold text-gray-900">Geo fence</h1>
          </div>
          <p className="text-gray-600">
            Control how far your dine-in and delivery services can reach.
          </p>
        </div>

        <div className="grid gap-6 px-4 py-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm">
            <div className="py-3">
              <h2 className="text-lg font-semibold text-gray-900">Delivery Geofence</h2>
            </div>

            <div className="h-64">
              <MapWithCircle center={deliveryFence.center} radius={deliveryFence.radius * 1000} />
            </div>

            <div className="bg-accent my-5 rounded-[10px] p-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Center:</span>
                  <span className="text-primary font-medium">
                    {deliveryFence.center.lat.toFixed(4)}°, {deliveryFence.center.lng.toFixed(4)}°
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Radius:</span>
                  <span className="text-primary font-medium">{deliveryFence.radius} km</span>
                </div>
              </div>
            </div>

            <Link to="delivery" className="block">
              <button className="w-full rounded-lg bg-green-800 py-3 font-medium text-white transition-colors hover:bg-green-900">
                Update Range
              </button>
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm">
            <div className="py-3">
              <h2 className="text-lg font-semibold text-gray-900">Dine-In Geofence</h2>
            </div>

            <div className="h-64">
              <MapWithCircle center={dineInFence.center} radius={dineInFence.radius * 1000} />
            </div>

            <div className="bg-accent my-5 rounded-[10px] p-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Center:</span>
                  <span className="text-primary font-medium">
                    {dineInFence.center.lat.toFixed(4)}°, {dineInFence.center.lng.toFixed(4)}°
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Radius:</span>
                  <span className="text-primary font-medium">{dineInFence.radius} km</span>
                </div>
              </div>
            </div>

            <Link to="dine-in" className="block">
              <button className="bg-primary w-full rounded-lg py-3 font-medium text-white transition-colors hover:bg-green-900">
                Update Range
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoFence;
