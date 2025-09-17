import React from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { useLocations } from "../contexts/Locations.context";

const MarkedArea: [number, number][] = [
  [31.545, 34.5165],
  [31.545, 34.517],
  [31.5445, 34.517],
  [31.5445, 34.5165],
  [31.545, 34.5165], // Closing the loop
];

const ZeekLive: React.FC = () => {
    const { locations } = useLocations();
  const polygon = turf.polygon([
    [...MarkedArea.map(([lat, lng]) => [lng, lat])],
  ]);
  const filteredLocations = locations.filter((loc) => {
    const point = turf.point([loc.len, loc.lat]);
    return turf.booleanPointInPolygon(point, polygon);
  });

  return (
    <MapContainer
      center={[31.545, 34.5165]} 
      zoom={20} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polygon
        positions={MarkedArea}
        pathOptions={{ color: 'red', fillOpacity: 0.4 }}
      />

      {filteredLocations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.len]}>
          <Popup>{loc.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ZeekLive;
