"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, MapPin } from "lucide-react";

// Fix leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialPos?: [number, number];
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: any }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      onLocationSelect(lat, lng, data.display_name || "Custom Location");
    } catch (e) {
      onLocationSelect(lat, lng, "Location Pin dropped");
    }
  };

  return position === null ? null : (
    <Marker position={position} icon={icon} />
  );
}

export default function LocationMap({ onLocationSelect, initialPos }: LocationMapProps) {
  return (
    <div className="h-[300px] w-full rounded-[2rem] overflow-hidden border-2 border-primary/10 shadow-inner relative z-10">
      <MapContainer 
        center={initialPos || [19.9975, 73.7898]} // Nashik default
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center gap-2 text-[10px] font-bold text-primary border border-primary/10 shadow-lg pointer-events-none z-[1000]">
        <MapPin className="w-3 h-3" />
        TAP ON MAP TO SET HARVEST LOCATION
      </div>
    </div>
  );
}
