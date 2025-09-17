import {ZeekLive ,MarkSuspicious , ComparingWithAI , SoldierLocations, TargetOfficer} from "../utility/chengeFuncOnClickBtn";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header(
) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const toggleZeek = () => {
    if (pathname.endsWith("/homePage/zeek")) nav("/homePage");
    else nav("/homePage/zeek");
    ZeekLive();
  };
  return (
    <>
      <header>
        <button onClick={toggleZeek}>
        {pathname.endsWith("/homePage/zeek") ? "Back to Map" : "ZEEK live"}
        </button>
        <button >get soldier locations</button>
        <button onClick={TargetOfficer}>Approval from a targets officer</button>
        <button onClick={MarkSuspicious}>create sespishes arwy</button>
        <button onClick={ComparingWithAI}>
          Comparing suspicious terrain images with AI
        </button>
      </header>
    </>
  );
}
