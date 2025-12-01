// src/components/ui/DynamicMap.tsx
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Fix marker icon paths (Leaflet + webpack/Next.js)
 */
try {
  // @ts-ignore
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
} catch (e) {
  // ignore in environments where require isn't available at build time
  // Next.js will handle this client-side.
}

/* ---------------------------
   Component: MapClickHandler
   - attaches map click handler to set marker and reverse-geocode.
---------------------------- */
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface DynamicMapProps {
  center: [number, number];
  zoom: number;
  onMapClick: (lat: number, lng: number) => void;
  markerPosition: [number, number] | null;
}

export default function DynamicMap({ center, zoom, onMapClick, markerPosition }: DynamicMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  );
}