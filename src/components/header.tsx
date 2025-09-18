import { ZeekLive } from "../utility/chengeFuncOnClickBtn";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const isZeek = pathname.endsWith("/homePage/zeek");

  const toggleZeek = () => {
    if (isZeek) nav("/homePage");
    else nav("/homePage/zeek");
    ZeekLive();
  };

  const triggerCapture = () => window.dispatchEvent(new Event("capture-zeek"));
  const triggerSendAI = () => window.dispatchEvent(new Event("send-ai"));

  return (
    <header>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button onClick={toggleZeek}>
          {isZeek ? "Back to Map" : "ZEEK live"}
        </button>
        {isZeek && (
          <>
            <button onClick={triggerCapture}>📸 צלם תמונה</button>
            <button onClick={triggerSendAI}>🤖 שלח ל-AI</button>
          </>
        )}
      </div>
    </header>
  );
}
