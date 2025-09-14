import React, { useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapView.css";
import LocationClick from "./LocationClick";

function MapView() {
  const [view, setView] = useState("map");
  const [locations, _setLocations] = useState(
    // קוד זה לדוגמא
    // במקור הוא צריך להגיע מהשרת
    [
      {
        id: 1,
        description: "מיקום ראשון",
        type: "soldier",
        lat: 31.5016,
        lng: 34.4667,
      },
      {
        id: 2,
        description: "מיקום שני",
        type: "terorist",
        lat: 31.523,
        lng: 34.48,
      },
      {
        id: 3,
        description: "מיקום שלישי",
        type: "soldier",
        lat: 31.55,
        lng: 34.465,
      },
    ]
  );

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

      <MapContainer center={[31.5016, 34.4667]} zoom={13}>
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
        <LocationClick
          onClick={(lat, lng) => {
            console.log(lat, lng);
          }}
        />

        {locations.map((loc) => (
          <React.Fragment key={loc.id}>
            <Marker position={[loc.lat, loc.lng]}>
              <Popup>{loc.description}</Popup>
            </Marker>
            <Circle
              center={[loc.lat, loc.lng]}
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
