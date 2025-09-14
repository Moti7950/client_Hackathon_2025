import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapView.css";

function MapView() {
  const [locations, _setLocations] = useState(
    // קוד זה לדוגמא
    // במקור הוא צריך להגיע מהשרת
    [
      { id: 1, name: "מיקום ראשון", lat: 31.5016, lng: 34.4667 },
      { id: 2, name: "מיקום שני", lat: 31.523, lng: 34.47 },
      { id: 3, name: "מיקום שלישי", lat: 31.55, lng: 34.465 },
    ]
  );

  return (
    <MapContainer center={[31.5016, 34.4667]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
