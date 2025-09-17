import React from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocations } from "../contexts/locations.context";
import * as turf from "@turf/turf";

const smallGazaPolygon: [number, number][] = [
  [31.5105, 34.473],
  [31.5105, 34.4735],
  [31.51, 34.4735],
  [31.51, 34.473],
  [31.5105, 34.473], // Closing the loop
];

const GazaZoomMap: React.FC = () => {
  const { locations } = useLocations();
  const polygon = turf.polygon([
    [...smallGazaPolygon.map(([lat, lng]) => [lng, lat])],
  ]);
  const filteredLocations = locations.filter((loc) => {
    const point = turf.point([loc.len, loc.lat]);
    return turf.booleanPointInPolygon(point, polygon);
  });
  return (
    <MapContainer
      center={[31.51025, 34.47325]}
      zoom={20}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polygon
        positions={smallGazaPolygon}
        pathOptions={{ color: "red", fillOpacity: 0.4 }}
      />

      {filteredLocations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.len]}>
          <Popup>{loc.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GazaZoomMap;
