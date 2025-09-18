import { useState } from "react";
import { ZeekLive, MarkSuspicious, ComparingWithAI, TargetOfficer } from "../utility/chengeFuncOnClickBtn";
import { useLocation, useNavigate } from "react-router-dom";

// חדש: כדי לעדכן מיקום רחפן גלובלי
import { useDrone } from "../contexts/Drone.context";
// פונקציית עזר: מקבלת lat/lng כטקסטים ומעדכנת מיקום הרחפן
import { moveDroneToLatLng } from "../utility/dronFunction";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const { setDronePosition } = useDrone();

  // קלט ידני לנ"צ
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const toggleZeek = () => {
    if (pathname.endsWith("/homePage/zeek")) nav("/homePage");
    else nav("/homePage/zeek");
    ZeekLive();
  };

  // שליחת הנ"צ ל-ZEEK: מעדכן מיקום רחפן + נווט למסך הרחפן
  const sendToZeek = () => {
    let la = lat.trim();
    let ln = lng.trim();

    // מאפשר להזין "lat,lng" בשדה אחד
    if (!ln && la.includes(",")) {
      const parts = la.split(",");
      la = (parts[0] || "").trim();
      ln = (parts[1] || "").trim();
    }

    moveDroneToLatLng(la, ln, setDronePosition); // יתעלם אם לא תקין
    if (!pathname.endsWith("/homePage/zeek")) nav("/homePage/zeek");
    ZeekLive();
  };

  return (
    <>
      <header>
        <button onClick={toggleZeek}>
          {pathname.endsWith("/homePage/zeek") ? "Back to Map" : "ZEEK live"}
        </button>

        <button>get soldier locations</button>
        <button onClick={TargetOfficer}>Approval from a targets officer</button>
        <button onClick={MarkSuspicious}>create sespishes arwy</button>
        <button onClick={ComparingWithAI}>Comparing suspicious terrain images with AI</button>
      </header>
    </>
  );
}
