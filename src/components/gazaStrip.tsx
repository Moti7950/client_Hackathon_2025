import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const smallGazaPolygon: [number, number][] = [
  [31.5105, 34.4730],
  [31.5105, 34.4735],
  [31.5100, 34.4735],
  [31.5100, 34.4730],
  [31.5105, 34.4730] // Closing the loop
];

const GazaZoomMap: React.FC = () => {
  return (
    <MapContainer
      center={[31.51025, 34.47325]} 
      zoom={20} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polygon
        positions={smallGazaPolygon}
        pathOptions={{ color: 'red', fillOpacity: 0.4 }}
      />
    </MapContainer>
  );
};

export default GazaZoomMap;
