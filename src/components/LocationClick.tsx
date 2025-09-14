import { useMapEvents } from "react-leaflet";

function LocationClick({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);

      fetch("https://server-hackathon-2025.onrender.com/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to send location");
          return res.json();
        })
        .then((data) => console.log("Location saved:", data))
        .catch((err) => console.error(err));
    },
  });
  return null;
}

export default LocationClick;
