import { useEffect, useState } from "react";
import { ArrowLeft01Icon, Clock01Icon, Search01Icon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";

const DineInGeoFence = () => {
  const navigate = useNavigate();
  const [fence, setFence] = useState({
    center: { lat: 54.9057, lng: -1.3822 },
    radius: 4000,
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [circle, setCircle] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    if (!window.google) return;

    const mapInstance = new window.google.maps.Map(document.getElementById("dine-in-map"), {
      center: fence.center,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const markerInstance = new window.google.maps.Marker({
      position: fence.center,
      map: mapInstance,
      draggable: true,
    });

    const circleInstance = new window.google.maps.Circle({
      map: mapInstance,
      center: fence.center,
      radius: fence.radius,
      fillColor: "#22c55e",
      fillOpacity: 0.2,
      strokeColor: "#22c55e",
      strokeWeight: 3,
      editable: true,
    });

    markerInstance.addListener("dragend", (e) => {
      const newCenter = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      circleInstance.setCenter(newCenter);
      setFence((prev) => ({ ...prev, center: newCenter }));
    });

    circleInstance.addListener("radius_changed", () => {
      setFence((prev) => ({ ...prev, radius: Math.round(circleInstance.getRadius()) }));
    });

    setMap(mapInstance);
    setMarker(markerInstance);
    setCircle(circleInstance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex max-w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex cursor-pointer items-center text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft01Icon className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Dine in Geofence</h1>
          </div>

          <div className="flex gap-3">
            <button className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-all hover:bg-gray-50">
              Cancel
            </button>
            <button className="rounded-lg bg-green-700 px-6 py-2 font-medium text-white transition-all hover:bg-green-800">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        <div
          className={`overflow-y-auto bg-white shadow-xl transition-all duration-300 ${
            isCollapsed ? "w-0" : "w-80"
          }`}
        >
          <div className={`p-6 ${isCollapsed ? "hidden" : "block"}`}>
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Coverage Summary</h2>
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <ArrowLeft01Icon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <Clock01Icon className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Real time report</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Radius: </span>
                    <span className="font-semibold text-gray-900">
                      {(fence.radius / 1000).toFixed(1)} km
                    </span>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="mb-1 text-gray-600">
                      Center:{" "}
                      <span className="font-medium text-green-600">Sunderland City Centre</span>
                    </div>
                    <div className="font-mono text-xs text-red-500">
                      [{fence.center.lat.toFixed(4)}° N, {Math.abs(fence.center.lng).toFixed(4)}° W]
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="mb-2 font-semibold text-gray-900">Areas Covered:</div>
                    <ul className="space-y-1.5 text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>City Centre</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Ashbrooke</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Millfield</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Hendon</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Roker</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-2 font-semibold text-gray-900">Landmarks Included:</div>
                    <ul className="space-y-1.5 text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Stadium of Light</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Sunderland College</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span>Keel Square</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:shadow-xl"
          >
            <ArrowLeft01Icon className="h-5 w-5 rotate-180 transform text-gray-600" />
          </button>
        )}

        <div className="relative flex-1">
          <div className="absolute top-6 left-1/2 z-10 flex min-w-[320px] -translate-x-1/2 transform items-center gap-3 rounded-lg bg-white px-4 py-2.5 shadow-md">
            <Search01Icon className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by coordinates"
              className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div id="dine-in-map" className="h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DineInGeoFence;
