import React from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Circle,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";
import BASE_URL from "../config";
import { useDrone } from "../contexts/Drone.context";
import "../styles/zeek.css";

type Coordinate = [number, number];

type ServerLocation = {
  id: string | number;
  lat: number | string;
  lng?: number | string; // תמיכה גם ב-lng
  len?: number | string; // או len – לפי ה-API שלך
  description?: string;
  type?: "soldier" | "enemy" | string;
};

const NEARBY_RADIUS_M = 300 as const; // רדיוס "טווח הרחפן" במטרים

// מרכז המפה על הרחפן
const CenterMap: React.FC<{ position: Coordinate }> = ({ position }) => {
  const map = useMap();
  map.setView(position, 20);
  return null;
};

// מרחק בקירוב טוב (מטרים)
function distanceMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
) {
  const R = 6371000;
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

// bbox סביב נקודה
function bboxAround(lat: number, lng: number, radiusM: number) {
  const latRad = (lat * Math.PI) / 180;
  const dLat = radiusM / 111_320;
  const dLng = radiusM / (111_320 * Math.max(Math.cos(latRad), 1e-6));
  return {
    south: +(lat - dLat).toFixed(6),
    west: +(lng - dLng).toFixed(6),
    north: +(lat + dLat).toFixed(6),
    east: +(lng + dLng).toFixed(6),
  };
}

const DroneMap: React.FC = () => {
  // root לצורך מצב צילום "נקי"
  const containerRef = React.useRef<HTMLDivElement>(null);
  // מעטפת המפה – אותו אלמנט נצלם
  const mapRef = React.useRef<HTMLDivElement>(null);

  const { dronePosition } = useDrone();

  // נתונים מהשרת
  const [nearby, setNearby] = React.useState<ServerLocation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const fetchNearby = React.useCallback(async (lat: number, lng: number) => {
    const { south, west, north, east } = bboxAround(lat, lng, NEARBY_RADIUS_M);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      const url = new URL(`${BASE_URL}/locations`);
      url.searchParams.set("bbox", `${south},${west},${north},${east}`);

      const res = await fetch(url.toString(), { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ServerLocation[] = await res.json();

      const cleaned = data
        .map((loc) => {
          const latNum = Number(loc.lat);
          const lngNum = Number((loc.lng as any) ?? (loc.len as any));
          return { ...loc, lat: latNum, lng: lngNum };
        })
        .filter(
          (p) =>
            Number.isFinite(p.lat as number) && Number.isFinite(p.lng as number)
        )
        .filter(
          (p) =>
            distanceMeters(lat, lng, p.lat as number, p.lng as number) <=
            NEARBY_RADIUS_M
        );

      setNearby(cleaned);
    } catch (e: any) {
      if (e?.name !== "AbortError")
        console.error("failed to fetch nearby locations", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // טען רשימת נקודות כשמיקום הרחפן משתנה
  React.useEffect(() => {
    fetchNearby(dronePosition[0], dronePosition[1]);
    return () => abortRef.current?.abort();
  }, [dronePosition, fetchNearby]);

  // --- תצוגה מקדימה ---
  const [lastCapture, setLastCapture] = React.useState<string | null>(null);
  const [previewLarge, setPreviewLarge] = React.useState(false);

  // מצלם רק את אריחי המפה (ללא HUD/מרקרים/ציורים/בקרות)
  const captureMapTilesOnly = async (): Promise<string | null> => {
    if (!mapRef.current || !containerRef.current) return null;
    containerRef.current.classList.add("capture-clean"); // מסתיר שכבות Overlay בזמן הצילום
    try {
      const canvas = await html2canvas(mapRef.current, {
        backgroundColor: null,
        useCORS: true,
        ignoreElements: (el) => el.classList?.contains("nocapture"),
      });
      const image = canvas.toDataURL("image/png");
      setLastCapture(image); // שמירה לתצוגה מקדימה
      setPreviewLarge(false); // מתחיל בקטן; לחיצה תגדיל
      return image;
    } finally {
      containerRef.current.classList.remove("capture-clean");
    }
  };

  // שליחה ל-AI: תמונה + נקודות + פרטי הרחפן
  const sendToAI = async () => {
    const image = await captureMapTilesOnly();
    if (!image) return;

    const payload = {
      drone: { lat: dronePosition[0], lng: dronePosition[1] },
      radius_m: NEARBY_RADIUS_M,
      points: nearby.map((p) => ({
        id: String(p.id),
        lat: Number(p.lat),
        lng: Number((p.lng as any) ?? (p.len as any)),
        type: p.type ?? null,
        description: p.description ?? null,
      })),
      image, // dataURL
    };

    try {
      await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("sendToAI failed", e);
    }

    handleCapture(dronePosition, image);
  };

  // חיבור לכפתורי ה-Header (אירועים גלובליים)
  React.useEffect(() => {
    const onCapture = () => {
      captureMapTilesOnly();
    };
    const onSendAI = () => {
      sendToAI();
    };
    window.addEventListener("capture-zeek", onCapture);
    window.addEventListener("send-ai", onSendAI);
    return () => {
      window.removeEventListener("capture-zeek", onCapture);
      window.removeEventListener("send-ai", onSendAI);
    };
  }, [dronePosition, nearby]); // nearby חשוב כי שולחים נקודות עדכניות

  // Hook פנימי שלך – אם תרצה לשלוח שרת/לוג
  const handleCapture = (position: Coordinate, image: string) => {
    console.log("Drone coordinates:", position);
    console.log("Captured image:", image);
  };

  return (
    <div className="zeek-root" ref={containerRef}>
      {/* HUD שמאלי */}
      <div className="zeek-hud">
        <div>🚁 מיקום הרחפן</div>
        <div>Lat: {dronePosition[0].toFixed(6)}</div>
        <div>Lng: {dronePosition[1].toFixed(6)}</div>
        <div className="zeek-hud__row">
          📍 נקודות בטווח (מהשרת): <b>{nearby.length}</b>{" "}
          {loading ? "…טוען" : ""}
        </div>
      </div>

      {/* מעטפת המפה – זה מה שנצלם */}
      <div ref={mapRef} className="zeek-mapWrap">
        <MapContainer
          center={dronePosition}
          zoom={20}
          scrollWheelZoom={false}
          dragging={true}
          className="zeek-map"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
          />

          {/* מרכז מפה לרחפן */}
          <CenterMap position={dronePosition} />
          {/* הרחפן (אדום) כצלב */}
          {(() => {
            const [lat, lng] = dronePosition;
            const sizeM = 40; // אורך חצי-קו במטרים (סה״כ ~80m מקצה לקצה)
            const latRad = (lat * Math.PI) / 180;
            const dLat = sizeM / 111_320;
            const dLng = sizeM / (111_320 * Math.max(Math.cos(latRad), 1e-6));
            const lineStyle = { color: "#ff0000", weight: 2 };
            return (
              <>
                {/* קו אנכי */}
                <Polyline
                  positions={[
                    [lat - dLat, lng],
                    [lat + dLat, lng],
                  ]}
                  pathOptions={lineStyle}
                />
                {/* קו אופקי */}
                <Polyline
                  positions={[
                    [lat, lng - dLng],
                    [lat, lng + dLng],
                  ]}
                  pathOptions={lineStyle}
                />
              </>
            );
          })()}

          {/* טבעת טווח הרחפן */}
          <Circle
            center={dronePosition}
            radius={NEARBY_RADIUS_M}
            pathOptions={{ color: "#2196F3", weight: 1, fillOpacity: 0.3 }}
          />

          {/* נקודות מהשרת – CircleMarker (תמיד נראה) + Marker עם Popup */}
          {nearby.map((p) => {
            const lat = p.lat as number;
            const lng = (p.lng as number) ?? (p.len as number);
            const isSoldier = p.type === "soldier";
            return (
              <React.Fragment key={String(p.id)}>
                <CircleMarker
                  center={[lat, lng]}
                  radius={7}
                  pathOptions={
                    isSoldier
                      ? {
                          color: "#1e88e5",
                          fillColor: "#42a5f5",
                          fillOpacity: 0.9,
                          weight: 2,
                        }
                      : {
                          color: "#e53935",
                          fillColor: "#ef5350",
                          fillOpacity: 0.9,
                          weight: 2,
                        }
                  }
                />
                <Marker position={[lat, lng]} zIndexOffset={1000}>
                  <Popup>{p.description ?? "—"}</Popup>
                </Marker>
                <Circle
                  center={[lat, lng]}
                  radius={100}
                  pathOptions={isSoldier ? { color: "blue" } : { color: "red" }}
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* תצוגה מקדימה – לחיצה מגדילה/סוגרת */}
      {lastCapture && (
        <div
          className="zeek-preview nocapture"
          onClick={() => {
            setPreviewLarge(false);
            setLastCapture(null);
          }} // ← סגור תמיד
          title="לחץ לסגירה"
        >
          <div className="zeek-preview__head">תצוגה מקדימה (לחץ לסגירה)</div>
          <img src={lastCapture} alt="capture preview" />
        </div>
      )}
    </div>
  );
};

export default DroneMap;
