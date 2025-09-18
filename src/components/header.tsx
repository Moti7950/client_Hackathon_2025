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
    <>
      <header id="header">
        <img src="/public/Aman.png" id="amanLogo" alt="" />
        <img src="/public/logo.png" id="Logo" alt="" />
        <button id="toggleZeek" onClick={toggleZeek}>
          {pathname.endsWith("/homePage/zeek") ? "Back to Map" : "ZEEK live"}
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
