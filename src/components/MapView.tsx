import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapView.css";
import LocationClick from "./LocationClick";
import type { location } from "../types/location";

function MapView() {
  const [view, setView] = useState("map");
  const [locations, setLocations] = useState<location[]>([]);

  useEffect(() => {
    fetch("http://localhost:6578/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((err) => {
        console.error("שגיאה בטעינת נתונים:", err);
      });
  }, []);

  return (
    <>
      <button
        id="setView"
        onClick={() => {
          view === "map" ? setView("satellite") : setView("map");
        }}
      >
        view
      </button>

      <MapContainer center={[31.4167, 34.3333]} zoom={13}>
        {view === "map" ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          />
        )}
        <LocationClick onClick={() => {}} setLocations={setLocations} />

        {locations.map((loc) => (
          <React.Fragment key={loc.id}>
            <Marker position={[loc.lat, loc.len]}>
              <Popup>{loc.description}</Popup>
            </Marker>
            <Circle
              center={[loc.lat, loc.len]}
              radius={100}
              pathOptions={
                loc.type === "soldier" ? { color: "blue" } : { color: "red" }
              }
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </>
  );
}

export default MapView;
