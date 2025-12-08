import React from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { ArrowLeft01Icon } from "hugeicons-react";

const MapWithCircle = ({ center, radius }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "256px",
    borderRadius: "15px",
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    borderRadius: "28px",
  };

  const circleOptions = {
    strokeColor: "#22c55e",
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: "#22c55e",
    fillOpacity: 0.2,
  };

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} options={options}>
      <Marker position={center} />
      <Circle center={center} radius={radius} options={circleOptions} />
    </GoogleMap>
  );
};

const GeoFence = () => {
  const deliveryFence = {
    center: { lat: 6.5244, lng: 3.3792 },
    radius: 200,
  };

  const dineInFence = {
    center: { lat: 6.5244, lng: 3.3792 },
    radius: 350,
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-3">
            <ArrowLeft01Icon className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-900" />
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
              <MapWithCircle center={deliveryFence.center} radius={deliveryFence.radius} />
            </div>

            <div className="bg-accent my-5 rounded-[10px] p-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Covers:</span>
                  <span className="text-primary font-medium">
                    Within {deliveryFence.radius}m of City Centre
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Radius:</span>
                  <span className="text-primary font-medium">
                    {(deliveryFence.radius / 1000).toFixed(2)} km
                  </span>
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
              <MapWithCircle center={dineInFence.center} radius={dineInFence.radius} />
            </div>

            <div className="bg-accent my-5 rounded-[10px] p-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Covers:</span>
                  <span className="text-primary font-medium">
                    Within {dineInFence.radius}m of City Centre
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Radius:</span>
                  <span className="text-primary font-medium">
                    {(dineInFence.radius / 1000).toFixed(2)} km
                  </span>
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
