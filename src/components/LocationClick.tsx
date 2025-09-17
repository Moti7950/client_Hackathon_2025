import { useMapEvents } from "react-leaflet";
import * as turf from "@turf/turf";
import BASE_URL from "../config";


function LocationClick({
  onClick,
  setLocations,
}: {
  onClick: (lat: number, lng: number) => void;
  setLocations: (locations: any) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);

      const point = turf.point([lng, lat]);
      const buffered = turf.buffer(point, 100, { units: "meters" });

      fetch(`${BASE_URL}/locations/area`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buffered),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to send area");
          return res.json();
        })
        .then((data) => setLocations(data))
        .catch((err) => console.error(err));
    },
  });
  return null;
}

export default LocationClick;
