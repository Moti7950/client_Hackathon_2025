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
import BASE_URL from "../config";
import { useDrone } from "../contexts/Drone.context";

type Coordinate = [number, number];

type ServerLocation = {
  id: string | number;
  lat: number | string;
  lng?: number | string;  // אם ה־API שלך מחזיר lng
  len?: number | string;  // ואם הוא מחזיר len – נתמוך גם בזה
  description?: string;
  type?: "soldier" | "enemy" | string;
};

// ====== הגדרות ======
const NEARBY_RADIUS_M = 300 as const; // רדיוס "טווח הרחפן" במטרים

// מרכז המפה על הרחפן
const CenterMap: React.FC<{ position: Coordinate }> = ({ position }) => {
  const map = useMap();
  map.setView(position, 20); // זום גבוה
  return null;
};

// המרחק בין שתי נקודות (מטרים) – בלי ספריות נוספות
function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000; // מטר
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// מחשב bbox סביב נקודה לפי רדיוס (בקירוב טוב)
function bboxAround(lat: number, lng: number, radiusM: number) {
  const latRad = (lat * Math.PI) / 180;
  const dLat = radiusM / 111_320;                         // מעלות לרדיוס בקווי רוחב
  const dLng = radiusM / (111_320 * Math.max(Math.cos(latRad), 1e-6)); // הגנה ליד הקטבים
  return {
    south: +(lat - dLat).toFixed(6),
    west:  +(lng - dLng).toFixed(6),
    north: +(lat + dLat).toFixed(6),
    east:  +(lng + dLng).toFixed(6),
  };
}

const DroneMap: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // <<< הרחפן מוצב בנ״צ שהבאת >>>
 const { dronePosition} = useDrone();


  // נתונים שבאים מהשרת עבור הטווח של הרחפן
  const [nearby, setNearby] = React.useState<ServerLocation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  // בקשה לשרת: “תן נקודות בתוך ה-bbox סביב הרחפן”
  const fetchNearby = React.useCallback(async (lat: number, lng: number) => {
    const { south, west, north, east } = bboxAround(lat, lng, NEARBY_RADIUS_M);

    // ביטול בקשה קודמת אם רצה
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      // מניחים שהשרת תומך ב-/locations?bbox=s,w,n,e (כמו אצלך)
      const url = new URL(`${BASE_URL}/locations`);
      url.searchParams.set("bbox", `${south},${west},${north},${east}`);

      const res = await fetch(url.toString(), { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ServerLocation[] = await res.json();

      // ניקוי + סינון סופי לפי מעגל (ליתר דיוק; bbox הוא ריבוע)
      const cleaned = data
        .map((loc) => {
          const latNum = Number(loc.lat);
          const lngNum = Number((loc.lng as any) ?? (loc.len as any));
          return { ...loc, lat: latNum, lng: lngNum };
        })
        .filter((p) => Number.isFinite(p.lat as number) && Number.isFinite(p.lng as number))
        .filter((p) => distanceMeters(lat, lng, p.lat as number, p.lng as number) <= NEARBY_RADIUS_M);

      setNearby(cleaned);
    } catch (e: any) {
      if (e?.name !== "AbortError") console.error("failed to fetch nearby locations", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // טען נקודות בטווח כשנכנסים/כשמיקום הרחפן משתנה
  React.useEffect(() => {
    fetchNearby(dronePosition[0], dronePosition[1]);
    return () => abortRef.current?.abort();
  }, [dronePosition, fetchNearby]);

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
        >
          📸 צלם תמונה
        </button>
      </div>

      {/* מיקום הרחפן + מונה מהשרת */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: -50,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px",
          margin: "100px",
          borderRadius: "5px",
          fontFamily: "monospace",
          minWidth: 220,
        }}
      >
        <div>🚁 מיקום הרחפן</div>
        <div>Lat: {dronePosition[0].toFixed(6)}</div>
        <div>Lng: {dronePosition[1].toFixed(6)}</div>
        <div style={{ marginTop: 6 }}>
          📍 נקודות בטווח (מהשרת): <b>{nearby.length}</b> {loading ? "…טוען" : ""}
        </div>
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
          pathOptions={{
            color: "#ff0000",
            fillColor: "#ff4444",
            fillOpacity: 0.9,
            weight: 2,
          }}
        />

        {/* טבעת טווח הרחפן (ויזואלי) */}
        <Circle
          center={dronePosition}
          radius={NEARBY_RADIUS_M}
          pathOptions={{ color: "#2196F3", weight: 1, fillOpacity: 0.08 }}
        />

        {/* מציגים רק את מה שהשרת החזיר עבור הטווח */}
        {nearby.map((p) => {
          const lat = p.lat as number;
          const lng = (p.lng as number) ?? (p.len as number);
          return (
            <React.Fragment key={String(p.id)}>
              <Marker position={[lat, lng]} zIndexOffset={1000}>
                <Popup>{p.description ?? "—"}</Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={100}
                pathOptions={p.type === "soldier" ? { color: "blue" } : { color: "red" }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DroneMap;
