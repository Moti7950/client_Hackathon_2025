import type { Coordinate } from "../contexts/Drone.context";

export function normalizePoint(input: { lat: number | string; len?: number | string; lng?: number | string }): Coordinate {
  const lat = Number(input.lat);
  const lng = Number(input.lng ?? input.len);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error("Invalid lat/lng");
  return [lat, lng];
}

export function moveDroneToLatLng(
  lat: number | string,
  lng: number | string,
  setDronePosition: (pos: Coordinate) => void
) {
  const la = Number(lat), ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return;
  setDronePosition([la, ln]);
}

export function moveDroneToPoint(
  point: { lat: number | string; len?: number | string; lng?: number | string },
  setDronePosition: (pos: Coordinate) => void
) {
  setDronePosition(normalizePoint(point));
}
