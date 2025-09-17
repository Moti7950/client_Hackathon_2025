import React from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Circle,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";
import L from "leaflet";
import { useLocations } from "../contexts/Locations.context.tsx";

type Coordinate = [number, number];

// כמה מטרים נחשבים "בקרבת הרחפן"
const NEARBY_RADIUS_M = 300;

const CenterMap: React.FC<{ position: Coordinate }> = ({ position }) => {
  const map = useMap();
  map.setView(position, 20); // זום גבוה כדי לראות את הנקודה
  return null;
};

const DroneMap: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // <<< הרחפן מוצב בדיוק בנ״צ שנתת >>>
  const [dronePosition] = React.useState<Coordinate>([31.328623, 34.327602]);

  // כל המיקומים מה־context (אותו מקור כמו ב-MapView)
  const { locations } = useLocations();

  // סינון: רק נקודות בקרבת הרחפן (במטרים)
  const nearbyLocations = React.useMemo(() => {
    const dLL = L.latLng(dronePosition[0], dronePosition[1]);
    return (locations ?? [])
      .map((loc) => {
        const lat = Number(loc.lat);
        const lng = Number((loc as any).lng ?? (loc as any).len); // len נתמך
        return { ...loc, lat, lng };
      })
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .filter((p) => L.latLng(p.lat, p.lng).distanceTo(dLL) <= NEARBY_RADIUS_M);
  }, [locations, dronePosition]);

  // הנקודה הכי קרובה (אם קיימת) להדגשה ויזואלית
  const nearest = React.useMemo(() => {
    const dLL = L.latLng(dronePosition[0], dronePosition[1]);
    let best: any = null;
    let bestD = Infinity;
    for (const p of nearbyLocations) {
      const d = L.latLng(p.lat, p.lng).distanceTo(dLL);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best ?? null;
  }, [nearbyLocations, dronePosition]);

  // צילום תמונה (נשאר)
  const captureMap = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current);
    const image = canvas.toDataURL("image/png");
    handleCapture(dronePosition, image);
  };

  const handleCapture = (position: Coordinate, image: string) => {
    console.log("Drone coordinates:", position);
    console.log("Captured image:", image);
    // שליחה לשרת אם צריך
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }} ref={containerRef}>
      {/* כפתור צילום */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <button
          onClick={captureMap}
          style={{
            padding: "10px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          📸 צלם תמונה
        </button>
      </div>

      {/* מידע על מיקום הרחפן */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "monospace",
        }}
      >
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

        {/* מרכז מפה לרחפן */}
        <CenterMap position={dronePosition} />

        {/* הרחפן (אדום) */}
        <CircleMarker
          center={dronePosition}
          radius={8}
          pathOptions={{ color: "#ff0000", fillColor: "#ff4444", fillOpacity: 0.9, weight: 2 }}
        />

        {/* טבעת תחום קרבה כדי לראות מה אמור להופיע */}
        <Circle
          center={dronePosition}
          radius={NEARBY_RADIUS_M}
          pathOptions={{ color: "#2196F3", weight: 1, fillOpacity: 0.08 }}
        />

        {/* מציג רק נקודות קרובות לרחפן */}
        {nearbyLocations.map((p) => (
          <React.Fragment key={String(p.id)}>
            <Marker position={[p.lat, p.lng]} zIndexOffset={1000}>
              <Popup>{p.description}</Popup>
            </Marker>
            <Circle
              center={[p.lat, p.lng]}
              radius={100}
              pathOptions={p.type === "soldier" ? { color: "blue" } : { color: "red" }}
            />
          </React.Fragment>
        ))}

        {/* הדגשה של הנקודה הקרובה ביותר (אינדיקציה ברורה) */}
        {nearest && (
          <Circle
            center={[nearest.lat, nearest.lng]}
            radius={35}
            pathOptions={{ color: "orange", weight: 2, dashArray: "6 4", fillOpacity: 0 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default DroneMap;
