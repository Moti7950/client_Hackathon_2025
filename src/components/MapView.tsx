import React, { useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Rectangle,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapView.css";
import { useLocations } from "../contexts/Locations.context.tsx";
import BASE_URL from "../config";
import { moveDroneToLatLng } from "../utility/dronFunction.tsx";
import { useDrone } from "../contexts/Drone.context.tsx";

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvent("click", (e) => {
    onClick(e.latlng.lat, e.latlng.lng);
  });
  return null;
}

function MapView() {
  const [view, setView] = useState("map");
  const { locations, setLocations } = useLocations();
  const { setDronePosition } = useDrone();

  const [drawing, setDrawing] = useState(false);
  const [squareCenter, setSquareCenter] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    fetch(`${BASE_URL}/locations`)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((err) => {
        console.error("error loding data", err);
      });
  }, []);

  const squareSize = 0.005;

  return (
    <>
      <div style={{ position: "absolute", zIndex: 1000, padding: "10px" }}>
        <button id="wiewBtn"
          onClick={() => {
            view === "map" ? setView("satellite") : setView("map");
          }}
        >
          view
        </button>

        <button
        
        id="selectBtn"
          onClick={() => {
            
            setDrawing(!drawing);
            setSquareCenter(null);
          }}
          style={{ marginLeft: "50px" }}
        >
          {drawing ? "Cancel Selection" : "Select Point"}
        </button>
      </div>

      <MapContainer
        center={[31.4167, 34.3333]}
        zoom={13}
        style={{
          height: "100vh",
          width: "100vw",
          cursor: drawing ? "crosshair" : "grab",
        }}
      >
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

        {drawing && (
          <MapClickHandler
            onClick={(lat, lng) => {
              setSquareCenter([lat, lng]);
              moveDroneToLatLng(lat, lng, setDronePosition);
              setDrawing(false);
            }}
          />
        )}

        {squareCenter && (
          <>
            <Rectangle
              bounds={[
                [squareCenter[0] - squareSize, squareCenter[1] - squareSize],
                [squareCenter[0] + squareSize, squareCenter[1] + squareSize],
              ]}
              pathOptions={{ color: "green", weight: 3 }}
            />
            <Marker position={squareCenter}>
              <Popup>מרכז הריבוע</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </>
  );
}

export default MapView;
