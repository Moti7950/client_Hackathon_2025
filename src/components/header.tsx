import { useLocations } from "../contexts/Locations.context.tsx";
import {
  ZeekLive,
  MarkSuspicious,
  ComparingWithAI,
  SoldierLocations,
  TargetOfficer,
} from "../utility/chengeFuncOnClickBtn";
export default function Header() {
  const { setLocations } = useLocations();
  return (
    <>
      <header>
        <button onClick={ZeekLive}>zeek live</button>

        <button onClick={() => SoldierLocations(setLocations)}>
          get soldier locations
        </button>
        <button onClick={TargetOfficer}>Approval from a targets officer</button>
        <button onClick={MarkSuspicious}>create sespishes arwy</button>
        <button onClick={ComparingWithAI}>
          Comparing suspicious terrain images with AI
        </button>
      </header>
    </>
  );
}
