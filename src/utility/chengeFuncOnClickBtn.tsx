import type { location } from "../types/location";

export function ZeekLive() {
  console.log("from ZeekLive function");
}

export async function SoldierLocations(setLocations: (locs: location[]) => void) {
  try {
    const res = await fetch("http://localhost:6578/locations");
    const data: location[] = await res.json();
    const soldierLocations = data.filter((loc) => loc.type === "soldier");
    setLocations(soldierLocations);
  } catch (err) {
    console.error("שגיאה בטעינת נתונים:", err);
  }
}

export function TargetOfficer() {
  console.log("from TargetOfficer function");
}

export function MarkSuspicious() {
  console.log("from MarkSuspicious function");
}

export function ComparingWithAI() {
  console.log("from ComparingWithAI function");
}
