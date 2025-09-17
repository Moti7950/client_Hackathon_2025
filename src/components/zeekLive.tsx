import React, { useState, useRef } from "react";
import { MapContainer, CircleMarker, TileLayer, useMap } from "react-leaflet";
import html2canvas from "html2canvas";
import '../styles/zeek.css';

type Coordinate = [number, number];

const CenterMap: React.FC<{ position: Coordinate }> = ({ position }) => {
  const map = useMap();
  map.setView(position, 20);
  return null;
};

const DroneMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  // גבולות האזור שבו הרחפן יכול להיות
  const areaBounds: [[number, number], [number, number]] = [
    [31.5445, 34.5165],
    [31.545, 34.517],
  ];

  // מיקום הרחפן
  const [dronePosition, setDronePosition] = useState<Coordinate>([
    (areaBounds[0][0] + areaBounds[1][0]) / 2,
    (areaBounds[0][1] + areaBounds[1][1]) / 2,
  ]);

  // פונקציה להזזת הרחפן למיקום חדש
  const moveDroneTo = (newPosition: Coordinate) => {
    setDronePosition(newPosition);
  };

  // פונקציה לצילום תמונה של המפה ושליחת הנ״צ והתמונה
  const captureMap = async () => {
    if (mapRef.current) {
      const canvas = await html2canvas(mapRef.current);
      const image = canvas.toDataURL("image/png"); // תמונה כ-base64
      handleCapture(dronePosition, image);
    }
  };

  // פונקציה שמקבלת את הנ״צ והתמונה (אתה יכול להחליף אותה בפעולה שלך)
  const handleCapture = (position: Coordinate, image: string) => {
    console.log("Drone coordinates:", position);
    console.log("Captured image:", image);
    // כאן אפשר לשלוח את הנתונים לשרת או פונקציה אחרת
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }} ref={mapRef}>
      {/* לחצן צילום */}
      <div id="capture-button" >
        <button 
          onClick={captureMap}
        >
          📸 צלם תמונה
        </button>
      </div>

      {/* מידע על מיקום הרחפן */}
      <div id="location-info-zeek" > 
        <div>🚁 מיקום הרחפן:</div>
        <div>Lat: {dronePosition[0].toFixed(6)}</div>
        <div>Lng: {dronePosition[1].toFixed(6)}</div>
      </div>

      <MapContainer
        center={dronePosition}
        zoom={20}
        scrollWheelZoom={false}
        dragging={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
        />

        <CenterMap position={dronePosition} />

        <CircleMarker
          center={dronePosition}
          radius={8}
          pathOptions={{
            color: "#ff0000",
            fillColor: "#ff4444",
            fillOpacity: 0.9,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default DroneMap;
